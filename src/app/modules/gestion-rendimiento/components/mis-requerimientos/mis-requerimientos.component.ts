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

@Component({
  selector: 'gestion-rendimiento-mis-requerimientos',
  templateUrl: './mis-requerimientos.component.html',
  styleUrls: ['./mis-requerimientos.component.scss']
})
export class MisRequerimientosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Item', 'nombre_requerimiento', 'integrante', 'fecha_creacion', 'porcentaje_avance', 'estado', 'acciones'];
  menuToggle = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
  }

  async loadTable() {
    this.services.listarRequerimientoPrincipal().then((data) => {
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this._notification.warning("Lista de requerimientos vacia")
      }
    });
  }

  // sortearTabla() {
  //   this.dataSorteada = this.services.FauxTablaRequerimientos().filter(function (a) {
  //     return a.gerenciaReceptora == 'SGSA';
  //   })
  // }

  verRequerimiento(element) {
    const dialogRef: MatDialogRef<ReadRequirementComponent> = this.dialog.open(ReadRequirementComponent, {
      disableClose: false,
      width: '70%',
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

  registrarTareas(element) {
    const dialogRef: MatDialogRef<SolicitudRequirementComponent> = this.dialog.open(SolicitudRequirementComponent, {
      disableClose: true,
      width: '50%',
      maxHeight: '810px',
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

  aprobarRequerimiento(element, onDelete: boolean) {
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

  derivarRequerimiento(element) {
    const dialogRef: MatDialogRef<MoveRequirementComponent> = this.dialog.open(MoveRequirementComponent, {
      disableClose: false,
      width: '35%',
      autoFocus: false,
      data: {
        obj: element,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }
}
