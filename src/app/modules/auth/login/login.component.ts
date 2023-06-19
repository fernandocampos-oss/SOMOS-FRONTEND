import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { of } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';

import { NotificationService } from '@core/services/common/notification.service';
import { AuthService } from '@data/services/auth.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppRoute } from '@data/constants/app-route.constant';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { error } from 'protractor';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  hidePassword = true;

  routeRegister = `/${AppRoute.AUTH}/${AppRoute.REGISTRO}`;
  routeChangePassword = `/${AppRoute.AUTH}/${AppRoute.CAMBIAR_CLAVE}`;

  get usuarioField() {
    return this.form.get('username');
  }

  get passwordField() {
    return this.form.get('password');
  }

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _notificacion: NotificationService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon("password-cursor",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/password-cursor.svg"));
    this.matIconRegistry.addSvgIcon("newuser",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/newuser.svg"));
  }

  ngOnInit() {
    this._createForm();
  }

  login() {
    if (this.form.valid) {
      this._authService
        .login(this.form.value)
        .pipe(
          untilDestroyed(this),
          catchError((error) => {
            if (
              error instanceof HttpErrorResponse &&
              error.status === HttpStatusCode.Unauthorized
            ) {
              this._notificacion.warning('Usuario o contraseña incorrecto');
            }
            return of(error);
          })
        )
        .subscribe((rta) => {
          console.log("rta from login...", rta);
          this._router.navigate(['/'])});
        
    } else {
      this.form.markAllAsTouched();
    }
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
