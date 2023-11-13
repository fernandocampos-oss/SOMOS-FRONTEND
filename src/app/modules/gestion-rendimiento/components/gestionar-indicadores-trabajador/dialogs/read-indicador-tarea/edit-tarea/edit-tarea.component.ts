import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { TareaRequest } from '@data/models/gestion-rendimiento/tarea-model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-edit-tarea',
  templateUrl: './edit-tarea.component.html',
  styleUrls: ['./edit-tarea.component.scss']
})
export class EditTareaComponent implements OnInit {
  tarea: TareaRequest;

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    // private dialogRef: MatDialog,
    public _dialogRef: MatDialogRef<EditTareaComponent>,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    // console.log(this._data);
    this.getModel();
  }

  getModel() {
    this.tarea = new TareaRequest();
    this.tarea.idTarea = this._data.model.idTarea;
    this.tarea.nombre = this._data.model.nombre;
    this.tarea.plazo = this._data.model.plazo;
    // this.tarea.porcentajeAvance = this._data.model.porcentajeAvance;
  }

  async modificarTareaAdministrador() {
    if (this.tarea.idTarea > 0) {
      let actualizar = await this._grService.modificarTareaAdministrador(this.tarea.nombre, this.tarea.plazo, this.tarea.idTarea).then((data) => {
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
