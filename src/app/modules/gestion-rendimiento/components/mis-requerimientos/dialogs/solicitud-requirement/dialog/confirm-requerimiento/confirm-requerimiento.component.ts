import { TareaDTO } from '@data/models/gestion-rendimiento/tareaDTO';
import { Tarea } from './../../../../../../../../data/models/gestion-rendimiento/tarea';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService, SnackbarService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-confirm-requerimiento',
  templateUrl: './confirm-requerimiento.component.html',
  styleUrls: ['./confirm-requerimiento.component.scss']
})
export class ConfirmRequerimientoComponent implements OnInit {

  tarea: Tarea

  constructor(
    private dialogRef: MatDialog,
    private _snackbar: SnackbarService,
    private _service: GestionRendimientoService,
    private _notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log("confirmar", this.data.obj);
  }

  // closeAll() {
  //   this._service.updateTareasFauxRequerimientos(this.data.obj);
  //   this._snackbar.success("Requerimiento asignado adecuadamente");
  //   this.dialogRef.closeAll();
  // }

  registrarTareas() {
    if (this.data.obj.idRequerimiento !== 0) {
      this._service.registrarTareas(this.data.obj).subscribe(data => {
        this._snackbar.success("Se registró correctamente");
        this.dialogRef.closeAll();
      });
    } else {
      this._notification.error("Error al registrar tareas");
    }
  }

}
