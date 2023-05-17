import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserAddDeleteComponent } from './dialogs/user-add-delete/user-add-delete.component'
import { UserTaskComponent } from './dialogs/user-task/user-task.component'
import { GestionRendimientoService } from '../../../../data/services/gestion-rendimiento.service'
import { NotificationService } from '@core/services';
import { UserEditComponent } from './dialogs/user-edit/user-edit.component';
import { UserAddTaskComponent } from './dialogs/user-add-task/user-add-task.component';
import { TaskRejectComponent } from './dialogs/task-reject/task-reject.component';
import { PdfComponent } from './dialogs/pdf/pdf.component';
import { UserDownloadFileComponent } from './dialogs/user-download-file/user-download-file.component';
import { UserDownloadTaskComponent } from './dialogs/user-download-task/user-download-task.component';
import { AssignTaskUserComponent } from './dialogs/assign-task-user/assign-task-user.component';

interface Equipo {
  item: number;
  colaborador: string;
  cargo: string;
}

@Component({
  selector: 'gestion-rendimiento-mi-equipo',
  templateUrl: './mi-equipo.component.html',
  styleUrls: ['./mi-equipo.component.scss']
})
export class MiEquipoComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  // displayedColumns: string[] = ['item', 'colaborador','cargo', 'tareas','pendientes', 'pendientesAprobacion','acciones'];
  displayedColumns: string[] = ['item', 'colaborador', 'cargo', 'acciones'];

  equipos: Equipo[] = [
    { item: 1, colaborador: 'Luis Lopez Gutierrez', cargo: 'Analista de costos' },
    { item: 2, colaborador: 'Leandro Zarsosa Manuel', cargo: 'Analista de procesos' },
    { item: 3, colaborador: 'Celia Requena Egas', cargo: 'Administrador de BD' },
    { item: 4, colaborador: 'Elder Lizana Rodriguez', cargo: 'Tester QA' },
    { item: 5, colaborador: 'Maria Lopez Uribe', cargo: 'Analista funcional' },
  ];

  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,) { }

  ngOnInit(): void {
    this.loadTable();
  }

  showDialogAdd(item) {
    const dialogRef: MatDialogRef<AssignTaskUserComponent> = this.dialog.open(AssignTaskUserComponent, {
      disableClose: false,
      width: '50%',
      autoFocus: false,
      data: {
        id: item.id,
        colaborador: item.colaborador
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogUser(onDelete: boolean) {
    const dialogRef: MatDialogRef<UserAddDeleteComponent> = this.dialog.open(UserAddDeleteComponent, {
      disableClose: false,
      width: onDelete == true ? '600px' : '70%',
      autoFocus: false,
      data: {
        title: (onDelete == true ? 'Eliminar ' : 'Agregar ') + 'integrante',
        borrar: onDelete
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogTasks(item) {
    const dialogRef: MatDialogRef<UserTaskComponent> = this.dialog.open(UserTaskComponent, {
      disableClose: false,
      width: '70%',
      autoFocus: false,
      data: {
        id: item.id,
        colaborador: item.colaborador
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  loadTable() {
    this.services.ListarIntegrantes().subscribe((dataItem) => {
      if (dataItem.codigo == 0) { // cambiar el codigo a 1 luego de hacer el servicio
        this.dataSource = new MatTableDataSource(this.equipos);
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

  filter(value: string) {
    this.dataSource.filter = value.trim().toUpperCase();
  }

}
