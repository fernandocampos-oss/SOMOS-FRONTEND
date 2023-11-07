import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, SnackbarService } from '@core/services';
import { ExportExcelGestionRendimientoService } from '@data/services/export-excel-gestion-rendimiento.service';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { RegistrarIndicadorTrabajadorComponent } from '../components/registrar-indicador-trabajador/registrar-indicador-trabajador.component';
import { ModalTareaComponent } from '../components/modal-tarea/modal-tarea.component';
import { ReporteTarea, ReporteTrabajador } from '@data/models/gestion-rendimiento/reporte-finalizados';

@Component({
  selector: 'app-indicadores-trabajador',
  templateUrl: './indicadores-trabajador.component.html',
  styleUrls: ['./indicadores-trabajador.component.scss']
})
export class IndicadoresTrabajadorComponent implements OnInit {
  listDataFinalizados: any[] = [];
  listDataPendientes: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'indicador_producto', 'fecha_asignacion', 'tipo_ingreso', 'tipo_valor_meta', 'valor_meta', 'estado', 'acciones'];

  @ViewChild(MatSort) sort_finalizado: MatSort;
  @ViewChild(MatPaginator) paginator_finalizado: MatPaginator;
  dataSource_finalizado: MatTableDataSource<any>;
  displayedColumns_finalizado: string[] = ['item', 'indicador_producto', 'fecha_asignacion', 'tipo_ingreso', 'tipo_valor_meta', 'valor_meta', 'acciones'];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
    public _serviceExcel: ExportExcelGestionRendimientoService,
    private _snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.loadTablePendiente();
    this.loadTableFinalizado();
  }

  async actualizarIndicadoresPendientes() {
    this.listDataPendientes = [];
    let pendientes = await this.loadTablePendiente();
    this._snackbar.success("La lista ya se encuentra actualizada");
  }

  async actualizarindicadoresRechazados() {
    this.listDataFinalizados = [];
    let finalizados = await this.loadTableFinalizado();
    this._snackbar.success("La lista ya se encuentra actualizada");
  }

  registrarIndicadorTrabajador() {
    const dialogRef: MatDialogRef<RegistrarIndicadorTrabajadorComponent> = this._matDialog.open(RegistrarIndicadorTrabajadorComponent, {
      disableClose: false,
      width: '50%',
      //height: '780px',
      autoFocus: false,
      data: {
        esJefe: false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
    });
  }

  async loadTablePendiente() {
    let listPendiente = await this._requerimientoService.listarIndicadorPendiente().then((data) => {
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

  verDetalleIndicadorYtareas(element) {
    console.log(element)
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

  editarIndicador(element, es_editar) {
    const dialogRef: MatDialogRef<RegistrarIndicadorTrabajadorComponent> = this._matDialog.open(RegistrarIndicadorTrabajadorComponent, {
      disableClose: false,
      width: '600px',
      //height: '780px',
      autoFocus: false,
      data: {
        esEditar: es_editar,
        esJefe: false,
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
    });

  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  async exportToExcelGR(element) {
    console.log("element", element)
    if (element.idIndicadorUsuario > 0) {
      let reporteTrabajador = new ReporteTrabajador();
      reporteTrabajador.nombres = element.usuario.nombres;
      reporteTrabajador.apellidos = element.usuario.apellidos;
      reporteTrabajador.cargo = element.usuario.cargo;

      let listTarea: ReporteTarea[] = [];
      if (element.listTarea.length > 0) {
        for (let i of element.listTarea) {
          let fila = new ReporteTarea();
          if (i.evidenciaFechaRegistro != null) {
            fila.actividad = element.actividad.descripcion;
            fila.indicador = element.indicador.nombre;
            // fila.valorMeta = element.indicador.valorMeta;
            fila.pesoTotal = element.pesoTotal;
            fila.pesoFraccion = i.pesoFraccion;
            fila.nombre = i.nombre;

            let fechaISOPlazo = i.plazo.split("T");
            let fechaPlazo = fechaISOPlazo[0];
            fila.plazo = fechaPlazo;

            let fechaISOEvidencia = i.evidenciaFechaRegistro.split("T");
            let fechaEvidencia = fechaISOEvidencia[0];
            console.log("fechaPlazo: ", fechaPlazo, " fechaEvidencia: ", fechaEvidencia);

            var first = new Date(fechaPlazo);
            var second = new Date(fechaEvidencia);

            //comparar fechas para evaluacionComentario
            if (first < second) {
              console.log(first, "es menor que", second);
              fila.evaluacionComentario = 'Se pasó de la fecha';
            }
            else if (first > second) {
              console.log(first, "es mayor que", second);
              fila.evaluacionComentario = 'Presentó evidencia dentro de la fecha';
            }
            else if (first == second) {
              console.log(first, "es igual que", second);
              fila.evaluacionComentario = 'Presentó evidencia dentro de la fecha';
            }
            listTarea.push(fila);
            fila = null;
            // reportePersonal.estadoEntregado = "Entregado";
          } else {
            fila.actividad = element.actividad.descripcion;
            fila.indicador = element.indicador.nombre;
            // fila.valorMeta = element.indicador.valorMeta;
            fila.pesoTotal = element.pesoTotal;
            fila.pesoFraccion = i.pesoFraccion;
            fila.nombre = i.nombre;

            let fechaISOPlazo = i.plazo.split("T");
            let fechaPlazo = fechaISOPlazo[0];
            fila.plazo = fechaPlazo;

            fila.evaluacionComentario = 'Aún no presentó evidencia';
            listTarea.push(fila);
            fila = null;
          }
        }
        console.log("data lleno", listTarea)
      } else {
        for (let i of element.listTarea) {
          let fila = new ReporteTarea();
          fila.actividad = element.actividad.descripcion;
          fila.indicador = element.indicador.nombre;
          // fila.valorMeta = element.indicador.valorMeta;
          fila.pesoTotal = element.pesoTotal;
          fila.pesoFraccion = i.pesoFraccion;
          fila.nombre = i.nombre;

          let fechaISOPlazo = i.plazo.split("T");
          let fechaPlazo = fechaISOPlazo[0];
          fila.plazo = fechaPlazo;

          fila.evaluacionComentario = 'Aún no presentó evidencia';

          listTarea.push(fila);
          fila = null;
          // reportePersonal.estadoEntregado = "Entregado";
        }
        console.log("data vacio", listTarea)
      }
      let columnsName = ["String_1", "String_2"];
      let reportData = {
        data_trabajador: reporteTrabajador,
        data_evidencia: listTarea,
        headers: columnsName,
      };
      this._serviceExcel.exportExcel(reportData);
    }
  }

}
