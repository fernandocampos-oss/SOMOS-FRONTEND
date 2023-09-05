import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { RequerimientoUsuario } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { TareaRequest } from '@data/models/gestion-rendimiento/tarea-model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-update-tarea',
  templateUrl: './update-tarea.component.html',
  styleUrls: ['./update-tarea.component.scss']
})
export class UpdateTareaComponent implements OnInit {

  tarea: TareaRequest;

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    // private dialogRef: MatDialog,
    public _dialogRef: MatDialogRef<UpdateTareaComponent>,
    private _services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    // console.log(this._data);
    this.getModel();
  }

  getModel() {
    this.tarea = new TareaRequest();
    this.tarea.idTarea = this._data.model.idTarea;
    this.tarea.nombreTarea = this._data.model.nombreTarea;
    this.tarea.plazo = this._data.model.plazo;
    this.tarea.porcentajeAvance = this._data.model.porcentajeAvance;
  }

  async modificarTareaAdministrador() {
    if (this.tarea.idTarea > 0) {
      let actualizar = await this._services.modificarTareaAdministrador(this.tarea.nombreTarea, this.tarea.plazo, this.tarea.idTarea).then((data) => {
        if (data) {
          this._notification.success("Tarea actualizada correctamente");
          // this.dialogRef.closeAll();
          this._dialogRef.close();
        } else {
          this._notification.error("Error al actualizar tarea")
        }
      });
    }
  }


}