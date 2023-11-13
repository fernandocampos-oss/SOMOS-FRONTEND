import { element } from 'protractor';
import { Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { AppConfig } from '@core/configs';
import { Actividad, Indicador } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
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
  listTareas: Array<{ nombreTarea: string, plazo: String }> = [];
  dataSource = this.listTareas;
  displayedColumns: string[] = ['item', 'tarea', 'plazo', 'Quitar'];
  
  minFechaTarea = AppConfig.MAX_FECHA_NACIMIENTO;
  listActividad: Actividad[];

  formTareasListadas = this._formBuilder.group({
    frmDescTarea: [''],
    frmDateTarea: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private services: GestionRendimientoService,    
  ) { }

  ngOnInit(): void {
    console.log("asignar i", this.data)
  }

  crearTareaSinActividad() {
    // console.log(this.formTareasListadas.value);
    if (this.formTareasListadas.value.frmDescTarea == undefined || this.formTareasListadas.value.frmDateTarea == undefined ||
      this.formTareasListadas.value.frmDescTarea == '' || this.formTareasListadas.value.frmDateTarea == '') {
      this._notification.warning("Se deben ingresar los datos para continuar");
    } else {
      this.listTareas.push({
        nombreTarea: this.formTareasListadas.value.frmDescTarea,
        // plazo: this.formTareasListadas.value.frmDateTarea._d.toLocaleDateString()
        plazo: moment(this.formTareasListadas.value.frmDateTarea._d).format('YYYY-MM-DDTHH:mm:ss')
      });
      this.table.renderRows();
    }
  }
  deleteTareaSinActividad(index) {
    this.listTareas.splice(index, 1);
    this.table.renderRows();
  }

  registrarTareasSinActividad() {
    if (this.listTareas.length == 0) {
      this._notification.warning("Ingrese al menos una tarea para continuar");
    } else {
      const dialogRef: MatDialogRef<ConfirmarTareaComponent> = this.dialogRef.open(ConfirmarTareaComponent, {
        disableClose: false,
        autoFocus: false,
        data: {
          // poi: this.formActividadSelect.value.frmActividad,
          element: this._getModelSinActividad()
        }
      });
    }
  }
  private _getModelSinActividad(): TareaRequestDto {
    let tareas: TareaResponse[] = [];
    for (let i of this.listTareas) {
      let t = new TareaResponse();
      t.nombre = i.nombreTarea;
      t.plazo = i.plazo;

      tareas.push(t);
    }

    let indicador = new Indicador();
    indicador.idIndicador = this.data.element.idIndicador;

    let actividad = new Actividad();
    actividad.idActividad = 0;

    return {
      actividad: actividad,
      indicador: indicador,
      listTarea: tareas,
    };
  }
  
}
