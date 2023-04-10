import { Component, Inject, OnInit } from '@angular/core';

import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { forkJoin, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { FormControlUtil } from '@core/utils';
import { NotificationService } from '@core/services';
import { Role } from '@data/enums';
import { Param, Zona, Sede } from '@data/models';
import { ZonaSearchResponse } from '../../../../data/models/zona/zona-search.model';
import {
  UbigeoService,
  SedeService,
  ZonaService,
  AuthService,
} from '@data/services';

@UntilDestroy()
@Component({
  selector: 'app-zona-register-update',
  templateUrl: './zona-register-update.dialog.html',
  styleUrls: ['./zona-register-update.dialog.scss'],
})
export class ZonaRegisterUpdateDialog implements OnInit {
  form: FormGroup;
  isEdit: boolean;
  roleAdminCentral = Role.ADMIN_CENTRAL;

  departmentCtrl = new FormControl(null);
  provinceCtrl = new FormControl(null);

  departments: Param[] = [];
  provinces: Param[] = [];
  districts: Param[] = [];
  sedes: Sede[] = [];

  get descripcionField() {
    return this.form.get('descripcion');
  }
  get direccionField() {
    return this.form.get('direccion');
  }
  get latitudField() {
    return this.form.get('latitud');
  }
  get longitudField() {
    return this.form.get('longitud');
  }
  get idSedeField() {
    return this.form.get('idSede');
  }
  get idUbigeoField() {
    return this.form.get('idUbigeo');
  }

  constructor(
    private _fb: FormBuilder,
    private _ubigeoService: UbigeoService,
    private _sedeService: SedeService,
    private _authService: AuthService,
    private _notification: NotificationService,
    private _zonaService: ZonaService,
    private _dialogRef: MatDialogRef<void>,
    @Inject(MAT_DIALOG_DATA)
    public data: ZonaSearchResponse
  ) {
    this.isEdit = data?.idZona > 0;
  }

  ngOnInit(): void {
    console.log(this.data);

    this._createForm();
    this._loadParams();
    this._setupUbigeoControls();
    this._setupDataForm();
  }
  onSave() {
    if (this.form.valid) {
      const save$ = this._zonaService.save(this.form.value);
      const update$ = this._zonaService.update(
        this.data?.idZona,
        this.form.value
      );
      const transaction$: Observable<any> = this.isEdit ? update$ : save$;
      transaction$.pipe(untilDestroyed(this)).subscribe(() => {
        const messsage = this.isEdit
          ? 'Zona editada correctamente'
          : 'Zona creada correctamente';
        this._notification.success(messsage);
        this._dialogRef.close(true);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  private _getProvinces$(codDepartment: string) {
    return this._ubigeoService.getProvincias(codDepartment);
  }

  private _getDistricts$(codDepartment: string, codProvince: string) {
    return this._ubigeoService.getDistritos(codDepartment, codProvince);
  }

  private _setupUbigeoControls() {
    const departmentChanges$ = this.departmentCtrl.valueChanges.pipe(
      tap(() => {
        this.provinces = [];
        this.districts = [];
        FormControlUtil.resetWithoutEvent(this.provinceCtrl);
        FormControlUtil.resetWithoutEvent(this.idUbigeoField);
      })
    );

    const provincesByDepartment$ = departmentChanges$.pipe(
      switchMap((value) => this._getProvinces$(value))
    );

    provincesByDepartment$
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.provinces = data));

    const provinceChanges$ = this.provinceCtrl.valueChanges.pipe(
      tap(() => {
        this.districts = [];
        FormControlUtil.resetWithoutEvent(this.idUbigeoField);
      })
    );
    const districtsByProvince$ = provinceChanges$.pipe(
      switchMap((codProvince) => {
        const codDepartment = this.departmentCtrl.value;
        return this._getDistricts$(codDepartment, codProvince);
      })
    );

    districtsByProvince$
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.districts = data));
  }
  private _loadParams() {
    const departments$ = this._ubigeoService.getDepartamentos();
    const sedes$ = this._sedeService.search();
    forkJoin([departments$, sedes$])
      .pipe(untilDestroyed(this))
      .subscribe(([departments, sedes]) => {
        this.departments = departments;
        this.sedes = sedes;
      });
  }
  private _setupDataForm() {
    if (this.isEdit) {
      this._zonaService
      .get(this.data.idZona)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
          this.form.patchValue(data);
          const codUbigeo = data.idUbigeo;
          if (codUbigeo) {
            const codDepartment = codUbigeo.slice(0, 2);
            const codProvince = codUbigeo.slice(2, 4);
            this.departmentCtrl.setValue(codDepartment, { emitEvent: false });
            this.provinceCtrl.setValue(codProvince, { emitEvent: false });
            const provinces$ = this._getProvinces$(codDepartment);
            const districts$ = this._getDistricts$(codDepartment, codProvince);
            forkJoin([provinces$, districts$])
              .pipe(untilDestroyed(this))
              .subscribe(([provinces, districts]) => {
                this.provinces = provinces;
                this.districts = districts;
              });
          }
        });
    }
  }
  private _createForm() {
    const isAdminCentral = this._authService.hasRol(Role.ADMIN_CENTRAL);
    this.form = this._fb.group({
      descripcion: [null, [Validators.required]],
      direccion: [null],
      latitud: [null],
      longitud: [null],
      idSede: [null, isAdminCentral ? [Validators.required] : []],
      idUbigeo: [null],
    });
  }
}
