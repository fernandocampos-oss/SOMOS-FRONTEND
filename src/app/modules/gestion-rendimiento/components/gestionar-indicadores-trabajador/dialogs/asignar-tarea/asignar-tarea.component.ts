import { Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { AppConfig } from '@core/configs';
import { Actividad, IndicadorUsuario } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { ConfirmarTareaComponent } from './dialog/confirmar-tarea/confirmar-tarea.component';
import { TareaRequestDto, TareaResponse } from '@data/models/gestion-rendimiento/tarea-model';
import * as moment from 'moment';

@Component({
  selector: 'app-asignar-tarea',
  templateUrl: './asignar-tarea.component.html',
  styleUrls: ['./asignar-tarea.component.scss']
})
export class AsignarTareaComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  minFechaTarea = AppConfig.MAX_FECHA_NACIMIENTO;
  listActividad: Actividad[];
  // listPersonal: Personal[];

  listTareas: Array<{ nombreTarea: string, plazo: String, pesoFraccion: number }> = [];
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
    this.listarActividades();
    // this.listarPersonalUnidad();
  }

  async listarActividades() {
    let listActividades = await this.services.listarActividades().then((data) => {
      if (data.length > 0) {
        this.listActividad = data;
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
        // plazo: this.formTareasListadas.value.frmDateTarea._d.toLocaleDateString()
        plazo: moment(this.formTareasListadas.value.frmDateTarea._d).format('YYYY-MM-DDTHH:mm:ss'),
        pesoFraccion: 0
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
      const dialogRef: MatDialogRef<ConfirmarTareaComponent> = this.dialogRef.open(ConfirmarTareaComponent, {
        disableClose: false,
        autoFocus: false,
        data: {
          // poi: this.formActividadSelect.value.frmActividad,
          element: this._getModel()
        }
      });
    }
  }

  private _getModel(): TareaRequestDto {
    let tareas: TareaResponse[] = [];

    for (let i of this.listTareas) {
      let t = new TareaResponse();
      t.nombre = i.nombreTarea;
      t.plazo = i.plazo;
      t.pesoFraccion = i.pesoFraccion

      tareas.push(t);
    }

    let indicadorUsuario = new IndicadorUsuario();
    indicadorUsuario.idIndicadorUsuario = this.data.obj.idIndicadorUsuario;

    let actividad = new Actividad();
    actividad.idActividad = this.formActividadSelect.value.frmActividad.idActividad;

    return {
      actividad: actividad,
      indicadorUsuario: indicadorUsuario,
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
