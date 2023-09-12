import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmRequerimientoComponent } from './dialog/confirm-requerimiento/confirm-requerimiento.component';
import { AppConfig } from '@core/configs';
import { ConstantesGr } from '@data/constants/constantes-gr.constant';
import { Personal, Poi, RequerimientoUsuario } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { TareaDTO, TareaResponse, } from '@data/models/gestion-rendimiento/tarea-model';
import * as moment from 'moment';

@Component({
  selector: 'app-solicitud-requirement',
  templateUrl: './solicitud-requirement.component.html',
  styleUrls: ['./solicitud-requirement.component.scss']
})
export class SolicitudRequirementComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  minFechaTarea = AppConfig.MAX_FECHA_NACIMIENTO;
  listPoi: Poi[];
  listPersonal: Personal[];

  listTareas: Array<{ nombreTarea: string, plazo: String }> = [];
  dataSource = this.listTareas;
  displayedColumns: string[] = ['item', 'tarea', 'plazo', 'Quitar'];

  //mat-stteper
  formActividadSelect = this._formBuilder.group({
    frmActividad: ['', Validators.required],
  });
  // formIntegranteAsignacion = this._formBuilder.group({
  //   frmIntegrante: [null],
  //   frmTarea: [null],
  //   frmPlazo: [null],
  // });
  formTareasListadas = this._formBuilder.group({
    frmDescTarea: [''],
    frmDateTarea: [''],
  });

  constructor(
    private dialogRef: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private services: GestionRendimientoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // console.log(this.data.obj);
    this.listarPoi();
    // this.listarPersonalUnidad();
  }

  async listarPoi() {
    let listPoi = await this.services.listarPoi().then((data) => {
      if (data.length > 0) {
        this.listPoi = data;
      } else {
        this._notification.warning("Lista de actividades vacia");
      }
    });
  }

  // async listarPersonalUnidad() {
  //   let listPersonal = await this.services.listarPersonalUnidad().then((data) => {
  //     if (data) {
  //       this.listPersonal = data;
  //     } else {
  //       this._notification.warning("Lista de integrantes vacia");
  //     }
  //   });
  // }

  onTareaCreate() {
    // console.log(this.formTareasListadas.value);
    if (this.formTareasListadas.value.frmDescTarea == undefined || this.formTareasListadas.value.frmDateTarea == undefined ||
      this.formTareasListadas.value.frmDescTarea == '' || this.formTareasListadas.value.frmDateTarea == '') {
      this._notification.warning("Se deben ingresar los datos para continuar");
    }
    else {
      this.listTareas.push({
        nombreTarea: this.formTareasListadas.value.frmDescTarea,
        plazo: this.formTareasListadas.value.frmDateTarea._d.toLocaleDateString()
      });
      this.table.renderRows();
    }
  }
  deleteTarea(index) {
    this.listTareas.splice(index, 1);
    this.table.renderRows();
  }

  registrarTareas() {
    if (this.listTareas.length == 0) {
      this._notification.warning("Se debe asignar almenos 1 tarea al requerimiento");
    } else {
      const dialogRef: MatDialogRef<ConfirmRequerimientoComponent> = this.dialogRef.open(ConfirmRequerimientoComponent, {
        disableClose: false,
        autoFocus: false,
        data: {
          // poi: this.formActividadSelect.value.frmActividad,
          element: this._getModel()
        }
      });
    }
  }

  private _getModel(): TareaDTO {
    let tareas: TareaResponse[] = [];

    for (let i of this.listTareas) {
      let t = new TareaResponse();
      t.nombreTarea = i.nombreTarea;
      t.plazo = i.plazo;
      t.porcentajeAvance = 0;
      tareas.push(t);
    }

    let ReqUsuario = new RequerimientoUsuario();
    ReqUsuario.idRequerimientoUsuario = this.data.obj.idRequerimientoUsuario;

    let poi = new Poi();
    poi.idPoi = this.formActividadSelect.value.frmActividad.idPoi;

    return {
      poi: poi,
      requerimientoUsuario: ReqUsuario,
      listTarea: tareas,
    };
  }

  // onIntegranteCreate() {
  //   console.log(this.formIntegranteAsignacion.value);
  //   if (this.formIntegranteAsignacion.value.frmIntegrante == null || this.formIntegranteAsignacion.value.frmTarea == null || this.formIntegranteAsignacion.value.frmPlazo == null) {
  //     this._notification.warning("Se deben ingresar los datos para continuar");
  //     return;
  //   }
  //   else {
  //     if (this.listTareas.find(x => x.idUsuario === this.formIntegranteAsignacion.value.frmIntegrante.idUsuario) != undefined) {
  //       this._notification.warning("Este trabajador ya esta en lista");
  //       return;
  //     }
  //     else {
  //       this.listTareas.push({
  //         "idUsuario": this.formIntegranteAsignacion.value.frmIntegrante.idUsuario,
  //         "nombrePersona": this.formIntegranteAsignacion.value.frmIntegrante.nombres + " " + this.formIntegranteAsignacion.value.frmIntegrante.apellidos,
  //         "nombreTarea": this.formIntegranteAsignacion.value.frmTarea,
  //         "plazo": this.formIntegranteAsignacion.value.frmPlazo._d.toLocaleDateString()
  //       });
  //       this.table.renderRows();
  //     }
  //   }
  // }
  // deleteIntegrante(index) {
  //   this.listTareas.splice(index, 1);
  //   this.table.renderRows();
  // }

}
