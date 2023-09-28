import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services';
import { ExportExcelGestionRendimientoService } from '@data/services/export-excel-gestion-rendimiento.service';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { VerTareaComponent } from '@modules/mis-requerimientos/components/ver-tarea/ver-tarea.component';

@Component({
  selector: 'app-jefe-requirement',
  templateUrl: './jefe-requirement.component.html',
  styleUrls: ['./jefe-requirement.component.scss']
})
export class JefeRequirementComponent implements OnInit {
  listEvidencia: any[] = [];
  listDataRechazados: any[] = [];
  listDataFinalizados: any[] = [];
  listDataPendientes: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'identificador', 'requerimiento', 'fecha_asignacion', 'tipo_ingreso', 'avance', 'estado', 'acciones'];

  @ViewChild(MatSort) sort_finalizado: MatSort;
  @ViewChild(MatPaginator) paginator_finalizado: MatPaginator;
  dataSource_finalizado: MatTableDataSource<any>;
  displayedColumns_finalizado: string[] = ['item', 'identificador', 'requerimiento', 'fecha_asignacion', 'tipo_ingreso', 'avance', 'acciones'];

  @ViewChild(MatSort) sort_rechazado: MatSort;
  @ViewChild(MatPaginator) paginator_rechazado: MatPaginator;
  dataSource_rechazado: MatTableDataSource<any>;
  displayedColumns_rechazado: string[] = ['item', 'identificador', 'requerimiento', 'fecha_asignacion', 'tipo_ingreso', 'motivo'];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
    public _serviceExcel: ExportExcelGestionRendimientoService,
  ) { }

  ngOnInit(): void {
    this.loadTablePendiente();
    this.loadTableFinalizado();
    this.loadTableRechazado();
  }

  async loadTablePendiente() {
    let listPendiente = await this._requerimientoService.listarRequerimientoPendiente().then((data) => {
      if (data.length > 0) {
        this.listDataPendientes = data;
        this.dataSource = new MatTableDataSource(this.listDataPendientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  async loadTableFinalizado() {
    let listFinalizado = await this._requerimientoService.listarRequerimientoFinalizado().then((data) => {
      if (data.length > 0) {
        this.listDataFinalizados = data;
        this.dataSource_finalizado = new MatTableDataSource(this.listDataFinalizados);
        this.dataSource_finalizado.paginator = this.paginator_finalizado;
        this.dataSource_finalizado.sort = this.sort_finalizado;
      }
    });
  }

  async loadTableRechazado() {
    let listRechazado = await this._requerimientoService.listarRequerimientoRechazado().then((data) => {
      if (data.length > 0) {
        this.listDataRechazados = data;
        this.dataSource_rechazado = new MatTableDataSource(this.listDataRechazados);
        this.dataSource_rechazado.paginator = this.paginator_rechazado;
        this.dataSource_rechazado.sort = this.sort_rechazado;
      }
    });
  }

  verDetalleRequerimiento(element) {
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
