import { TareaRegistrarNuevoTMP } from '@data/models/gestion-rendimiento/tareaRegistrarNuevoTMP';
import { Personal } from '@data/models/gestion-rendimiento/personal';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService, SnackbarService } from '@core/services';
import { Requerimiento } from '@data/models/gestion-rendimiento/requerimiento';
import { RequerimientoPersonal } from '@data/models/gestion-rendimiento/requerimientoPersonal';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { Tarea } from '@data/models/gestion-rendimiento/tarea';
import { ConstantesGr } from '@data/constants/constantes-gr.constant';
import { TareaValidacionTransaccionalDTO } from '@data/models/gestion-rendimiento/tareaValidacionTransaccionalDTO';
import { TareaValidacionDTO } from '@data/models/gestion-rendimiento/tareaValidacionDTO';
import { EstadoTarea } from '@data/models/gestion-rendimiento/estadoTarea';

@Component({
  selector: 'app-confirm-requerimiento',
  templateUrl: './confirm-requerimiento.component.html',
  styleUrls: ['./confirm-requerimiento.component.scss']
})
export class ConfirmRequerimientoComponent implements OnInit {

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
    console.log(this.data.obj);
  }

  // closeAll() {
  //   this._service.updateTareasFauxRequerimientos(this.data.obj);
  //   this._snackbar.success("Requerimiento asignado adecuadamente");
  //   this.dialogRef.closeAll();
  // }

  registrarTareas() {
    let req = new Requerimiento();
    req.idRequerimiento = this.data.obj.requerimiento.idRequerimiento;

    let estadoTareaObj = new EstadoTarea();
    estadoTareaObj.idEstadoTarea = ConstantesGr.ESTADO_TAREA_PENDIENTE;

    for (let x of this.data.obj.listTareaDTO) {
      console.log(x.personal.idPersonal);
      this._service.validarDuplicadoRequerimientoPersonal(this.data.obj.requerimiento.idRequerimiento, x.personal.idPersonal).subscribe(dataValidacion => {
        console.log(dataValidacion);
        if (dataValidacion.length == 0) {
          var tareaTmp = new TareaRegistrarNuevoTMP();

          let tareas: Tarea[] = [];
          for (let i of x.listTarea) {
            let tarea = new Tarea();
            tarea.nombreTarea = i.nombreTarea;
            tarea.plazo = i.plazo;
            tarea.estado = true;
            tarea.estadoTarea = estadoTareaObj;
            tarea.porcentajeAvance = 0;
            tarea.fechaCreacion = new Date();

            tareas.push(tarea);
            tarea = null;
          }

          let per = new Personal();
          per.idPersonal = x.personal.idPersonal;

          tareaTmp.requerimiento = req;
          tareaTmp.personal = per;
          tareaTmp.listTarea = tareas;

          this._service.registrarTareas(tareaTmp).subscribe(data => {
            this._snackbar.success("Se registró correctamente");
            // this.dialogRef.closeAll();
          });
          tareaTmp = null;
          tareas = [];
        }
        else {
          let reqPer = new RequerimientoPersonal();
          reqPer.idRequerimientoPersonal = dataValidacion[0].idRequerimientoPersonal;

          var tareaValDTO = new TareaValidacionTransaccionalDTO();

          let tareas: Tarea[] = [];
          for (let i of x.listTarea) {
            let tarea = new Tarea();
            tarea.nombreTarea = i.nombreTarea;
            tarea.plazo = i.plazo;
            tarea.estado = true;
            tarea.estadoTarea = estadoTareaObj;
            tarea.porcentajeAvance = 0;
            tarea.fechaCreacion = new Date();

            tareas.push(tarea);
            tarea = null;
          }

          let per = new Personal();
          per.idPersonal = x.personal.idPersonal;

          var tareaDTO = new TareaValidacionDTO();
          tareaDTO.personal = per;
          tareaDTO.listTarea = tareas;

          let tareaDTOs: TareaValidacionDTO[] = [];
          tareaDTOs.push(tareaDTO);

          tareaValDTO.requerimiento = null;
          tareaValDTO.listTareaDTO = tareaDTOs;

          delete tareaValDTO['requerimiento'];
          Object.assign(tareaValDTO, { requerimientoPersonal: reqPer });

          this._service.registrarTareaNoDuplicado(tareaValDTO).subscribe(data => {
            this._snackbar.success("Se registró correctamente");
            // this.dialogRef.closeAll();
          });
          tareaValDTO = null;
        }

      });
    }

    this.dialogRef.closeAll();
  }


}
