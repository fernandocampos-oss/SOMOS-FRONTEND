import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';

import { AppRoute } from '@data/constants';
import { Sede, UsuarioRegisterRequest, UsuarioRegisterResponse } from '@data/models';
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
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CaptchaAction } from '@data/constants/captcha-action.constant';

@UntilDestroy()
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  form: FormGroup;
  showHelpCPlanilla = false;
  form4Mobile = false;
  routeLogin = `/${AppRoute.AUTH}/${AppRoute.LOGIN}`;
  sedes: Sede[] = [];
  maxFechaNacimiento = AppConfig.MAX_FECHA_NACIMIENTO;
  hidePassword = true;
  hidePasswordConfirmation = true;

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
    private responsive: BreakpointObserver,
    private _recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.matIconRegistry.addSvgIcon("dni",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/dni.svg"));

  }

  ngOnInit(): void {
    this._createForm();
    // this._loadParams();
    this.form.controls.numeroDocumento.valueChanges.subscribe(val => {
      this.form.controls.numeroDocumento.setValue(val.trim(), { emitEvent: false })
    })
    this.form.controls.codigoPlanilla.valueChanges.subscribe(val => {
      this.form.controls.codigoPlanilla.setValue(val.trim(), { emitEvent: false })
    })
    
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
      const usuarioRegisterRequest: UsuarioRegisterRequest = this.form.value;
      this._recaptchaV3Service.execute(CaptchaAction.REGISTER).subscribe((captchaToken) => {
        if (captchaToken) {
          this._authService
            .register(usuarioRegisterRequest, captchaToken)
            .pipe(untilDestroyed(this))
            .subscribe((data) => this._openConfirmTokenDialog(data));
        } else {
          this._notification.warning('No se pudo verificar el captcha');
        }
      });
    } else if (this.form.value.codigoPlanilla.length !== 8){
      this._notification.warning('Codigo de planilla incorrecto, de tener 7 dígitos, agregarle un "1" al inicio');
    } else {
      this._notification.warning('Revisar los campos ingresados');
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
      codigoPlanilla: [null, [Validators.required, Validators.minLength(8)]],
      numeroCelular: [null, [Validators.required, Validators.pattern("^9([0-9]){8}$")]],
      fechaNacimiento: [null, Validators.required],
      correo: [null, Validators.required],
     // idSede: [null, Validators.required],
      password: [null, Validators.required],
      // password: [null, [Validators.required, Validators.pattern("^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$")]],
      // password: [null, [Validators.required, Validators.pattern("^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z])$")]],
      confirmarPassword: [null, Validators.required],
    });
  }
}
