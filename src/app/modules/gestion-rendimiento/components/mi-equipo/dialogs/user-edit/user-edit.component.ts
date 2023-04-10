import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('mat1') mat1: MatPaginator;
  @ViewChild('mat2') mat2: MatPaginator;
  dataSourceM: MatTableDataSource<any>;
  dataSourceR: MatTableDataSource<any>;
  displayedColumnsM: string[] = ['item', 'nombre','fecha'];
  displayedColumnsR: string[] = ['item', 'nombre', 'fecha'];
  idUsuario: number;
  nombreUsuario: string;

  listaModalidad=[];
  listaRiesgo=[];
  idModalidad:number=0;
  idRiesgo:number=0;
  idEquipoIntegranteModalidad:number=0
  idEquipoIntegranteRiesgo:number=0

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.idUsuario=this.data.id;
    this.nombreUsuario=this.data.colaborador;
    this.loadTable();
  }

  loadTable(){
    this.services.ListarMisModalidades(this.idUsuario).subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.dataSourceM = new MatTableDataSource(dataItem.data);
        this.dataSourceM.paginator = this.mat1;
        this.idEquipoIntegranteModalidad=dataItem.data[0].idModalidad;
      } else {
        this.idEquipoIntegranteModalidad=0;
        this.dataSourceM=null;
        if(dataItem.msj=="LISTA VACIA"){
          this._notification.warning(dataItem.msj)
        } else {
          this._notification.error(dataItem.msj)
        }
      }
      this.loadModalidad();
    });

    this.services.ListarMisRiesgos(this.idUsuario).subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.dataSourceR = new MatTableDataSource(dataItem.data);
        this.dataSourceR.paginator = this.mat2;
        this.idEquipoIntegranteRiesgo=dataItem.data[0].idRiesgo;
      } else {
        this.idEquipoIntegranteRiesgo=0;
        this.dataSourceR=null;
        if(dataItem.msj=="LISTA VACIA"){
          this._notification.warning(dataItem.msj)
        } else {
          this._notification.error(dataItem.msj)
        }
      }
      this.loadRiesgo();
    });
  }

  loadModalidad(){
    this.services.ListarModalidad().subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.listaModalidad = dataItem.data;
        if(this.idEquipoIntegranteModalidad!=0){
          this.idModalidad=this.idEquipoIntegranteModalidad;
        }
      } else {
        this.listaModalidad = null;
        this._notification.error(dataItem.msj)
      }
    });
  }

  loadRiesgo(){
    this.services.ListarRiesgo().subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.listaRiesgo = dataItem.data;
        if(this.idEquipoIntegranteRiesgo!=0){
          this.idRiesgo=this.idEquipoIntegranteRiesgo;
        }
      } else {
        this.listaRiesgo = null;
        this._notification.error(dataItem.msj)
      }
    });
  }

  onSave(){
    if(this.idModalidad==0 && this.idRiesgo==0){
      this._notification.error("Se debe seleccionar una modalidad o riesgo")
    } else {
      let obj = new objGuardar();
      obj.idEquipoIntegrante=this.idUsuario;
      obj.idModalidad=this.idModalidad;
      obj.idRiesgo=this.idRiesgo;
      this.services.RegistrarIntegranteDetalle(obj).subscribe((dataItem) => {
        if (dataItem.codigo == 1) {
          this.loadTable();
          this._notification.success(dataItem.msj);
        } else {
          this._notification.error(dataItem.msj);
        }
      });
    }
  }

}

export class objGuardar {
  idEquipoIntegrante?: number
  idModalidad?: number
  idRiesgo?: number
}
