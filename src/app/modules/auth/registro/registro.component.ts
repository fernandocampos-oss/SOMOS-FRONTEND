import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';

import { AppRoute } from '@data/constants';
import { Sede, UsuarioRegisterResponse } from '@data/models';
import {
  ConfirmTokenDialog,
  ConfirmTokenModel,
} from './dialogs/confirm-token/confirm-token.dialog';
import { NotificationService } from '@core/services';
import { ParamService, AuthService } from '@data/services';
import { KeyParam } from '@data/enums';
import { AppConfig } from '@core/configs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@UntilDestroy()
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  form: FormGroup;
  form4Mobile = false;
  routeLogin = `/${AppRoute.AUTH}/${AppRoute.LOGIN}`;
  sedes: Sede[] = [];
  maxFechaNacimiento = AppConfig.MAX_FECHA_NACIMIENTO;

  get numeroDocumentoField() {
    return this.form.get('numeroDocumento');
  }
  get codigoPlanillaSapField() {
    return this.form.get('codigoPlanilla');
  }
  get celularField() {
    return this.form.get('numeroCelular');
  }
  get fechaNacimientoField() {
    return this.form.get('fechaNacimiento');
  }
  // get idSedeField(){
  //   return this.form.get('idSede');
  // }
  get correoField() {
    return this.form.get('correo');
  }
  get claveField() {
    return this.form.get('password');
  }
  get confirmarClaveField() {
    return this.form.get('confirmarPassword');
  }

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _matDialog: MatDialog,
    private _notification: NotificationService,
    private _paramService: ParamService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private responsive  : BreakpointObserver
  ) {
    this.matIconRegistry.addSvgIcon("dni",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/dni.svg"));

  }

  ngOnInit(): void {
    this._createForm();
    // this._loadParams();
    
    this.responsive.observe([
      Breakpoints.XSmall,
      ])
      .subscribe(result => {
        this.form4Mobile = false; 
        if (result.matches) {
          this.form4Mobile = true;
        }
  });
  }
  // private _loadParams() {
  //   this._paramService
  //     .getParams(KeyParam.SEDES)
  //     .pipe(untilDestroyed(this))
  //     .subscribe((params) => (this.sedes = params[KeyParam.SEDES]));
  // }
  onSave() {
    if (this.form.valid && this._validatePasswordMatch()) {
      this._authService
        .register(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe((data) => this._openConfirmTokenDialog(data));
    } else {
      this.form.markAllAsTouched();
    }
  }
  private _validatePasswordMatch() {
    if (this.claveField.value !== this.confirmarClaveField.value) {
      this._notification.warning('Las contraseñas no coinciden');
      return false;
    }
    return true;
  }
  private _openConfirmTokenDialog({
    idUsuario,
    token,
  }: UsuarioRegisterResponse): void {
    const data: ConfirmTokenModel = {
      idUsuario,
      token,
      correo: this.correoField.value,
    };
    this._matDialog.open(ConfirmTokenDialog, { data, disableClose: true });
  }
  private _createForm() {
    this.form = this._fb.group({
      numeroDocumento: [null, Validators.required],
      codigoPlanilla: [null, Validators.required],
      numeroCelular: [null, Validators.required],
      fechaNacimiento: [null, Validators.required],
      correo: [null, Validators.required],
     // idSede: [null, Validators.required],
      password: [null, Validators.required],
      confirmarPassword: [null, Validators.required],
    });
  }
}
