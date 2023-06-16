import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserAddTaskComponent } from '../mi-equipo/dialogs/user-add-task/user-add-task.component';
import { UserDownloadTaskComponent } from '../mi-equipo/dialogs/user-download-task/user-download-task.component';
import { ReportTaskComponent } from './dialogs/report-task/report-task.component';
import { GestionRendimientoService } from '../../../../data/services/gestion-rendimiento.service'
import { NotificationService } from '@core/services';
import { Requerimiento_Integrante } from '@data/models/requerimiento/requerimiento.model';

@Component({
  selector: 'gestion-rendimiento-mis-tareas',
  templateUrl: './mis-tareas.component.html',
  styleUrls: ['./mis-tareas.component.scss']
})
export class MisTareasComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item','descripcion','avance', 'fechaFin','estado','acciones'];

  datosAsignados: Requerimiento_Integrante[] = [];

  data =[];

  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    ) { }

  ngOnInit(): void {
    this.loadTable();
    this.cargarRequerimientos();
  }

  loadTable(){
    this.services.ListarTareas(0).subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.dataSource = new MatTableDataSource(dataItem.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource=null;
        if(dataItem.msj=="LISTA VACIA"){
          this._notification.warning(dataItem.msj)
        } if(dataItem.msj=="USTED NO SE ENCUENTRA ASGINADO EN UN EQUIPO DE TRABAJO"){
          this._notification.warning(dataItem.msj)
        } else {
          this._notification.error(dataItem.msj)
        }
      }
    });
  }

  cargarRequerimientos(){
    // this.datosAsignados = this.services.getFauxTablaRequeAsignados(1);
  }
  
  showDialogDownloadTask(element, i: number){
    const dialogRef: MatDialogRef<UserDownloadTaskComponent> = this.dialog.open(UserDownloadTaskComponent, {
      disableClose: false,
      width: '70%',
      //height: '780px',
      autoFocus: false,
      data: {
        // obj: this.services.getFauxRequerimiento(this.datosAsignados[i].idReq),
        objAsignacion:this.datosAsignados[i],
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable()
    });
  }

  showDialogAddTask() {
    const dialogRef: MatDialogRef<UserAddTaskComponent> = this.dialog.open(UserAddTaskComponent, {
      disableClose: false,
      width: '70%',
      //height: '780px',
      autoFocus: false,
      data: {
        auto: true,
        id : 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogReportTask(element) {
    const dialogRef: MatDialogRef<ReportTaskComponent> = this.dialog.open(ReportTaskComponent, {
      disableClose: false,
      width: '500px',
      //height: '780px',
      autoFocus: false,
      data: {
        obj : element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

}

