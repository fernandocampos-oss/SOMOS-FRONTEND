import { Tarea } from './../../../../../../data/models/gestion-rendimiento/tarea';
import { Requerimiento } from './../../../../../../data/models/gestion-rendimiento/requerimiento';
import { element } from 'protractor';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmRequerimientoComponent } from './dialog/confirm-requerimiento/confirm-requerimiento.component';
import { AppConfig } from '@core/configs';
import { Equipo, Requerimiento_Integrante } from '@data/models/requerimiento/requerimiento.model';
import { Poi } from '@data/models/gestion-rendimiento/poi';
import { ConstantesGr } from '@data/constants/constantes-gr.constant';
import { Personal } from '@data/models/gestion-rendimiento/personal';
import { TareaValidacionTransaccionalDTO } from '@data/models/gestion-rendimiento/tareaValidacionTransaccionalDTO';
import { TareaValidacionDTO } from '@data/models/gestion-rendimiento/tareaValidacionDTO';

import * as moment from 'moment';
// interface Fonafe {
//   descripcion: string;
// }

interface Tarea1 {
  tarea: string;
  plazo: string;
}

@Component({
  selector: 'app-solicitud-requirement',
  templateUrl: './solicitud-requirement.component.html',
  styleUrls: ['./solicitud-requirement.component.scss']
})
export class SolicitudRequirementComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  minFechaTarea = AppConfig.MAX_FECHA_NACIMIENTO;
  selectedIndex = 0;

  // fonafeAct: Fonafe[] = [
  //   { descripcion: 'Implementar los sistemas administrativos' },
  //   { descripcion: 'Desarrollar y mantener los sistemas administrativos' },
  //   { descripcion: 'Realizar actividades de soporte operativo y administrativo para garantizar la ejecución presupuestal de la GCTIC' },
  // ];

  fonafeAct: Poi[];
  listPersonal: Personal[];

  // equipoArea: Equipo[];
  // poiList: Array<{ descripcionPoi: string }> = [];
  // dataSource = this.poiList;

  tmpEquipoList = new Array;

  metaList: Array<{ descripcionMeta: string }> = [];
  dataSource_2 = this.metaList;

  //displayedColumns_3: string[] = ['Tarea', 'Plazo', 'Quitar'];
  tareas: Tarea1[] = [
    { tarea: 'Tarea 1', plazo: 'Plazo 1' },
    { tarea: 'Tarea 2', plazo: 'Plazo 2' },
    { tarea: 'Tarea 3', plazo: 'Plazo 3' },
  ];

  descripcionTarea: string;
  plazoMaxTarea: Date;
  tareaList: Array<{ nombreTarea: string, plazo: String }> = [];

  //dataSource_3 = this.tareaList;
  dataSource_3 = this.tmpEquipoList;
  displayedColumns_3: string[] = ['id', 'nombrePersona', 'tarea', 'plazo', 'Quitar'];

  //mat-stteper
  formActividadSelect = this._formBuilder.group({
    frmActividad: ['', Validators.required],
  });
  formIntegranteAsignacion = this._formBuilder.group({
    frmIntegrante: [null],
    frmTarea: [null],
    frmPlazo: [null],
  });
  formTareasListadas = this._formBuilder.group({
    frmDescTarea: [''],
    frmDateTarea: [''],
  });

  constructor(private dialogRef: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private services: GestionRendimientoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // this.equipoArea = this.services.FauxTablaEquipo();
    this.loadListPersonal();
    console.log(this.data.obj);
    this.listarPoi();
  }

  // onPoiCreate() {
  //   this.poiList.push({ descripcionPoi: this.descripcionPoi });
  //   this.descripcionPoi = "";
  //   this.table.renderRows();
  // }

  // deletePoi(index){
  //   this.poiList.splice(index,1);
  //   this.table.renderRows();
  // }

  // verMeta(element) {
  //   this.nombreMeta = element.producto;
  // }

  // onMetaCreate() {
  //   this.metas.push({ producto: 'Producto 13', meta: 'Meta 13' });
  //   this.descripcionMeta = "";
  //   this.table.renderRows();

  //   console.log(this.metas);
  // }

  // deleteMeta(index){
  //   this.metaList.splice(index,1);
  //   this.table.renderRows();
  // }

  // onIndicadorCreate() {
  //   this.metas.push({ producto: 'Producto 13', meta: 'Meta 13' });
  //   this.descripcionMeta = "";
  //   this.table.renderRows();
  // }

  // ValidarTareas() {
  //   if (this.tareaList.length == 0) {
  //     this._notification.error("Se debe asignar almenos 1 tarea al requerimiento");
  //   }
  //   else {
  //     this._getModel();
  //     console.log(this._getModel());
  //     const dialogRef: MatDialogRef<ConfirmRequerimientoComponent> = this.dialogRef.open(ConfirmRequerimientoComponent, {
  //       disableClose: false,
  //       autoFocus: false,
  //       data: {
  //         obj: this._getModel(),
  //       }
  //     });
  //   }
  // }

  ValidarAsignacion() {
    if (this.tmpEquipoList.length == 0) {
      this._notification.warning("Se debe asignar almenos 1 tarea al requerimiento");
    } else {
      const dialogRef: MatDialogRef<ConfirmRequerimientoComponent> = this.dialogRef.open(ConfirmRequerimientoComponent, {
        disableClose: false,
        autoFocus: false,
        data: {
          actividad: this.formActividadSelect.value.frmActividad,
          obj: this._getModel()
        }
      });
    }
  }

  onIntegranteCreate() {
    console.log(this.tmpEquipoList);
    console.log(this.formIntegranteAsignacion.value);
    if (this.formIntegranteAsignacion.value.frmIntegrante == null || this.formIntegranteAsignacion.value.frmTarea == null || this.formIntegranteAsignacion.value.frmPlazo == null) {
      this._notification.warning("Se deben ingresar los datos para continuar");
      return;
    }
    else {
      if (this.tmpEquipoList.find(x => x.nombrePersona === this.formIntegranteAsignacion.value.frmIntegrante) != undefined) {
        console.log(this.tmpEquipoList);
        this._notification.warning("Este trabajador ya esta en lista");
        return;
      }
      else {
        this.tmpEquipoList.push({
          "idPersona": this.formIntegranteAsignacion.value.frmIntegrante,
          "nombrePersona": this.formIntegranteAsignacion.value.frmIntegrante,
          "nombreTarea": this.formIntegranteAsignacion.value.frmTarea,
          "plazo": this.formIntegranteAsignacion.value.frmPlazo._d.toLocaleDateString()
        });
        this.table.renderRows();
      }
    }
  }

  deleteIntegrante(index) {
    this.tmpEquipoList.splice(index, 1);
    this.table.renderRows();
  }

  onTareaCreate(fecha: Date) {
    if (this.formTareasListadas.value.frmDescTarea == undefined || this.formTareasListadas.value.frmDateTarea == undefined ||
      this.formTareasListadas.value.frmDescTarea == '' || this.formTareasListadas.value.frmDateTarea == '') {
      this._notification.warning("Se deben ingresar los datos para continuar");
    }
    else {
      this.tareaList.push({ nombreTarea: this.formTareasListadas.value.frmDescTarea, plazo: fecha.toString() });
      this.table.renderRows();
    }
  }

  deleteTarea(index) {
    this.tareaList.splice(index, 1);
    this.table.renderRows();
  }

  // private _getModel(): Requerimiento_Integrante[] {
  //   var asignaciones: Requerimiento_Integrante[];
  //   asignaciones = [];
  //   for (let i = 0; i < this.tmpEquipoList.length; i++) {
  //     asignaciones.push({
  //       "idReq": this.data.obj.id,
  //       "idIntegrante": this.tmpEquipoList[i].idPersona,
  //       "nombreTarea": this.tmpEquipoList[i].nombreTarea,
  //       "plazo": this.tmpEquipoList[i].plazo,
  //       "estado": 'PENDIENTE',
  //       "avance": 0,
  //     });
  //   }
  //   return asignaciones;
  //   /*{
  //     id: this.data.obj.id,
  //     actividad: this.formActividadSelect.value.frmActividad,
  //     idIntegrante:,
  //     nombreTarea:,
  //     plazos: ,
  //   };*/
  // }

  private _getModel(): TareaValidacionTransaccionalDTO {
    var tareaDTOs: TareaValidacionDTO[] = [];

    let requerimientoObj = new Requerimiento();
    requerimientoObj.idRequerimiento = this.data.obj.idRequerimiento;

    for (let i of this.tmpEquipoList) {
      let tarea = new Tarea();

      let personalObj = new Personal();
      personalObj.idPersonal = i.idPersona;

      tarea.nombreTarea = i.nombreTarea;
      tarea.plazo = i.plazo;
      tarea.estado = true;
      tarea.estadoAvance = ConstantesGr.ESTADO_TAREA_PENDIENTE;
      tarea.porcentajeAvance = 0;
      tarea.fechaCreacion = new Date();
      
      let tareas: Tarea[] = [];
      tareas.push(tarea);

      var tareaDTO = new TareaValidacionDTO();
      tareaDTO.personal = personalObj;
      tareaDTO.listTarea = tareas;
      tareaDTOs.push(tareaDTO);
    }

    return {
      requerimiento: requerimientoObj,
      listTareaDTO: tareaDTOs,      
      // actividad: this.formActividadSelect.value.frmActividad,
      // tareas: this.tareaList,      
    };
  }

  listarPoi() {
    this.services.listarPoi().subscribe((data) => {
      if (data) {
        this.fonafeAct = data;
      } else {
        this.fonafeAct = null;
        this._notification.warning("LISTA VACIA");
      }
    });
  }

  loadListPersonal() {
    let idDependencia = 2;
    this.services.listarPersonalPorDependenciaAsignado(idDependencia, ConstantesGr.ESTADO_PERSONAL_ASIGNADO).subscribe((data: any) => {
      if (data) {
        this.listPersonal = data;
      } else {
        this.listPersonal = null;
        if (this.listPersonal = null) {
          this._notification.warning("LISTA VACIA");
        }
        // if (dataItem.msj == "USTED NO SE ENCUENTRA ASGINADO EN UN EQUIPO DE TRABAJO") {
        //   this._notification.warning(dataItem.msj)
        // } else {
        //   this._notification.error(dataItem.msj)
        // }
      }
    });

  }

}
