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
import { RequerimientoRegisterUpdateComponent } from '@modules/mis-requerimientos/components/requerimiento-register-update/requerimiento-register-update.component';
import { JefeRequirementComponent } from './dialogs/jefe-requirement/jefe-requirement.component';
import { MiEquipoComponent } from '../mi-equipo/mi-equipo.component';

@Component({
  selector: 'gestion-rendimiento-mis-requerimientos',
  templateUrl: './mis-requerimientos.component.html',
  styleUrls: ['./mis-requerimientos.component.scss']
})
export class MisRequerimientosComponent implements OnInit {
  listDataPendientes: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Item', 'nombre_requerimiento', 'trabajador', 'fecha_creacion', 'porcentaje_avance', 'estado', 'acciones'];
  // menuToggle = new EventEmitter<void>();

  constructor(
    private _dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
  }

  async actualizar() {
    this.listDataPendientes = [];
    let listar = await this.loadTable();
  }

  async loadTable() {
    let listar = await this.services.listarRequerimientoPrincipal().then((data) => {
      if (data.length > 0) {
        this.listDataPendientes = data;
        this.dataSource = new MatTableDataSource(this.listDataPendientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  // sortearTabla() {
  //   this.dataSorteada = this.services.FauxTablaRequerimientos().filter(function (a) {
  //     return a.gerenciaReceptora == 'SGSA';
  //   })
  // }

  verRequerimiento(element) {
    const dialogRef: MatDialogRef<ReadRequirementComponent> = this._dialog.open(ReadRequirementComponent, {
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
    const dialogRef: MatDialogRef<SolicitudRequirementComponent> = this._dialog.open(SolicitudRequirementComponent, {
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
    const dialogRef: MatDialogRef<AcceptRejectRequirementComponent> = this._dialog.open(AcceptRejectRequirementComponent, {
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
    const dialogRef: MatDialogRef<MoveRequirementComponent> = this._dialog.open(MoveRequirementComponent, {
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

  // nuevoRequerimientoJefe() {
  //   const dialogRef: MatDialogRef<RequerimientoRegisterUpdateComponent> = this._dialog.open(RequerimientoRegisterUpdateComponent, {
  //     disableClose: false,
  //     width: '50%',
  //     //height: '780px',
  //     autoFocus: false,
  //     data: {
  //       esJefe: true,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  listRequerimientosJefe() {
    const dialogRef: MatDialogRef<JefeRequirementComponent> = this._dialog.open(JefeRequirementComponent, {
      disableClose: false,
      width: '80%',
      // height: '680px',
      autoFocus: false,
      data: {
        esJefe: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  modalMiEquipo() {
    const dialogRef: MatDialogRef<MiEquipoComponent> = this._dialog.open(MiEquipoComponent, {
      disableClose: false,
      width: '80%',
      //height: '780px',
      autoFocus: false,
      data: {
        // esJefe: false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

}
