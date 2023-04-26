import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService, SnackbarService } from '@core/services';
import { UsuarioService } from '@data/services';
import { UsuarioPassword } from '@data/models/usuario/usuario-password.model';

@Component({
  selector: 'app-change-passw',
  templateUrl: './change-passw.component.html',
  styleUrls: ['./change-passw.component.scss']
})
export class ChangePasswComponent implements OnInit {

  hideActualPassword = true;
  hidePassword = true;
  hideConfirmPassword = true;
  form: FormGroup;
  constructor(private _fb: FormBuilder,
              private _notification: NotificationService,
              private _usuarioService: UsuarioService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _snackbar: SnackbarService,
  ) { }
  
  get actualClaveField() {
    return this.form.get('actualClave');
  }

  get nuevaClaveField() {
    return this.form.get('nuevaClave');
  }
  get nuevaClaveConfirmField() {
    return this.form.get('nuevaClaveConfirm');
  }

  ngOnInit(): void {
    this._createForm();
  }

  private _validatePasswordMatch() {
    if (this.nuevaClaveField.value !== this.nuevaClaveConfirmField.value) {
      this._notification.warning('Las contraseñas no coinciden');
      return false;
    }
    return true;
  }
  private _createForm() {
    this.form = this._fb.group({
      actualClave: [null, Validators.required],
      nuevaClave: [null, Validators.required],
      nuevaClaveConfirm: [null, Validators.required],
    });
  }
  onSubmit(){
    if (this.form.valid && this._validatePasswordMatch()) {
      const model = this._getModel();
      this._usuarioService
        .updatePassword(this.data.idUser, model)
        .subscribe(() => {
          this._snackbar.success('Contraseña cambiada correctamente');
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
  private _getModel(): UsuarioPassword{
    return {
      actualClave: this.actualClaveField.value,
      nuevaClave: this.nuevaClaveField.value,
    };
  }
}
