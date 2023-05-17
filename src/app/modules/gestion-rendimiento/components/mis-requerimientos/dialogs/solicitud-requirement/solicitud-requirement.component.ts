import { element } from 'protractor';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import {FormBuilder, Validators} from '@angular/forms';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { RequerimientoAsignado } from '@data/models/requerimiento/requerimiento.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmRequerimientoComponent } from './dialog/confirm-requerimiento/confirm-requerimiento.component';
import { AppConfig } from '@core/configs';

interface Fonafe {
  descripcion: string;
}

interface Tarea {
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
  selectedIndex=0;

  fonafeAct: Fonafe[] = [
    { descripcion: 'Implementar los sistemas administrativos' },
    { descripcion: 'Desarrollar y mantener los sistemas administrativos' },
    { descripcion: 'Realizar actividades de soporte operativo y administrativo para garantizar la ejecución presupuestal de la GCTIC' },
  ];
  // poiList: Array<{ descripcionPoi: string }> = [];
  // dataSource = this.poiList;

  metaList: Array<{ descripcionMeta: string }> = [];
  dataSource_2 = this.metaList;

  displayedColumns_3: string[] = ['Tarea', 'Plazo', 'Quitar'];
  tareas: Tarea[] = [
    { tarea: 'Tarea 1', plazo: 'Plazo 1' },
    { tarea: 'Tarea 2', plazo: 'Plazo 2' },
    { tarea: 'Tarea 3', plazo: 'Plazo 3' },
  ];

  descripcionTarea: string;
  plazoMaxTarea: Date;
  tareaList: Array<{ nombreTarea: string, plazo: string }> = [];
  dataSource_3 = this.tareaList;

  //mat-stteper
  formActividadSelect = this._formBuilder.group({
    frmActividad: ['', Validators.required],
  });
  formTareasListadas = this._formBuilder.group({
    frmDescTarea: [''],
    frmDateTarea: [''],
  });

  constructor(private dialogRef       : MatDialog,
              private _notification   : NotificationService,
              private _formBuilder    : FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data.obj);
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

  ValidarTareas(){
    if(this.tareaList.length == 0)
      {
        this._notification.error("Se debe asignar almenos 1 tarea al requerimiento");
      }
    else{
      this._getModel();
      console.log(this._getModel());
      const dialogRef: MatDialogRef<ConfirmRequerimientoComponent> = this.dialogRef.open(ConfirmRequerimientoComponent, {
        disableClose: false,
        autoFocus: false,
        data: {
          obj: this._getModel()
        }
      });
    }
  }

  onTareaCreate(fecha: Date) {
    if(this.formTareasListadas.value.frmDescTarea == undefined || this.formTareasListadas.value.frmDateTarea == undefined ||
       this.formTareasListadas.value.frmDescTarea == '' || this.formTareasListadas.value.frmDateTarea == '' ){
      this._notification.error("Se deben ingresar los datos para continuar");
    }
    else{
      this.tareaList.push({ nombreTarea: this.formTareasListadas.value.frmDescTarea , plazo: fecha.toString()});
      this.table.renderRows();
    }
  }
  deleteTarea(index){
    this.tareaList.splice(index,1);
    this.table.renderRows();
  }

  private _getModel(): RequerimientoAsignado{
    return {
      id: this.data.obj.id,
      actividad: this.formActividadSelect.value.frmActividad,
      tareas: this.tareaList,
    };
  }
}
