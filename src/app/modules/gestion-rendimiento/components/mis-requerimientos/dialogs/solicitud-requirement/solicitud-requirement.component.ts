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

  porcentajeInicial: boolean = false;

  constructor(
    private dialogRef: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private services: GestionRendimientoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.listarPoi();
    // this.listarPersonalUnidad();
    this.getPorcentajeInicialTarea();
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

  getPorcentajeInicialTarea() {
    if (this.data.obj.listTarea.length > 0) {
      for (let i of this.data.obj.listTarea) {
        if (i.porcentajeInicial == 80) {
          this.porcentajeInicial = true;
          console.log("estado 80% = ", this.porcentajeInicial);
        }
      }
    }
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
        // plazo: this.formTareasListadas.value.frmDateTarea._d.toLocaleDateString()
        plazo: moment(this.formTareasListadas.value.frmDateTarea._d).format('YYYY-MM-DDTHH:mm:ss')
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
      this._notification.warning("Ingrese al menos una tarea para continuar");
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
    let porcentajeDefault = 80;

    for (let i of this.listTareas) {
      let t = new TareaResponse();
      t.nombreTarea = i.nombreTarea;
      t.plazo = i.plazo;

      if (this.porcentajeInicial == true) {
        if (this.listTareas.length >= 2) {
          t.porcentajeInicial = 0;
        } else {
          t.porcentajeInicial = 0;
        }
      } else {
        if (this.listTareas.length >= 2) {
          t.porcentajeInicial = porcentajeDefault;
          porcentajeDefault = 0;
        } else {
          t.porcentajeInicial = 0;
        }
      }

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
