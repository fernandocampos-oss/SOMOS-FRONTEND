import { GestionRendimientoExcelDirectivoService } from './../../../../data/services/gestion-rendimiento-excel-directivo.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AsignarTareaComponent } from './dialogs/asignar-tarea/asignar-tarea.component';
import { ReadIndicadorTareaComponent } from './dialogs/read-indicador-tarea/read-indicador-tarea.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { NotificationService, SnackbarService } from '@core/services';
import { MiEquipoComponent } from '../mi-equipo/mi-equipo.component';
import { AddPesoComponent } from './dialogs/add-peso/add-peso.component';
import { Persona, RowsBody } from '@data/models/gestion-rendimiento/excel-model';
import { RegistrarPrioridadComponent } from './dialogs/registrar-prioridad/registrar-prioridad.component';
import { NotificacionCorreoComponent } from './dialogs/notificacion-correo/notificacion-correo.component';
import { AsignarIndicadorComponent } from './dialogs/asignar-indicador/asignar-indicador.component';

@Component({
  selector: 'gestion-rendimiento-gestionar-indicadores-trabajador',
  templateUrl: './gestionar-indicadores-trabajador.component.html',
  styleUrls: ['./gestionar-indicadores-trabajador.component.scss']
})
export class GestionarIndicadoresTrabajadorComponent implements OnInit {
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'valor_meta', 'peso', 'evidencia', 'plazo', 'tipo_formula', 'comentario', 'logro_final', 'puntuacion_meta'];
  groupedColumns: string[] = ['grouped'];
  // menuToggle = new EventEmitter<void>();
  listDataTable: any[] = [];
  condicion_1: any;
  condicion_2: any;

  constructor(
    private _dialog: MatDialog,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
    public _serviceExcelDirectivo: GestionRendimientoExcelDirectivoService
  ) { }

  ngOnInit(): void {
    this.loadTable();

    this.getSegmentoModuloGR();
  }

  async actualizar() {
    this.listDataTable = [];
    let update = await this.loadTable();
    this._snackbar.success("La lista se encuentra actualizada.");
  }

  async loadTable() {
    let listPrioridades = await this._grService.listarPrioridadesPrincipal().then((data) => {
      if (data.length > 0) {
        this.listDataTable = data;
        console.log("onTable", this.listDataTable)
      }
    });
  }

  verIndicadorYtarea(element) {
    // console.log(element)
    const dialogRef: MatDialogRef<ReadIndicadorTareaComponent> = this._dialog.open(ReadIndicadorTareaComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: false,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTable();
    });
  }

  agregarIndicador(element, idVotante) {
    const dialogRef: MatDialogRef<AsignarIndicadorComponent> = this._dialog.open(AsignarIndicadorComponent, {
      disableClose: true,
      width: '50%',
      maxHeight: '810px',
      //height: '780px',
      autoFocus: false,
      data: {
        element: element,
        idVotante: idVotante
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  agregarEvidencia(i) {
    const dialogRef: MatDialogRef<AsignarTareaComponent> = this._dialog.open(AsignarTareaComponent, {
      disableClose: true,
      width: '50%',
      maxHeight: '810px',
      //height: '780px',
      autoFocus: false,
      data: {
        element: i
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });

  }

  modalMiEquipo() {
    const dialogRef: MatDialogRef<MiEquipoComponent> = this._dialog.open(MiEquipoComponent, {
      disableClose: false,
      width: '60%',
      maxHeight: '80vh',
      autoFocus: false,
      data: {
        // esJefe: false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  async addPesoIndicador(element) {
    const dialogRef: MatDialogRef<AddPesoComponent> = this._dialog.open(AddPesoComponent, {
      disableClose: false,
      width: '15%',
      maxHeight: '100vh',
      autoFocus: false,
      data: {
        modal: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  async registrarPrioridad() {
    const dialogRef: MatDialogRef<RegistrarPrioridadComponent> = this._dialog.open(RegistrarPrioridadComponent, {
      disableClose: false,
      width: '60%',
      // maxHeight: '80vh',
      autoFocus: false,
      data: {
        // modal: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
    // this.loadTable();
  }

  // editarIndicador(element, es_editar) {
  //   const dialogRef: MatDialogRef<RegistrarIndicadorTrabajadorComponent> = this._matDialog.open(RegistrarIndicadorTrabajadorComponent, {
  //     disableClose: false,
  //     width: '600px',
  //     //height: '780px',
  //     autoFocus: false,
  //     data: {
  //       esEditar: es_editar,
  //       // esJefe: false,
  //       model: element
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadTablePendiente();
  //   });
  // }

  async notificarCorreo(email: string) {
    const dialogRef: MatDialogRef<NotificacionCorreoComponent> = this._dialog.open(NotificacionCorreoComponent, {
      disableClose: false,
      width: '35%',
      maxHeight: '80vh',
      autoFocus: false,
      data: {
        correo: email
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  async getSegmentoModuloGR() {
    let load = await this._grService.getVotanteByIdUsuario().then((data: any) => {
      if (data) {
        if (data.codCondicion != null) {
          let string = data.codCondicion;
          let parts = string.split(",");
          this.condicion_1 = parts[0];
          this.condicion_2 = parts[1];
        }
      }
    });
  }

  async generarExcelDirectivo() {
    let load = await this._grService.generarExcelDirectivo().then((data: any) => {
      if (data != null || data.length > 0) {
        console.log("service excel", data);
        for (let main of data) {
          this.servicioExcelDirectivo(main);
        }
      }
    });
  }

  async servicioExcelDirectivo(main: any) {
    console.log("main", main)
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

            if (indicador.listTarea.length > 0) {
              for (let t of indicador.listTarea) {
                let rowsBody = new RowsBody();
                // constante
                rowsBody.prioridad = prioridad.prioridadNombre;
                rowsBody.indicador = indicador.nombreIndicador;
                rowsBody.valorMeta = indicador.valorMeta;
                rowsBody.peso = indicador.peso;

                //iterativo
                rowsBody.nombreTarea = t.nombre;
                let fechaPlazo = t.plazo.split("T")[0];
                // rowsBody.plazo = fechaPlazo;

                const date = new Date(fechaPlazo);
                let year = date.getFullYear();
                let mes = date.toLocaleDateString("es-ES", { month: 'long' })
                rowsBody.plazo = mes + " " + year;

                //comentario
                if (t.evidenciaFechaRegistro !== null) {
                  let fechaEvidencia = t.evidenciaFechaRegistro.split("T")[0];
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
                  console.log("La evidencia " + t.idEvidencia + " no cuenta con sustento");
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
    let excel = await this._serviceExcelDirectivo.exportExcelDirectivo(reportData);
  }

}
