import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReadIndicadorTareaComponent } from './dialogs/read-indicador-tarea/read-indicador-tarea.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { NotificationService, SnackbarService } from '@core/services';
import { AddPesoComponent } from './dialogs/add-peso/add-peso.component';
import { Persona, RowsBody } from '@data/models/gestion-rendimiento/excel-model';
import { NotificacionCorreoComponent } from './dialogs/notificacion-correo/notificacion-correo.component';
import { AsignarIndicadorComponent } from './dialogs/asignar-indicador/asignar-indicador.component';
import { GrEquipoComponent } from './dialogs/gr-equipo/gr-equipo.component';
import { AsignarPrioridadComponent } from './dialogs/asignar-prioridad/asignar-prioridad.component';
import { AsignarEvidenciaComponent } from './dialogs/asignar-evidencia/asignar-evidencia.component';
import { ExcelTrabajadorService } from '@data/services/gestion-rendimiento/excel-trabajador.service';

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
    private _serviceExcelEjecutor: ExcelTrabajadorService,
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

  async registrarPrioridad() {
    const dialogRef: MatDialogRef<AsignarPrioridadComponent> = this._dialog.open(AsignarPrioridadComponent, {
      disableClose: true,
      width: '60%',
      maxHeight: '80vh',
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

  agregarIndicador(element, idVotante, i) {
    const dialogRef: MatDialogRef<AsignarIndicadorComponent> = this._dialog.open(AsignarIndicadorComponent, {
      disableClose: true,
      width: '50%',
      maxHeight: '810px',
      //height: '780px',
      autoFocus: false,
      data: {
        prioridadSelected: element,
        idVotante: idVotante,
        trabajador: i
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  agregarEvidencia(i) {
    const dialogRef: MatDialogRef<AsignarEvidenciaComponent> = this._dialog.open(AsignarEvidenciaComponent, {
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
    const dialogRef: MatDialogRef<GrEquipoComponent> = this._dialog.open(GrEquipoComponent, {
      disableClose: false,
      width: '60%',
      maxHeight: '80vh',
      autoFocus: false,
      data: {
        // esJefe: false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  async addPesoIndicador(indicador: any, listPrioridad: any) {
    const dialogRef: MatDialogRef<AddPesoComponent> = this._dialog.open(AddPesoComponent, {
      disableClose: false,
      width: '15%',
      maxHeight: '100vh',
      autoFocus: false,
      data: {
        indicadorSeleccionado: indicador,
        listPrioridad: listPrioridad
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
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
        for (let i of data) {
          if (i.listPrioridad.length > 0) {
            this.servicioExcelDirectivo(i);
          }
        }
      }
    });
  }

  async servicioExcelDirectivo(main: any) {
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

    console.log("data excel", main.listPrioridad);
    let excel = await this._serviceExcelEjecutor.exportExcelTrabajador(trabajador, jefe, main.listPrioridad);
  }

}
