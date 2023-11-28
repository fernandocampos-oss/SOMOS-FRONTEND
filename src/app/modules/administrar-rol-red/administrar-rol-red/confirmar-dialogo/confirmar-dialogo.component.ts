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
  titleNombre: any;
  titleRemover: string = "¿Estás seguro de eliminar el usuario?";

  constructor(
    private _fb: FormBuilder,
    private _notification: NotificationService,
    private _dialogRef: MatDialogRef<ConfirmarDialogoComponent>,
    private _snackbar: SnackbarService,
    private _sectorizacionService: AsignacionRolSectorizacionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.titleNombre = this.data.personal.nombresCompletos;
  }

  async removerAsignacion() {
    let modificar = await this._sectorizacionService.removerAsignacion(this.data.personal.idUsuario, this.data.red.codRed).then((data) => {
      this._notification.success("Usuario eliminado");
    });
    this._dialogRef.close(1);
  }
}
