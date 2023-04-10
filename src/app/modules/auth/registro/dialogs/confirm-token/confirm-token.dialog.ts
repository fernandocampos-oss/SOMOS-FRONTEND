import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@core/services/common/notification.service';
import { UsuarioRegisterResponse } from '@data/models/usuario/usuario-register.model';
import { AuthService } from '@data/services/auth.service';
import { AppRoute } from '@data/constants/app-route.constant';

export interface ConfirmTokenModel extends UsuarioRegisterResponse {
  correo: string;
}

@UntilDestroy()
@Component({
  selector: 'app-confirm-token',
  templateUrl: './confirm-token.dialog.html',
  styleUrls: ['./confirm-token.dialog.scss'],
})
export class ConfirmTokenDialog implements OnInit {
  form: FormGroup = new FormGroup({
    token: new FormControl(null, Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmTokenModel,
    private _authService: AuthService,
    private _notification: NotificationService,
    private _dialogRef: MatDialogRef<void>,
    private _router: Router
  ) {}

  ngOnInit(): void {}

  onActivate() {
    if (this.form.valid) {
      const model = this.form.value;
      model.idUsuario = this.data.idUsuario;
      this._authService
        .activarToken(model)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this._notification.success('Usuario registrado correctamente');
          this._dialogRef.close();
          this._router.navigate([`${AppRoute.AUTH}/${AppRoute.LOGIN}`]);
        }    
        )
               
    }
  }
}
