import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { forkJoin, Observable, of } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs/operators';

import { NotificationService } from '@core/services';
import { KeyParam, Role } from '@data/enums';
import {
  AuthService,
  MarcacionService,
  ParamService,
  UsuarioService,
  ZonaService,
} from '@data/services';
import {
  Param,
  UsuarioNombres,
  MarcacionResponse,
  ZonaSearchResponse,
} from '@data/models';

@UntilDestroy()
@Component({
  selector: 'app-marcacion-register-update',
  templateUrl: './marcacion-register-update.dialog.html',
  styleUrls: ['./marcacion-register-update.dialog.scss'],
})
export class MarcacionRegisterUpdateDialog implements OnInit {
  form: FormGroup;
  sedeCtrl = new FormControl(null, Validators.required);
  tiposMarcacion: Param[] = [];
  roleAdminCentral = Role.ADMIN_CENTRAL;
  users: UsuarioNombres[] = [];
  sedes: Param[] = [];
  zonas: ZonaSearchResponse[] = [];
  isEdit: boolean;
  isAdminCentral: boolean;

  get fechaMarcacionField() {
    return this.form.get('fechaMarcacion');
  }
  get idTipoMarcacionField() {
    return this.form.get('idTipoMarcacion');
  }
  get latitudField() {
    return this.form.get('latitud');
  }
  get longitudField() {
    return this.form.get('longitud');
  }
  get idZonaField() {
    return this.form.get('idZona');
  }

  constructor(
    private _fb: FormBuilder,
    private _paramService: ParamService,
    private _usuarioService: UsuarioService,
    private _marcacionService: MarcacionService,
    private _authService: AuthService,
    private _zonaService: ZonaService,
    private _dialogRef: MatDialogRef<void>,
    private _notification: NotificationService,
    @Inject(MAT_DIALOG_DATA)
    public data: MarcacionResponse
  ) {
    this.isEdit = data?.idMarcacion > 0;
    this.isAdminCentral = this._authService.hasRol(Role.ADMIN_CENTRAL);
  }

  ngOnInit(): void {
    this._createForm();
    this._loadParams();
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
  private _setupDataForm(data: MarcacionResponse) {
    if (this.isEdit) {
      this.form.patchValue(data, { emitEvent: false});
      this._zonaService
        .search({ idSede: data.idSede })
        .subscribe((zonas) => (this.zonas = zonas));
      this.sedeCtrl.setValue(data.idSede, {emitEvent: false});
    }
  }
  private _loadParams() {
    const params$ = this._paramService.getParams(
      KeyParam.TIPO_MARCACION,
      KeyParam.SEDES
    );
    const usuariosNombres$ = this._usuarioService.getNombres(this.isEdit);
    const marcacion$ = this.isEdit
      ? this._marcacionService.get(this.data.idMarcacion)
      : of(null);
    const zonas$ = this.isAdminCentral ? of([]) : this._zonaService.search();
    forkJoin([params$, usuariosNombres$, marcacion$, zonas$]).subscribe(
      ([params, users, marcacion, zonas]) => {
        this.tiposMarcacion = params[KeyParam.TIPO_MARCACION];
        this.sedes = params[KeyParam.SEDES];
        this.users = users;
        this.zonas = zonas;
        setTimeout(() => {
          this._setupDataForm(marcacion);
        }, 0);
      }
    );
  }

  displayProperty(value: UsuarioNombres) {
    if (value) {
      return value.nombresCompletos;
    }
  }

  onSave() {
    if (this.form.valid) {
      const model = this.form.getRawValue();
      const save$ = this._marcacionService.saveAdmin(model);
      const update$ = this._marcacionService.updateAdmin(
        this.data?.idMarcacion,
        model
      );
      const transaction$: Observable<any> = this.isEdit ? update$ : save$;
      transaction$.pipe(untilDestroyed(this)).subscribe(() => {
        const messsage = this.isEdit
          ? 'Marcación editada correctamente'
          : 'Marcación creada correctamente';
        this._notification.success(messsage);
        this._dialogRef.close(true);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  private _createForm() {
    this.form = this._fb.group({
      fechaMarcacion: [null, [Validators.required]],
      idTipoMarcacion: [null, [Validators.required]],
      idUsuario: [{value: null, disabled: this.isEdit}, Validators.required],
      latitud: [null],
      longitud: [null],
      idZona: [null, Validators.required],
    });
  }
}
