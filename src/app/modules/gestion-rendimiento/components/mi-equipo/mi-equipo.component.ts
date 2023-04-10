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

@Component({
  selector: 'gestion-rendimiento-mi-equipo',
  templateUrl: './mi-equipo.component.html',
  styleUrls: ['./mi-equipo.component.scss']
})
export class MiEquipoComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'colaborador','cargo', 'tareas','pendientes', 'pendientesAprobacion','acciones'];

  constructor(
    private dialog: MatDialog,
    private services : GestionRendimientoService,
    private _notification: NotificationService,) { }

  ngOnInit(): void {
    this.loadTable();
  }

  showDialogEdit(item) {
    const dialogRef: MatDialogRef<UserEditComponent> = this.dialog.open(UserEditComponent, {
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

  showDialogUser(onDelete : boolean) {
    const dialogRef: MatDialogRef<UserAddDeleteComponent> = this.dialog.open(UserAddDeleteComponent, {
      disableClose: false,
      width: onDelete == true ? '600px':'70%',
      autoFocus: false,
      data: {
        title: (onDelete==true ? 'Eliminar ':'Agregar ') + 'integrante',
        borrar: onDelete
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogTaks(item){
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

  loadTable(){
    this.services.ListarIntegrantes().subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.dataSource = new MatTableDataSource(dataItem.data);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource=null;
        if(dataItem.msj=="LISTA VACIA"){
          this._notification.warning(dataItem.msj)
        } else {
          this._notification.error(dataItem.msj)
        }
      }
    });
  }

  filter(value: string){
    this.dataSource.filter=value.trim().toUpperCase();
  }

}
