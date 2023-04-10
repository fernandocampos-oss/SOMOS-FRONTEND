import { Component, Inject, OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { forkJoin, Observable, of } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { NotificationService } from '@core/services';
import { AppConfig } from '@core/configs';
import { KeyParam, Role } from '@data/enums';
import { Param, Usuario, ZonaSearchResponse } from '@data/models';
import {
  ParamService,
  AuthService,
  ZonaService,
  UsuarioService,
} from '@data/services';

@UntilDestroy()
@Component({
  selector: 'app-usuario-register-update',
  templateUrl: './usuario-register-update.dialog.html',
  styleUrls: ['./usuario-register-update.dialog.scss'],
})
export class UsuarioRegisterUpdateDialog implements OnInit {
  startDate = new Date(new Date().getFullYear() - 30, 0, 1);
  maxFechaNacimiento = AppConfig.MAX_FECHA_NACIMIENTO;
  roleAdminCentral = Role.ADMIN_CENTRAL;
  sedes: Param[] = [];
  zonas: ZonaSearchResponse[] = [];
  roles: Param[] = [];
  form: FormGroup;
  isAdminCentral: boolean;
  isEdit: boolean;
  isRoleControlAccesoSelected = false;
  get numeroDocumentoField() {
    return this.form.get('numeroDocumento');
  }
  get codigoPlanillaField() {
    return this.form.get('codigoPlanilla');
  }
  get fechaNacimientoField() {
    return this.form.get('fechaNacimiento');
  }
  get numeroCelularField() {
    return this.form.get('numeroCelular');
  }
  get idRolField() {
    return this.form.get('idRol');
  }
  get idSedeField() {
    return this.form.get('idSede');
  }
  get idZonaControlField() {
    return this.form.get('idZonaControl');
  }
  constructor(
    private _fb: FormBuilder,
    private _paramService: ParamService,
    private _authService: AuthService,
    private _usuarioService: UsuarioService,
    private _zonaService: ZonaService,
    private _notification: NotificationService,
    private _dialogRef: MatDialogRef<void>,
    @Inject(MAT_DIALOG_DATA)
    public data: Usuario
  ) {
    this.isAdminCentral = this._authService.hasRol(Role.ADMIN_CENTRAL);
    this.isEdit = data?.idUsuario > 0;
  }

  ngOnInit(): void {
    console.log(this.data);
    this._createForm();
    this._loadParams();
    this._setupData();
    this._handleChanges();
  }
  private _handleChanges() {
    this.idSedeField.valueChanges
      .pipe(
        switchMap((idSede) => this._zonaService.search({ idSede })),
        untilDestroyed(this)
      )
      .subscribe((zonas) => {
        this.idZonaControlField.setValue(null);
        this.zonas = zonas;
      });
    this.idRolField.valueChanges.subscribe((idRol) => {
      this.isRoleControlAccesoSelected = idRol === Role.CONTROL_ACCESO;
      const validators = this.isRoleControlAccesoSelected
        ? [Validators.required]
        : [];
      this.idZonaControlField.setValidators(validators);
      this.idZonaControlField.updateValueAndValidity();
    });
  }
  private _setupData() {
    if (this.isEdit) {
      this._usuarioService
        .get(this.data.idUsuario)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          this.form.patchValue(data, { emitEvent: false });
          if (data.idSede) {
            this._zonaService
              .search({ idSede: data.idSede })
              .subscribe((zonas) => (this.zonas = zonas));
            this.idZonaControlField.setValue(data.idZonaControl);
          }
        });
    }
  }
  private _loadParams() {
    const roles$ = this._paramService.getRoles();
    const sedes$ = this.isAdminCentral
      ? this._paramService.getParams(KeyParam.SEDES).pipe(pluck(KeyParam.SEDES))
      : of([]);
    const zonas$ = this.isAdminCentral ? of([]) : this._zonaService.search();
    forkJoin([roles$, sedes$, zonas$])
      .pipe(untilDestroyed(this))
      .subscribe(([roles, sedes, zonas]) => {
        this.roles = roles;
        this.sedes = sedes;
        this.zonas = zonas;
      });
  }
  onSave() {
    if (this.form.valid) {
      const save$ = this._usuarioService.save(this.form.value);
      const update$ = this._usuarioService.update(
        this.data?.idUsuario,
        this.form.value
      );
      const transaction$: Observable<any> = this.isEdit ? update$ : save$;
      transaction$.pipe(untilDestroyed(this)).subscribe(() => {
        const messsage = this.isEdit
          ? 'Usuario editado correctamente'
          : 'Usuario creado correctamente';
        this._notification.success(messsage);
        this._dialogRef.close(true);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  private _createForm() {
    this.form = this._fb.group({
      numeroDocumento: [null, [Validators.required]],
      codigoPlanilla: [null, [Validators.required]],
      nombres: [null, [Validators.required]],
      apellidos: [null, [Validators.required]],
      fechaNacimiento: [null, [Validators.required]],
      numeroCelular: [null, [Validators.required]],
      correo: [null, [Validators.required]],
      idSede: [null, this.isAdminCentral ? [Validators.required] : []],
      idZonaControl: [null],
      idRol: [null, Validators.required],
    });
  }
}
