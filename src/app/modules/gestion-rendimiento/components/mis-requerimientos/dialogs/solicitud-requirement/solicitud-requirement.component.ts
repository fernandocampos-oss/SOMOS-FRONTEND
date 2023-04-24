import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

interface Poi {
  descripcion: string;
}

interface Meta {
  producto: string;
  meta: string;
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

  displayedColumns: string[] = ['Ver', 'Prioridades Anuales de Gestión', 'Quitar'];
  pois: Poi[] = [
    { descripcion: 'Implementar los sistemas administrativos' },
    { descripcion: 'Desarrollar y mantener los sistemas administrativos' },
    { descripcion: 'Realizar actividades de soporte operativo y administrativo para garantizar la ejecución presupuestal de la GCTIC' },
  ];
  descripcionPoi: string;
  poiList: Array<{ descripcionPoi: string }> = [];
  dataSource = this.poiList;
  nombrePoi: any;

  displayedColumns_2: string[] = ['Ver', 'Indicadores / Producto', 'Valor Meta', 'Quitar'];
  metas: Meta[] = [
    { producto: 'Producto 1', meta: 'Meta 1' },
    { producto: 'Producto 2', meta: 'Meta 2' },
  ];
  descripcionMeta: string;
  metaList: Array<{ descripcionMeta: string }> = [];
  dataSource_2 = this.metaList;

  indicadorNgModel: string;
  valorMetaNgModel: string;

  nombreMeta: any;

  displayedColumns_3: string[] = ['Tarea', 'Plazo', 'Quitar'];
  tareas: Tarea[] = [
    { tarea: 'Tarea 1', plazo: 'Plazo 1' },
    { tarea: 'Tarea 2', plazo: 'Plazo 2' },
    { tarea: 'Tarea 3', plazo: 'Plazo 3' },
  ];
  descripcionTarea: string;
  tareaList: Array<{ descripcionTarea: string }> = [];
  dataSource_3 = this.tareaList;

  constructor() { }

  ngOnInit(): void {
  }

  verPoi(element) {
    this.nombrePoi = element.descripcionPoi;
  }

  onPoiCreate() {
    this.poiList.push({ descripcionPoi: this.descripcionPoi });
    this.descripcionPoi = "";
    this.table.renderRows();
  }

  deletePoi(index){
    this.poiList.splice(index,1);
    this.table.renderRows();
  }

  verMeta(element) {
    this.nombreMeta = element.producto;
  }

  onMetaCreate() {
    this.metas.push({ producto: 'Producto 13', meta: 'Meta 13' });
    this.descripcionMeta = "";
    this.table.renderRows();

    console.log(this.metas);
  }

  deleteMeta(index){
    this.metaList.splice(index,1);
    this.table.renderRows();
  }

  onIndicadorCreate() {
    this.metas.push({ producto: 'Producto 13', meta: 'Meta 13' });
    this.descripcionMeta = "";
    this.table.renderRows();
  }

  deleteTarea(index){
    this.tareaList.splice(index,1);
    this.table.renderRows();
  }

}
