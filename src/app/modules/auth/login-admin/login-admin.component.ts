import { HttpErrorResponse, HttpResponseBase, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '@core/services';
import { AppRoute } from '@data/constants';
import { AuthService } from '@data/services';
import { UntilDestroy,untilDestroyed } from '@ngneat/until-destroy';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CaptchaAction } from '@data/constants/captcha-action.constant';
import { LoginRequest } from '@data/models';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@UntilDestroy()
@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss']
})
export class LoginAdminComponent implements OnInit {

  form: FormGroup;
  hidePassword = true;
  get usuarioField() {
    return this.form.get('username');
  }

  get passwordField() {
    return this.form.get('password');
  }
  constructor(private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _notificacion: NotificationService,
              private _router: Router,
              private _recaptchaV3Service: ReCaptchaV3Service) { }

  ngOnInit(): void {
    this._createForm();
  }

  login() {
    if (this.form.valid) {
      this._recaptchaV3Service.execute(CaptchaAction.LOGIN).subscribe((captchaToken) => {
        if (captchaToken) {
          this.authenticateUser(captchaToken);
        } else {
          this._notificacion.warning('No se pudo verificar el captcha');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  authenticateUser(captchaToken: string) {
    const loginRequest: LoginRequest = this.form.value;
    this._authService
      .login(loginRequest, captchaToken)
      .pipe(
        untilDestroyed(this),
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse &&
            error.status === HttpStatusCode.Unauthorized
          ) {
            this._notificacion.warning('Usuario o contraseña incorrecto');
          } else if (
            error instanceof HttpErrorResponse &&
            error.status === HttpStatusCode.Forbidden
          ) {
            this._notificacion.warning('Captcha inválido');
          }
          return of(error);
        })
      )
      .subscribe((rta) => {
        if(rta.ok != false){
          if(rta.user.authorities[0].authority == 'ROLE_4'){
            this._router.navigate(['/admin']);
          }
          else{
            this._router.navigate(['/']);
          }
        }else{
          this._router.navigate([`/${AppRoute.AUTH}/${AppRoute.LOGIN_ADMIN}`]);
        }
      });
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
