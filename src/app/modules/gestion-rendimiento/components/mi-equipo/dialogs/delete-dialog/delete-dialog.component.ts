import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { MenuPrincipalService } from '@data/services/menu-principal.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {
  titleNombres: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private _notification: NotificationService,
    private _services: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
  }

  async deleteTrabajador() {
    let revoke = await this._services.eliminarTrabajador(this.data.model.idEquipo).then((data: any) => {
      if (data = 1) {
        this._notification.success("Trabajdor eliminado");
      } else {
        this._notification.warning("Eliminar trabajador: Se produjo un error");
      }
    });
    this.dialogRef.close();
  }

}
