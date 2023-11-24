import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, SnackbarService } from '@core/services';
import { Persona, RowsBody } from '@data/models/gestion-rendimiento/excel-model';
import { GestionRendimientoExcelEjecutorService } from '@data/services/gestion-rendimiento-excel-ejecutor.service';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
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
    public _serviceExcelEjecutor: GestionRendimientoExcelEjecutorService,
  ) { }

  ngOnInit(): void {
    this.loadTablePendiente();
  }

  async loadTablePendiente() {
    let listPendiente = await this._grService.listarIndicadorPendiente().then((data) => {
      if (data.length > 0) {
        this.listIndicadoresPendientes = data;
        console.log(this.listIndicadoresPendientes);
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

  // registrarIndicadorJefe() {
  //   const dialogRef: MatDialogRef<RegistrarIndicadorJefeComponent> = this._matDialog.open(RegistrarIndicadorJefeComponent, {
  //     disableClose: false,
  //     width: '50%',
  //     //height: '780px',
  //     autoFocus: false,
  //     data: {
  //       esJefe: true,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadTablePendiente();
  //   });
  // }

  // editarIndicadorJefe(element, es_editar) {
  //   const dialogRef: MatDialogRef<RegistrarIndicadorJefeComponent> = this._matDialog.open(RegistrarIndicadorJefeComponent, {
  //     disableClose: false,
  //     width: '600px',
  //     //height: '780px',
  //     autoFocus: false,
  //     data: {
  //       esEditar: es_editar,
  //       esJefe: false,
  //       model: element
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadTablePendiente();
  //   });
  // }

  async generarExcelTrabajador() {
    let load = await this._grService.generarExcelTrabajador().then((data: any) => {
      if (data != null) {
        console.log("service excel", data);
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
    jefe.numeroDocumento = main.evaluadorNumeroDocumento

    if (main.listPrioridad.length > 0) {
      for (let prioridad of main.listPrioridad) {
        // let rowsBody = new RowsBody();
        // rowsBody.prioridad = prioridad.prioridadNombre;

        if (prioridad.listIndicador.length > 0) {
          for (let indicador of prioridad.listIndicador) {
            // rowsBody.indicador = indicador.nombreIndicador;
            // rowsBody.valorMeta = indicador.valorMeta;
            // rowsBody.peso = indicador.peso;

            if (indicador.listEvidencia.length > 0) {
              for (let t of indicador.listEvidencia) {
                let rowsBody = new RowsBody();
                // constante
                rowsBody.prioridad = prioridad.prioridadNombre;
                rowsBody.indicador = indicador.nombreIndicador;
                rowsBody.valorMeta = indicador.valorMeta;
                rowsBody.peso = indicador.peso;

                //iterativo
                rowsBody.nombreTarea = t.descripcion;
                let fechaPlazo = t.plazo.split("T")[0];
                // rowsBody.plazo = fechaPlazo;

                const date = new Date(fechaPlazo);
                let year = date.getFullYear();
                let mes = date.toLocaleDateString("es-ES", { month: 'long' })
                rowsBody.plazo = mes + " " + year;

                //comentario
                if (t.sustentoFechaRegistro !== null) {
                  let fechaEvidencia = t.sustentoFechaRegistro.split("T")[0];
                  console.log("fechaPlazo: ", fechaPlazo, " fechaEvidencia: ", fechaEvidencia);

                  var first = new Date(fechaPlazo);
                  var second = new Date(fechaEvidencia);

                  //comparar fechas para evaluacionComentario
                  if (first < second) {
                    console.log(first, "es menor que", second);
                    rowsBody.comentario = 'Se pasó de la fecha';
                  }
                  else if (first > second) {
                    console.log(first, "es mayor que", second);
                    rowsBody.comentario = 'Presentó evidencia dentro de la fecha';
                  }
                  else if (first == second) {
                    console.log(first, "es igual que", second);
                    rowsBody.comentario = 'Presentó evidencia dentro de la fecha';
                  }
                } else {
                  console.log("La evidencia " + t.idEvidencia + " no tiene sustento");
                  //iterativo
                  let fechaPlazo = t.plazo.split("T")[0];

                  const date = new Date(fechaPlazo);
                  let year = date.getFullYear();
                  let mes = date.toLocaleDateString("es-ES", { month: 'long' })
                  rowsBody.plazo = mes + " " + year;

                  rowsBody.comentario = 'No presentó evidencia';
                }

                listRows.push(rowsBody);
                rowsBody = null;
              }
            }
          }
        }
      }
    } else {
      console.log("Prioridades vacio")
    }

    console.log("data excel", listRows);
    let columnsName = ["String_1", "String_2"];
    let reportData = {
      data_trabajador: trabajador,
      data_jefe: jefe,
      data_filas: listRows,
      headers: columnsName,
    };
    let excel = await this._serviceExcelEjecutor.exportExcelEjecutor(reportData);
  }
 
}
