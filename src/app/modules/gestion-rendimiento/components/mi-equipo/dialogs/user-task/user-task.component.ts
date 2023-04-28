import { filter } from 'rxjs/operators';
import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UserAddTaskComponent } from '../user-add-task/user-add-task.component';
import { UserDownloadTaskComponent } from '../user-download-task/user-download-task.component';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { DialogService, NotificationService } from '@core/services';

interface Tarea {
  item: number;
  tarea: string;
  estado: string;
  porcentaje: string;
}

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.scss']
})
export class UserTaskComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  // displayedColumns: string[] = ['item', 'descripcion','porcentaje','fecIni', 'fecFin','estado','acciones'];
  displayedColumns: string[] = ['item', 'tarea', 'estado', 'porcentaje', 'acciones'];
  idUsuario: number;
  nombreUsuario: string;

  tareas: Tarea[] = [
    { item: 1, tarea: 'Nombre Tarea 1', estado: 'FINALIZADO', porcentaje: '100' },
    { item: 2, tarea: 'Nombre Tarea 2', estado: 'PENDIENTE', porcentaje: '50' },
    { item: 3, tarea: 'Nombre Tarea 3', estado: 'FINALIZADO', porcentaje: '100' },
  ];

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UserTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    private _dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.idUsuario = this.data.id;
    this.nombreUsuario = this.data.colaborador;
    this.loadTable();
  }

  loadTable() {
    this.services.ListarTareas(this.idUsuario).subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.dataSource = new MatTableDataSource(dataItem.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = null;
        if (dataItem.msj == "LISTA VACIA") {
          this._notification.warning(dataItem.msj)
        } else {
          this._notification.error(dataItem.msj)
        }
      }
    });
  }

  showDialogTaksUser() {
    const dialogRef: MatDialogRef<UserAddTaskComponent> = this.dialog.open(UserAddTaskComponent, {
      disableClose: false,
      width: '450px',
      //height: '780px',
      autoFocus: false,
      data: {
        auto: false,
        id: this.idUsuario
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogDownloadTask(element) {
    const dialogRef: MatDialogRef<UserDownloadTaskComponent> = this.dialog.open(UserDownloadTaskComponent, {
      disableClose: false,
      width: '70%',
      //height: '780px',
      autoFocus: false,
      data: {
        obj: element,
        flg: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok') {
        this.loadTable()
      }
    });
  }

  finalizarTarea() {
    this._dialogService
      .openConfirm('¿Está seguro de finalizar la tarea?')
      .pipe(filter((isConfirmed) => isConfirmed))
      .subscribe(() => this.onSave());
  }

  onSave() {

  }

}
