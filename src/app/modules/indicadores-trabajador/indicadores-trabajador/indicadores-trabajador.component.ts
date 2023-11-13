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
import { ReporteTrabajador, RowsBody } from '@data/models/gestion-rendimiento/reporte-indicador-excel';

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
  displayedColumns: string[] = ['item', 'indicador_producto', 'descripcion', 'fecha_creacion', 'tipo_ingreso', 'tipo_valor_meta', 'valor_meta', 'acciones'];

  @ViewChild(MatSort) sort_finalizado: MatSort;
  @ViewChild(MatPaginator) paginator_finalizado: MatPaginator;
  dataSource_finalizado: MatTableDataSource<any>;
  displayedColumns_finalizado: string[] = ['item', 'indicador_producto', 'descripcion', 'fecha_creacion', 'tipo_ingreso', 'tipo_valor_meta', 'valor_meta'];

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
    let listFinalizado = await this._requerimientoService.listarIndicadorFinalizado().then((data) => {
      if (data.length > 0) {
        this.listDataFinalizados = data;
        this.dataSource_finalizado = new MatTableDataSource(this.listDataFinalizados);
        this.dataSource_finalizado.paginator = this.paginator_finalizado;
        this.dataSource_finalizado.sort = this.sort_finalizado;
      }
    });
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
        // esJefe: false,
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

  async exportToExcelGR() {
    console.log("list", this.listDataPendientes)
    if (this.listDataPendientes.length > 0) {
      let reporteTrabajador = new ReporteTrabajador();
      reporteTrabajador.nombres = this.listDataPendientes[0].usuario.nombres;
      reporteTrabajador.apellidos = this.listDataPendientes[0].usuario.apellidos;
      reporteTrabajador.cargo = this.listDataPendientes[0].usuario.cargo;

      let listRows: RowsBody[] = [];
      for (let i of this.listDataPendientes) {
        if (i.listTarea.length > 0) {
          for (let t of i.listTarea) {
            if (t.evidenciaFechaRegistro !== null) { //evalua si tiene evidencia registrada o no
              let rowsBody = new RowsBody();
              rowsBody.actividad = i.actividad.descripcion;
              rowsBody.indicador = i.indicador.nombre;
              // rowsBody.pesoTotal = i.pesoTotal;
              rowsBody.valorMeta = i.indicador.valorMeta;
              //iterativo
              rowsBody.pesoFraccion = t.pesoFraccion;
              rowsBody.nombre = t.nombre;
              let fechaPlazo = t.plazo.split("T")[0];
              rowsBody.plazo = fechaPlazo;

              let fechaEvidencia = t.evidenciaFechaRegistro.split("T")[0];
              console.log("fechaPlazo: ", fechaPlazo, " fechaEvidencia: ", fechaEvidencia);

              var first = new Date(fechaPlazo);
              var second = new Date(fechaEvidencia);

              //comparar fechas para evaluacionComentario
              if (first < second) {
                console.log(first, "es menor que", second);
                rowsBody.evaluacionComentario = 'Se pasó de la fecha';
              }
              else if (first > second) {
                console.log(first, "es mayor que", second);
                rowsBody.evaluacionComentario = 'Presentó evidencia dentro de la fecha';
              }
              else if (first == second) {
                console.log(first, "es igual que", second);
                rowsBody.evaluacionComentario = 'Presentó evidencia dentro de la fecha';
              }
              listRows.push(rowsBody);
              rowsBody = null;
              // reportePersonal.estadoEntregado = "Entregado";
            } else {
              console.log("La tarea " + t.idTarea + " no tiene evidencia registrada");
              let rowsBody = new RowsBody();
              rowsBody.actividad = i.actividad.descripcion;
              rowsBody.indicador = i.indicador.nombre;
              // rowsBody.pesoTotal = i.pesoTotal;
              rowsBody.valorMeta = i.indicador.valorMeta;
              //iterativo
              rowsBody.pesoFraccion = t.pesoFraccion;
              rowsBody.nombre = t.nombre;
              rowsBody.plazo = t.plazo.split("T")[0];
              rowsBody.evaluacionComentario = 'No presentó evidencia';
              listRows.push(rowsBody);
              rowsBody = null;
            }
          }
        } else {
          console.log("El indicador no cuenta con tareas");
          let rowsBody = new RowsBody();
          if (i.actividad != null) {
            rowsBody.actividad = i.actividad.descripcion;
          } else {
            rowsBody.actividad = '-'
          }
          rowsBody.indicador = i.indicador.nombre;
          // rowsBody.pesoTotal = i.pesoTotal;
          rowsBody.valorMeta = i.indicador.valorMeta;
          rowsBody.evaluacionComentario = 'No tiene tareas asignadas';
          listRows.push(rowsBody);
          rowsBody = null;
        }

      }
      console.log("data excel", listRows);
      let columnsName = ["String_1", "String_2"];
      let reportData = {
        data_trabajador: reporteTrabajador,
        data_evidencia: listRows,
        headers: columnsName,
      };
      let listFinalizado = await this._serviceExcel.exportExcel(reportData);
    }
  }

}
