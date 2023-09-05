import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { Requerimiento } from '@data/models/requerimiento/requerimiento.model';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ColumnDef } from '@shared/table/table.component';
import { filter } from 'rxjs/operators';
import { RequerimientoRegisterUpdateComponent } from '../components/requerimiento-register-update/requerimiento-register-update.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VerTareaComponent } from '../components/ver-tarea/ver-tarea.component';

@Component({
  selector: 'app-mis-requerimientos',
  templateUrl: './mis-requerimientos.component.html',
  styleUrls: ['./mis-requerimientos.component.scss']
})
export class MisRequerimientosComponent implements OnInit {

  actionPend = 'Avance';
  actionFin = 'Ver';
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['requerimiento', 'fecha_asignacion', 'avance', 'estado', 'acciones'];

  @ViewChild(MatSort) sort_finalizado: MatSort;
  @ViewChild(MatPaginator) paginator_finalizado: MatPaginator;
  dataSource_finalizado: MatTableDataSource<any>;
  displayedColumns_finalizado: string[] = ['requerimiento', 'fecha_asignacion', 'avance', 'estado'];

  @ViewChild(MatSort) sort_rechazado: MatSort;
  @ViewChild(MatPaginator) paginator_rechazado: MatPaginator;
  dataSource_rechazado: MatTableDataSource<any>;
  displayedColumns_rechazado: string[] = ['requerimiento', 'fecha_asignacion', 'avance', 'estado'];

  constructor(
    private _matDialog: MatDialog,
    private _services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTablePendiente();
    this.loadTableFinalizado();
    this.loadTableRechazado();
  }

  registrarRequerimiento() {
    const dialogRef: MatDialogRef<RequerimientoRegisterUpdateComponent> = this._matDialog.open(RequerimientoRegisterUpdateComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: false,
      data: {
        auto: true,
        id: 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
      this.loadTableFinalizado();
      this.loadTableRechazado();
    });
    
  }

  onDeleteRequerimiento($event) {
  }

  async loadTablePendiente() {
    let listPendiente = await this._services.listarRequerimientoPendiente().then((data) => {
      if (data) {
        this.dataSource = new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      } else {
        this._notification.warning('Lista de requerimientos pendientes vacia');
      }
    });
  }

  async loadTableFinalizado() {
    let listFinalizado = await this._services.listarRequerimientoFinalizado().then((data) => {
      if (data) {
        console.log(data)
        this.dataSource_finalizado = new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator_finalizado;
        // this.dataSource.sort = this.sort_finalizado;
      } else {
        this._notification.warning('Lista de requerimientos finalizados vacia');
      }
    });
  }

  async loadTableRechazado() {
    let listRechazado = await this._services.listarRequerimientoRechazado().then((data) => {
      if (data) {
        this.dataSource_rechazado = new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator_rechazado;
        // this.dataSource.sort = this.sort_rechazado;
      } else {
        this._notification.warning('Lista de requerimientos rechazados vacia');
      }
    });
  }

  verDetalleRequerimiento(element){
    const dialogRef: MatDialogRef<VerTareaComponent> = this._matDialog.open(VerTareaComponent, {
      disableClose: false,
      width: '60%',
      //height: '780px',
      autoFocus: true,
      data: {
        // auto: true,
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
      this.loadTableFinalizado();
      this.loadTableRechazado();
    });
  }

}
