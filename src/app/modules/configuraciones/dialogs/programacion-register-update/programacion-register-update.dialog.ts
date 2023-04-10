import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable, forkJoin, of } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { NotificationService } from '@core/services';
import { ProgramacionService, ZonaService, ParamService, AuthService } from '@data/services';
import { Programacion, Param, ZonaSearchResponse } from '@data/models';
import { TipoQr, KeyParam, Role } from '@data/enums';
import { switchMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@UntilDestroy()
@Component({
  selector: 'app-programacion-register-update',
  templateUrl: './programacion-register-update.dialog.html',
  styleUrls: ['./programacion-register-update.dialog.scss'],
})
export class ProgramacionRegisterUpdateDialog implements OnInit {
  form: FormGroup;
  isEdit: boolean;
  zonas: ZonaSearchResponse[] = [];
  sedeCtrl = new FormControl(null, Validators.required);
  roleAdminCentral = Role.ADMIN_CENTRAL;
  isAdminCentral: boolean;
  tiposQr: Param[] = [];
  sedes: Param[] = [];

  get descripcionField() {
    return this.form.get('descripcion');
  }
  get secondRefreshField() {
    return this.form.get('secondRefresh');
  }
  get fechaInicioField() {
    return this.form.get('fechaInicio');
  }
  get fechaFinField() {
    return this.form.get('fechaFin');
  }
  get idZonaField() {
    return this.form.get('idZona');
  }
  get idTipoQrField() {
    return this.form.get('idTipoQr');
  }
  get isDigital() {
    return this.idTipoQrField.value === TipoQr.DIGITAL;
  }

  constructor(
    private _fb: FormBuilder,
    private _notification: NotificationService,
    private _programacionService: ProgramacionService,
    private _zonaService: ZonaService,
    private _authService: AuthService,
    private _paramService: ParamService,
    private _dialogRef: MatDialogRef<void>,
    @Inject(MAT_DIALOG_DATA)
    public data: Programacion,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.isEdit = data?.idProgramacion > 0;
    this.isAdminCentral = this._authService.hasRol(Role.ADMIN_CENTRAL);
    this.matIconRegistry.addSvgIcon("qr_code",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/qr_2.svg"));
    this.matIconRegistry.addSvgIcon("cancel",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/cancel.svg"));
    this.matIconRegistry.addSvgIcon("save",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/fa-solid_save.svg"));
  }

  ngOnInit(): void {
    this._createForm();
    this._setupValidationSecondsRefresh();
    this._loadParams();
    this._setupDataForm();
    this._handleChanges();
  }
  private _handleChanges() {
    this.sedeCtrl.valueChanges
      .pipe(
        switchMap((idSede) => this._zonaService.search({ idSede })),
        untilDestroyed(this)
      )
      .subscribe((zonas) => {
        this.idZonaField.setValue(null);
        this.zonas = zonas;
      });
  }
  private _setupValidationSecondsRefresh() {
    this.idTipoQrField.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((idTipoQr) => {
        const validators =
          idTipoQr === TipoQr.DIGITAL ? [Validators.required] : [];
        this.secondRefreshField.setValidators(validators);
        this.secondRefreshField.updateValueAndValidity();
      });
  }
  private _loadParams() {
    const params$ = this._paramService.getParams(KeyParam.QR_TYPE, KeyParam.SEDES);
    const zonas$ = this.isAdminCentral ? of([]) : this._zonaService.search();
    forkJoin([params$, zonas$])
      .pipe(untilDestroyed(this))
      .subscribe(([params, zonas]) => {
        this.tiposQr = params[KeyParam.QR_TYPE];
        this.sedes = params[KeyParam.SEDES];
        this.zonas = zonas;
      });
  }
  private _createForm() {
    this.form = this._fb.group({
      descripcion: [null, [Validators.required]],
      secondRefresh: [null],
      fechaInicio: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
      idZona: [null, [Validators.required]],
      idTipoQr: [null, [Validators.required]],
    });
  }
  private _setupDataForm() {
    if (this.isEdit) {
      this.form.patchValue(this.data);
      this._zonaService
        .search({ idSede: this.data.idSede })
        .subscribe((zonas) => (this.zonas = zonas));
      this.sedeCtrl.setValue(this.data.idSede, {emitEvent: false});
    }
  }

  onSave() {
    if (this.form.valid) {
      const save$ = this._programacionService.save(this.form.value);
      const update$ = this._programacionService.update(
        this.data?.idProgramacion,
        this.form.value
      );
      const transaction$: Observable<any> = this.isEdit ? update$ : save$;
      transaction$.pipe(untilDestroyed(this)).subscribe(() => {
        const messsage = this.isEdit
          ? 'Programación editada correctamente'
          : 'Programación creada correctamente';
        this._notification.success(messsage);
        this._dialogRef.close(true);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
