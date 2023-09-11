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

@Component({
  selector: 'gestion-rendimiento-mis-tareas',
  templateUrl: './mis-tareas.component.html',
  styleUrls: ['./mis-tareas.component.scss']
})
export class MisTareasComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'descripcion', 'avance', 'plazo', 'estado', 'acciones'];

  listRedes: any[] = [
    { descripcion: 'descripcion', avance: 2, plazo: '0221', estado: '0221' },
    { descripcion: 'descripcion', avance: 2, plazo: '0221', estado: '0221' },
  ];

  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.listRedes);
  }

  loadTable() {
  }

  showDialogDownloadTask(element, i: number) {
    const dialogRef: MatDialogRef<UserDownloadTaskComponent> = this.dialog.open(UserDownloadTaskComponent, {
      disableClose: false,
      width: '70%',
      //height: '780px',
      autoFocus: false,
      data: {
        // obj: this.services.getFauxRequerimiento(this.datosAsignados[i].idReq),
        // objAsignacion: this.datosAsignados[i],
        model: element,
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
        id: 0
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
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

}

