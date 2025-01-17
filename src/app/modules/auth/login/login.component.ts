import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
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
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CaptchaRequestDto } from '@data/models/captcha/CaptchaRequestDto';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OnomasticoDialogComponent } from '@shared/onomastico-dialog/onomastico-dialog.component';
import { UsuarioService } from '@data/services';
import * as moment from 'moment';

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
    private _recaptchaV3Service: ReCaptchaV3Service,
    private _dialog: MatDialog,
    private _userService: UsuarioService
  ) {
    this.matIconRegistry.addSvgIcon("password-cursor", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/password-cursor.svg"));
    this.matIconRegistry.addSvgIcon("newuser", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/newuser.svg"));
  }

  ngOnInit() {
    this._createForm();
  }

  login() {
    if (this.form.valid) {
      //captcha
      this._recaptchaV3Service.execute('submit').subscribe((captchaToken) => {
        if (captchaToken != null) {
          // console.log('captchaToken:', captchaToken);
          let dto = new CaptchaRequestDto();
          dto.llave = captchaToken;
          this._authService.validCaptcha(dto).subscribe(data => {
            if (data?.respuestaCaptcha === true) {
            } else {
              this._notificacion.warning('Captcha no se pudo validar');
            }
          });
        }
      });

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
          this._router.navigate(['/']);

          if (rta.user.authorities.length > 0) {
            let listRol = [];
            for (let a of rta.user.authorities) {
              listRol.push(a.authority);
            }
            sessionStorage.setItem('_roles', JSON.stringify(listRol));
          }
          //onomastico
          if (rta != null) {
            this._userService.findByNumeroDocumento(rta.user.username).subscribe(data => {
              if (data != null) {
                console.log("#", data)
                console.log("##", data.fechaNacimiento)

                let fechaNac = moment(data.fechaNacimiento, 'YYYY-MM-DD');
                let stringFechaNac: string = fechaNac.format('YYYY-MM-DD');
                console.log(`Fecha Nac string: ${stringFechaNac}`);
                console.log("mes:", stringFechaNac.split('-')[1])
                console.log("dia:", stringFechaNac.split('-')[2])

                const today = new Date();
                const day = today.getDate().toString().padStart(2, '0');
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                console.log("Fecha hoy (MM-DD):", month,"-", day)

                if((stringFechaNac.split('-')[1])===month && stringFechaNac.split('-')[2]===day){
                  this.showPanelOnomastico(data);
                }
                                
              }
            });
          }

        });
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

  showPanelOnomastico(element: any) {
    const dialogRef: MatDialogRef<OnomasticoDialogComponent> = this._dialog.open(OnomasticoDialogComponent, {
      disableClose: true,
      minWidth: '250px',
      maxWidth: '50%',
      autoFocus: false,
      data: {
        nombres: element.nombres,
        apellidos: element.apellidos,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
