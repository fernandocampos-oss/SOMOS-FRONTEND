import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SnackbarService } from '@core/services';
import { AppRoute } from '@data/constants';
import { CambiarClaveRequest } from '@data/models';
import { AuthService } from '@data/services';
import { DialogService, NotificationService } from '@core/services';

@UntilDestroy()
@Component({
  selector: 'app-confirmar-cambio-clave',
  templateUrl: './confirmar-cambio-clave.component.html',
  styleUrls: ['./confirmar-cambio-clave.component.scss'],
})
export class ConfirmarCambioClaveComponent implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;
  form: FormGroup;

  routeLogin = `/${AppRoute.AUTH}/${AppRoute.LOGIN}`;
  token: string;
  username: string;

  get nuevaClaveField() {
    return this.form.get('nuevaClave');
  }
  get nuevaClaveConfirmField() {
    return this.form.get('nuevaClaveConfirm');
  }

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _dialogService: DialogService,
    private _router: Router,
    private _snackbar: SnackbarService,
    private _notification: NotificationService
  ) {}

  ngOnInit(): void {
    this._createForm();
    this._setupParams();
  }
  onSubmit() {
    if (this.form.valid && this._validatePasswordMatch()) {
      const model = this._getModel();
      this._authService
        .cambiarClave(model)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this._snackbar.success('Contraseña cambiada correctamente');
          this._router.navigate([`/${AppRoute.AUTH}/${AppRoute.LOGIN}`]);
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
  private _validatePasswordMatch() {
    if (this.nuevaClaveField.value !== this.nuevaClaveConfirmField.value) {
      this._notification.warning('Las contraseñas no coinciden');
      return false;
    }
    return true;
  }
  private _getModel(): CambiarClaveRequest {
    return {
      nuevaClave: this.nuevaClaveField.value,
      token: this.token,
      username: this.username,
    };
  }
  private _setupParams() {
    const params = this._route.snapshot.queryParams;
    this.token = params.token;
    this.username = params.username;
  }
  private _createForm() {
    this.form = this._fb.group({
      nuevaClave: [null, Validators.required],
      nuevaClaveConfirm: [null, Validators.required],
    });
  }
}
