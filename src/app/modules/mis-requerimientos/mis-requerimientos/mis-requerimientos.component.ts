import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { Requerimiento } from '@data/models/requerimiento/requerimiento.model';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ColumnDef } from '@shared/table/table.component';
import { filter } from 'rxjs/operators';
import { RequerimientoRegisterUpdateComponent } from '../components/requerimiento-register-update/requerimiento-register-update.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { MatTable } from '@angular/material/table';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-mis-requerimientos',
  templateUrl: './mis-requerimientos.component.html',
  styleUrls: ['./mis-requerimientos.component.scss']
})
export class MisRequerimientosComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  reqPendientes = new Array;
  reqFinalizados = new Array;
  reqRechazados = new Array;

  actionPend = 'Avance';
  actionFin = 'Ver';

  // requerimientos: Requerimiento[];
  reqPendientesColumns: ColumnDef[] = [
    { label: 'Requerimiento', name: 'nombre' },
    { label: 'Área Encargada', name: 'areaReceptor' }, 
    { label: 'Estado', name: 'estado'},
  ];
  reqFinalizadosColumns: ColumnDef[] = [
    {
      label: 'Requerimiento',
      name: 'nombreRequerimiento',
    },
    {
      label: 'Área Encargada',
      name: 'gerenciaReceptora',
    },
  ];
  reqDerivadosColumns: ColumnDef[] = [
    {
      label: 'Requerimiento',
      name: 'nombreRequerimiento',
    },
    {
      label: 'Área Encargada',
      name: 'gerenciaReceptora',
    },
    {
      label: 'Motivo de Rechazo',
      name: 'motivo',
    },
  ];
  constructor(
    private _matDialog: MatDialog,
    private _services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    // this.requerimientos = this._services.FauxTablaRequerimientos();
    this.catalogarRequerimientos();
    this.loadTable();
  }

  onCreateRequerimiento() {
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
      this.loadTable();
      this.reqFinalizados = [];
      this.reqPendientes = [];
      this.reqRechazados = [];
      // this.requerimientos = this._services.FauxTablaRequerimientos();
      this.catalogarRequerimientos();
      console.log(this.reqPendientes);
    });
    //this._openAddUpdateDialog(RequerimientoRegisterUpdateComponent, null, this._loadRequerimientos);
  }

  onDeleteRequerimiento($event) {
  }

  private _openAddUpdateDialog<T>(
    dialog: ComponentType<T>,
    data: any,
    callback: () => void
  ) {
    this._matDialog
      .open(dialog, { data, disableClose: true })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((isSuccess) => isSuccess)
      )
      .subscribe(() => callback.call(this));
  }

  // filterReadFunction(row: Requerimiento): boolean {
  //   return !(row.estado == 'PENDIENTE' || row.estado == 'APROBADO' || row.estado == 'DERIVADO');
  // }

  catalogarRequerimientos() {
    // for (let i = 0; i < this.requerimientos.length; i++) {
    //   switch (this.requerimientos[i].estado) {
    //     case 'RECHAZADO':
    //       this.reqRechazados.push(this.requerimientos[i]);
    //       break;
    //     case 'FINALIZADO':
    //       this.reqFinalizados.push(this.requerimientos[i]);
    //       break;
    //     case 'EN PROCESO':
    //       this.reqPendientes.push(this.requerimientos[i]);
    //       break;
    //     case 'DERIVADO':
    //       this.reqPendientes.push(this.requerimientos[i]);
    //       break;
    //     case 'PENDIENTE':
    //       this.reqPendientes.push(this.requerimientos[i]);
    //       break;
    //     case 'APROBADO':
    //       this.reqPendientes.push(this.requerimientos[i]);
    //       break;
    //   }
    // }
  }

  loadTable() {
    this._services.listarRequerimiento().subscribe((data) => {
      if (data) {
        this.reqPendientes = data;
      } else {
        this.reqPendientes = null;
        if (this.reqPendientes = null) {
          this._notification.warning("La lista de requerimientos está vacia")
        }
        // if (dataItem.msj == "USTED NO SE ENCUENTRA ASGINADO EN UN EQUIPO DE TRABAJO") {
        //   this._notification.warning(dataItem.msj)
        // } else {
        //   this._notification.error(dataItem.msj)
        // }
      }
    });
  }

}
