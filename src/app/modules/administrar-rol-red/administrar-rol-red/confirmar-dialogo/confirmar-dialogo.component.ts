import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService, SnackbarService } from '@core/services';
import { AsignacionRolSectorizacionService } from '@data/services/asignacion-rol-sectorizacion.service';

@Component({
  selector: 'app-confirmar-dialogo',
  templateUrl: './confirmar-dialogo.component.html',
  styleUrls: ['./confirmar-dialogo.component.scss']
})
export class ConfirmarDialogoComponent implements OnInit {
  personal: any;
  estado: any;
  titleHabilitar: string = "¿Estás seguro de habilitar el usuario?";
  titleDeshabilitar: string = "¿Estás seguro de deshabilitar el usuario?";

  constructor(
    private _fb: FormBuilder,
    private _notification: NotificationService,
    private _dialogRef: MatDialogRef<ConfirmarDialogoComponent>,
    private _snackbar: SnackbarService,
    private _sectorizacionService: AsignacionRolSectorizacionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // console.log(this.data);
    this.personal = this.data.personal.nombresCompletos;
    this.estado = this.data.estado;
  }

  async modificarHabilitarDeshabilitar() {
    let habilitado = 0;
    if (this.estado) {
      habilitado = 1;
    }

    let modificar = await this._sectorizacionService.modificarHabilitarDeshabilitar(this.data.personal.idUsuario, this.data.red.codRed, habilitado).then((data) => {
      });
      
    if (this.estado) {
      this._notification.success("Usuario Habilitado");
    } else {
      this._notification.success("Usuario Desabilitado");
    }

    this._dialogRef.close(1);
  }
}
