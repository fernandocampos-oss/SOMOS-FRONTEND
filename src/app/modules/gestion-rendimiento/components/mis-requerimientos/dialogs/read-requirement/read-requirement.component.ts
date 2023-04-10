import { DataSource } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DialogService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { ReplaySubject } from 'rxjs';

interface Poi{
  descripcion: string;
}
@Component({
  selector: 'app-read-requirement',
  templateUrl: './read-requirement.component.html',
  styleUrls: ['./read-requirement.component.scss']
})
export class ReadRequirementComponent implements OnInit {
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  
  displayedColumns: string[] = ['Actividad POI', 'Acciones'];
  selectedIndex=0;
  objElement: any;
  idEstado: any;
  form: FormGroup;
  requerimiento: String = '';
  pois: Poi[] = [
    {descripcion:'Implementar los sistemas administrativos'},
    {descripcion:'Desarrollar y mantener los sistemas administrativos'},
    {descripcion:'Realizar actividades de soporte operativo y administrativo para garantizar la ejecución presupuestal de la GCTIC'},
  ];
  descripcionPoi: string;
  poiList:Array<{descripcionPoi: string}> = [];
  dataSource = this.poiList;
  constructor(
    private _dialogService: DialogService,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private services: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    this.idEstado=this.data.obj.idEstado;
    this.objElement=this.data.obj;
    this.requerimiento = this.objElement.descripcion;
    this.createForm();
  }
  createForm(){
    this.form = this._fb.group({
      frmTipo: [null,[Validators.required, Validators.maxLength(300)]],
      frmDescripcion: [this.objElement.descripcion],
      frmAreaSolicitante:[this.objElement.avance],
      frmAreaDestinatario:[this.objElement.avance],
      frmEstado: [this.objElement.estado],
      frmPOI: this._fb.array([
        this._fb.control('')
      ])
    });
  }

  onPoiCreate(){
    this.poiList.push({descripcionPoi: this.descripcionPoi});
    this.descripcionPoi = "";
    this.table.renderRows();
  }

  deletePoi(index){
    this.poiList.splice(index,1);
    this.table.renderRows();
  }
  // }
}
