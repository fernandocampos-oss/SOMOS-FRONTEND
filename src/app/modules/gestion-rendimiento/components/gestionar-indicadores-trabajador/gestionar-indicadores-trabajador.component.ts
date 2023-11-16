import { GestionRendimientoExcelDirectivoService } from './../../../../data/services/gestion-rendimiento-excel-directivo.service';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AsignarTareaComponent } from './dialogs/asignar-tarea/asignar-tarea.component';
import { ReadIndicadorTareaComponent } from './dialogs/read-indicador-tarea/read-indicador-tarea.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { NotificationService, SnackbarService } from '@core/services';
import { MiEquipoComponent } from '../mi-equipo/mi-equipo.component';
import { OrganizarIndicadorComponent } from './dialogs/organizar-indicador/organizar-indicador.component';
import { AddPesoComponent } from './dialogs/add-peso/add-peso.component';
import { Persona, RowsBody } from '@data/models/gestion-rendimiento/excel-model';
import { RegistrarIndicadorComponent } from './dialogs/registrar-indicador/registrar-indicador.component';

@Component({
  selector: 'gestion-rendimiento-gestionar-indicadores-trabajador',
  templateUrl: './gestionar-indicadores-trabajador.component.html',
  styleUrls: ['./gestionar-indicadores-trabajador.component.scss']
})
export class GestionarIndicadoresTrabajadorComponent implements OnInit {
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'valor_meta', 'peso', 'evidencia', 'tipo_formula', 'logro_final', 'puntuacion_meta'];
  // menuToggle = new EventEmitter<void>();
  listDataTable: any[] = [];

  constructor(
    private _dialog: MatDialog,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
    public _serviceExcelDirectivo: GestionRendimientoExcelDirectivoService
  ) { }

  ngOnInit(): void {
    this.loadTable();
  }

  async actualizar() {
    this.listDataTable = [];
    let update = await this.loadTable();
    this._snackbar.success("La lista ya se encuentra actualizada.");
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
    console.log("e", element)
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

  registrarTareas(i) {
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

  organizarIndicadores() {
    const dialogRef: MatDialogRef<OrganizarIndicadorComponent> = this._dialog.open(OrganizarIndicadorComponent, {
      disableClose: false,
      width: '50%',
      // height: '60%',
      autoFocus: false,
      data: {
        // model: element
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

  async modalAgregarIndicador() {
    const dialogRef: MatDialogRef<RegistrarIndicadorComponent> = this._dialog.open(RegistrarIndicadorComponent, {
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

  async generarExcelDirectivo() {
    let load = await this._grService.generarExcelDirectivo().then((data: any) => {
      if (data != null || data.length > 0) {
        console.log("lista prioridad", data);
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
        let rowsBody = new RowsBody();
        // rowsBody.prioridad = prioridad.prioridadNombre;

        if (prioridad.listIndicador.length > 0) {
          for (let indicador of prioridad.listIndicador) {
            // rowsBody.indicador = indicador.nombreIndicador;
            // rowsBody.valorMeta = indicador.valorMeta;
            // rowsBody.peso = indicador.peso;

            if (indicador.listTarea.length > 0) {
              for (let tarea of indicador.listTarea) {
                let rowsBody = new RowsBody();
                // constante
                rowsBody.prioridad = prioridad.prioridadNombre;
                rowsBody.indicador = indicador.nombreIndicador;
                rowsBody.valorMeta = indicador.valorMeta;
                rowsBody.peso = indicador.peso;
                console.log("1:", rowsBody.prioridad)
                console.log("2:", rowsBody.indicador)
                console.log("3:", rowsBody.valorMeta)
                //iterativo
                rowsBody.nombreTarea = tarea.nombre;
                let fechaPlazo = tarea.plazo.split("T")[0];
                rowsBody.plazo = fechaPlazo;

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

    // // let listRows: RowsBody[] = [];
    // for (let i of this.listDataPendientes) {
    //   if (i.listTarea.length > 0) {
    //     for (let t of i.listTarea) {
    //       if (t.evidenciaFechaRegistro !== null) { //evidencia registrada?
    //         let rowsBody = new RowsBody();
    //         rowsBody.actividad = i.actividad.descripcion;
    //         rowsBody.indicador = i.indicador.nombre;
    //         rowsBody.valorMeta = i.indicador.valorMeta;
    //         //iterativo
    //         rowsBody.pesoFraccion = t.pesoFraccion;
    //         rowsBody.nombre = t.nombre;
    //         let fechaPlazo = t.plazo.split("T")[0];
    //         rowsBody.plazo = fechaPlazo;

    //         let fechaEvidencia = t.evidenciaFechaRegistro.split("T")[0];
    //         console.log("fechaPlazo: ", fechaPlazo, " fechaEvidencia: ", fechaEvidencia);

    //         var first = new Date(fechaPlazo);
    //         var second = new Date(fechaEvidencia);

    //         //comparar fechas para evaluacionComentario
    //         if (first < second) {
    //           console.log(first, "es menor que", second);
    //           rowsBody.evaluacionComentario = 'Se pasó de la fecha';
    //         }
    //         else if (first > second) {
    //           console.log(first, "es mayor que", second);
    //           rowsBody.evaluacionComentario = 'Presentó evidencia dentro de la fecha';
    //         }
    //         else if (first == second) {
    //           console.log(first, "es igual que", second);
    //           rowsBody.evaluacionComentario = 'Presentó evidencia dentro de la fecha';
    //         }
    //         listRows.push(rowsBody);
    //         rowsBody = null;
    //         // reportePersonal.estadoEntregado = "Entregado";
    //       } else {
    //         console.log("La tarea " + t.idTarea + " no tiene evidencia registrada");
    //         let rowsBody = new RowsBody();
    //         rowsBody.actividad = i.actividad.descripcion;
    //         rowsBody.indicador = i.indicador.nombre;
    //         rowsBody.valorMeta = i.indicador.valorMeta;
    //         //iterativo
    //         rowsBody.pesoFraccion = t.pesoFraccion;
    //         rowsBody.nombre = t.nombre;
    //         rowsBody.plazo = t.plazo.split("T")[0];
    //         rowsBody.evaluacionComentario = 'No presentó evidencia';
    //         listRows.push(rowsBody);
    //         rowsBody = null;
    //       }
    //     }
    //   } else {
    //     console.log("El indicador no cuenta con tareas");
    //     let rowsBody = new RowsBody();
    //     if (i.actividad != null) {
    //       rowsBody.actividad = i.actividad.descripcion;
    //     } else {
    //       rowsBody.actividad = '-'
    //     }
    //     rowsBody.indicador = i.indicador.nombre;
    //     rowsBody.valorMeta = i.indicador.valorMeta;
    //     rowsBody.evaluacionComentario = 'No tiene tareas asignadas';
    //     listRows.push(rowsBody);
    //     rowsBody = null;
    //   }

    // }

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
