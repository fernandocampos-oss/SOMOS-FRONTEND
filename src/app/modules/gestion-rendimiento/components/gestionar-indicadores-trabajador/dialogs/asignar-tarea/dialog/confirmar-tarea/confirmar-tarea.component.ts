import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService, SnackbarService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-confirmar-tarea',
  templateUrl: './confirmar-tarea.component.html',
  styleUrls: ['./confirmar-tarea.component.scss']
})
export class ConfirmarTareaComponent implements OnInit {
  tmpNoDuplicadoDtoList = new Array;
  tmpNoDuplicadoTarea = new Array;

  constructor(
    private dialogRef: MatDialog,
    private _snackbar: SnackbarService,
    private _service: GestionRendimientoService,
    private _notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // console.log(this.data)
  }

  async registrarTareas() {
    let actualizar = await this._service.registrarTareas(this.data.element).then(data => {
      this._notification.success("Se registró correctamente");
      // this._snackbar.success("Tareas registradas correctamente");
      // this.dialogRef.closeAll();
    });
    this.dialogRef.closeAll();

    // this._service.validarDuplicadoRequerimientoPersonal(this.data.obj.requerimiento.idRequerimiento, x.personal.idPersonal).subscribe(dataValidacion => {
    //   console.log(dataValidacion);
    //   if (dataValidacion.length == 0) {          
    //   }
    //   else {
    //     this._service.registrarTareaNoDuplicado(tareaValDTO).subscribe(data => {
    //       this._snackbar.success("Se registró correctamente");
    //     });
    //   }
    // });
  }

  // closeAll() {
  //   this._service.updateTareasFauxRequerimientos(this.data.obj);
  //   this._snackbar.success("Requerimiento asignado adecuadamente");
  //   this.dialogRef.closeAll();
  // }

}
