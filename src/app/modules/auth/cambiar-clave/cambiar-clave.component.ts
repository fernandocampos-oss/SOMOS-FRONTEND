import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AppRoute } from '@data/constants/app-route.constant';
import { AuthService } from '@data/services';
import { GenerarTokenRecuperarClaveRequest } from '@data/models';
import { DialogService } from '@core/services';

@UntilDestroy()
@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.scss'],
})
export class CambiarClaveComponent implements OnInit {
  routeLogin = `/${AppRoute.AUTH}/${AppRoute.LOGIN}`;
  form: FormGroup;

  get numeroDocumentoField() {
    return this.form.get('numeroDocumento');
  }

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this._createForm();
  }
  onSubmit() {
    if (this.form.valid) {
      const model: GenerarTokenRecuperarClaveRequest = {
        numeroDocumento: this.numeroDocumentoField.value,
      };
      this._authService
        .generarTokenRecuperarClave(model)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          //const title = `Te enviamos un correo a ${data.correo}`;
          const title = `Te enviamos un correo a ` + this.censorEmail(data.correo);
          const message = `* Sigue las instrucciones del correo para cambiar tu contraseña`;
          this._dialogService.success(message, title);
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
  private _createForm() {
    this.form = this._fb.group({
      numeroDocumento: [null, Validators.required],
    });
  }

  private censorEmail(value):string{
    var censorWord = function (str) {
      return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
    }
   
    var censorEmail = function (email){
        var arr = email.split("@");
        return censorWord(arr[0]) + "@" + censorWord(arr[1]);
    }
   return  censorEmail(value);
  }
}
