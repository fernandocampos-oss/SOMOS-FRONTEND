import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, SnackbarService } from '@core/services';
import { Persona, RowsBody } from '@data/models/gestion-rendimiento/excel-model';
import { ExcelTrabajadorService } from '@data/services/gestion-rendimiento/excel-trabajador.service';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { ModalTareaComponent } from '@modules/indicadores-trabajador/components/modal-tarea/modal-tarea.component';

@Component({
  selector: 'gestion-rendimiento-indicadores-pendientes-jefe',
  templateUrl: './indicadores-pendientes-jefe.component.html',
  styleUrls: ['./indicadores-pendientes-jefe.component.scss']
})
export class IndicadoresPendientesJefeComponent implements OnInit {
  listIndicadoresPendientes: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'valor_meta', 'peso', 'evidencia', 'plazo', 'tipo_formula', 'logro_final', 'puntuacion_meta', 'fecha_asignacion', 'acciones'];
  groupedColumns: string[] = ['grouped'];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
    private _serviceExcelEjecutor: ExcelTrabajadorService,
  ) { }

  ngOnInit(): void {
    this.loadTablePendiente();
  }

  async loadTablePendiente() {
    let listPendiente = await this._grService.listarIndicadorPendiente().then((data) => {
      if (data.length > 0) {
        this.listIndicadoresPendientes = data;
        this.dataSource = new MatTableDataSource(this.listIndicadoresPendientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  async actualizarIndicadoresPendientes() {
    this.listIndicadoresPendientes = [];
    let pendientes = await this.loadTablePendiente();
    this._snackbar.success("La lista se encuentra actualizada");
  }

  verDetalleIndicadorYEvidencias(element) {
    const dialogRef: MatDialogRef<ModalTareaComponent> = this._matDialog.open(ModalTareaComponent, {
      disableClose: false,
      width: '60%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element,
        // auto: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
    });
  }

  async generarExcelTrabajador() {
    let load = await this._grService.generarExcelTrabajador().then((data: any) => {
      if (data != null) {
        this.servicioExcelEjecutor(data);
      }
    });
  }

  async servicioExcelEjecutor(main: any) {
    let listRows: RowsBody[] = [];

    let trabajador = new Persona();
    trabajador.nombre = main.evaluadoNombreCompleto;
    trabajador.cargo = main.evaluadoPuesto;
    trabajador.segmento = main.evaluadoSegmento;
    trabajador.codUnidad = main.evaluadoCodUnidad;

    let jefe = new Persona();
    jefe.nombre = main.evaluadorNombreCompleto;
    jefe.cargo = main.evaluadorPuesto;
    jefe.segmento = main.evaluadorSegmento;
    jefe.codUnidad = main.evaluadorCodUnidad;
    jefe.numeroDocumento = main.evaluadorNumeroDocumento;

    // console.log("data excel", main.listPrioridad);
    let excel = await this._serviceExcelEjecutor.exportExcelTrabajador(trabajador, jefe, main.listPrioridad);
  }

}
