import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { ConfirmAcceptComponent } from './dialogs/confirm-accept/confirm-accept.component';
import { MoveRequirementComponent } from './dialogs/move-requirement/move-requirement.component';
import { ReadRequirementComponent } from './dialogs/read-requirement/read-requirement.component';

@Component({
  selector: 'gestion-rendimiento-mis-requerimientos',
  templateUrl: './mis-requerimientos.component.html',
  styleUrls: ['./mis-requerimientos.component.scss']
})
export class MisRequerimientosComponent implements OnInit {
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Item','Nombre del Requerimiento','Gerencia Solicitante','Estado','Acciones'];
  menuToggle = new EventEmitter<void>();

  data =[];

  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    ) { }

  ngOnInit(): void {
    this.loadTable();
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

  showDialogReadRequirement(element) {
    const dialogRef: MatDialogRef<ReadRequirementComponent> = this.dialog.open(ReadRequirementComponent, {
      disableClose: false,
      width: '40%',
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

  showDialogConfirmAccept(element){
    const dialogRef: MatDialogRef<ConfirmAcceptComponent> = this.dialog.open(ConfirmAcceptComponent, {
      disableClose: false,
      width: '30%',
      autoFocus: false,
      data: {
        obj : element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }
  showDialogMoveRequirement(element){
    const dialogRef: MatDialogRef<MoveRequirementComponent> = this.dialog.open(MoveRequirementComponent, {
      disableClose: false,
      width: '20%',
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
