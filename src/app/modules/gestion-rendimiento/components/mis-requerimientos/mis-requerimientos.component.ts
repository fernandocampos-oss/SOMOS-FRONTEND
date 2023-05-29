import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { AcceptRejectRequirementComponent } from './dialogs/accept-reject-requirement/accept-reject-requirement.component';
import { MoveRequirementComponent } from './dialogs/move-requirement/move-requirement.component';
import { ReadRequirementComponent } from './dialogs/read-requirement/read-requirement.component';
import { SolicitudRequirementComponent } from './dialogs/solicitud-requirement/solicitud-requirement.component';

interface Requerimiento {
  id: number;
  nombreRequerimiento: string;
  tipoRequerimiento: string;
  descripcion: string;
  gerenciaSolicitante: string;
  gerenciaReceptora: string;
  estado: string;
  motivo?: string;
}

@Component({
  selector: 'gestion-rendimiento-mis-requerimientos',
  templateUrl: './mis-requerimientos.component.html',
  styleUrls: ['./mis-requerimientos.component.scss']
})
export class MisRequerimientosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Item', 'nombreRequerimiento', 'gerenciaSolicitante', 'estado', 'acciones'];
  menuToggle = new EventEmitter<void>();

  // data: Requerimiento[] = [
  //   { id: 1,  nombreRequerimiento: 'Hacer informe del SAP Planillas	', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 1', gerenciaSolicitante: 'GPyORH', gerenciaReceptora:'SGSA', estado:'EN PROCESO'},
  //   { id: 2,  nombreRequerimiento: 'Requerimiento Prueba 1', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 2', gerenciaSolicitante: 'GDP', gerenciaReceptora:'SGSA', estado:'PENDIENTE'},
  //   { id: 3,  nombreRequerimiento: 'Requerimiento Prueba 2', tipoRequerimiento:'Problemas de acceso', descripcion: 'Descripcion medianamente larga para el requerimiento 3', gerenciaSolicitante: 'GAP', gerenciaReceptora:'SGSA', estado:'DERIVADO'},
  //   { id: 4,  nombreRequerimiento: 'Requerimiento Prueba 3', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 4', gerenciaSolicitante: 'GDP', gerenciaReceptora:'SGSA', estado:'EN PROCESO'},
  //   { id: 5,  nombreRequerimiento: 'Requerimiento Prueba 4', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 5', gerenciaSolicitante: 'GAP', gerenciaReceptora:'SGSA', estado:'PENDIENTE'},
  //   { id: 6,  nombreRequerimiento: 'Requerimiento Prueba 5', tipoRequerimiento:'Problemas de encendido', descripcion: 'Descripcion medianamente larga para el requerimiento 6', gerenciaSolicitante: 'GAP', gerenciaReceptora:'SGSA', estado:'DERIVADO'},
  //   { id: 7,  nombreRequerimiento: 'Requerimiento Prueba 6', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 7', gerenciaSolicitante: 'GDP', gerenciaReceptora:'SGSA', estado:'EN PROCESO'},
  //   { id: 8,  nombreRequerimiento: 'Requerimiento Prueba 7', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 8', gerenciaSolicitante: 'GPyORH', gerenciaReceptora:'SGSA', estado:'DERIVADO'},
  // ];
  dataSorteada: Requerimiento[];
  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
  }

  loadTable() {
    this.sortearTabla();
    // this.services.ListarTareas(0).subscribe((dataItem) => {
    //   if (dataItem.codigo == 1) {
    //     this.dataSource = new MatTableDataSource(this.dataSorteada);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   } else {
    //     this.dataSource = null;
    //     if (dataItem.msj == "LISTA VACIA") {
    //       this._notification.warning(dataItem.msj)
    //     } if (dataItem.msj == "USTED NO SE ENCUENTRA ASGINADO EN UN EQUIPO DE TRABAJO") {
    //       this._notification.warning(dataItem.msj)
    //     } else {
    //       this._notification.error(dataItem.msj)
    //     }
    //   }
    // });

    this.services.listarRequerimiento().subscribe((data) => {
      console.log(">", data);
      if (data) {
        this.dataSorteada=data;
        this.dataSource = new MatTableDataSource(this.dataSorteada);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = null;
        // if (dataItem.msj == "LISTA VACIA") {
        //   this._notification.warning(dataItem.msj)
        // } if (dataItem.msj == "USTED NO SE ENCUENTRA ASGINADO EN UN EQUIPO DE TRABAJO") {
        //   this._notification.warning(dataItem.msj)
        // } else {
        //   this._notification.error(dataItem.msj)
        // }
      }
    });

  }

  sortearTabla() {
    this.dataSorteada = this.services.FauxTablaRequerimientos().filter(function (a) {
      return a.gerenciaReceptora == 'SGSA';
    })
  }

  showDialogReadRequirement(element) {
    const dialogRef: MatDialogRef<ReadRequirementComponent> = this.dialog.open(ReadRequirementComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: false,
      data: {
        obj: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogSolicitud(element) {
    const dialogRef: MatDialogRef<SolicitudRequirementComponent> = this.dialog.open(SolicitudRequirementComponent, {
      disableClose: true,
      width: '40%',
      maxHeight: '700px',
      //height: '780px',
      autoFocus: false,
      data: {
        obj: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogAcceptRejectRequirement(element, onDelete: boolean) {
    const dialogRef: MatDialogRef<AcceptRejectRequirementComponent> = this.dialog.open(AcceptRejectRequirementComponent, {
      disableClose: false,
      autoFocus: false,
      data: {
        obj: element,
        rechazar: onDelete
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogMoveRequirement(element) {
    const dialogRef: MatDialogRef<MoveRequirementComponent> = this.dialog.open(MoveRequirementComponent, {
      disableClose: false,
      width: '35%',
      autoFocus: false,
      data: {
        obj: element,
        moreData: this.services.FauxTablaRequerimientos()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }
}
