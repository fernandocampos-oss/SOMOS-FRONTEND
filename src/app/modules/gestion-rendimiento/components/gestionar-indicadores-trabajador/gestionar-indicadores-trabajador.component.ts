import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService, SnackbarService } from '@core/services';
import { Persona, RowsBody } from '@data/models/gestion-rendimiento/excel-model';
import { NotificacionCorreoComponent } from './dialogs/notificacion-correo/notificacion-correo.component';
import { AsignarIndicadorComponent } from './dialogs/asignar-indicador/asignar-indicador.component';
import { GrEquipoComponent } from './dialogs/gr-equipo/gr-equipo.component';
import { AsignarPrioridadComponent } from './dialogs/asignar-prioridad/asignar-prioridad.component';
import { AsignarEvidenciaComponent } from './dialogs/asignar-evidencia/asignar-evidencia.component';
import { ExcelTrabajadorService } from '@data/services/gestion-rendimiento/excel-trabajador.service';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { VerEvidenciaImagenComponent } from '@modules/indicadores-trabajador/components/modal-tarea/ver-evidencia-imagen/ver-evidencia-imagen.component';
import { VerEvidenciaPdfComponent } from '@modules/indicadores-trabajador/components/modal-tarea/ver-evidencia-pdf/ver-evidencia-pdf.component';
import { EditMasterComponent } from './dialogs/edit-master/edit-master.component';

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
      }
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

  editarEvidencia(element) {
    const dialogRef: MatDialogRef<EditMasterComponent> = this._dialog.open(EditMasterComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  verEvidenciaImagen(element) {
    const dialogRef: MatDialogRef<VerEvidenciaImagenComponent> = this._dialog.open(VerEvidenciaImagenComponent, {
      disableClose: false,
      width: '50%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  verEvidenciaPdf(element) {
    const dialogRef: MatDialogRef<VerEvidenciaPdfComponent> = this._dialog.open(VerEvidenciaPdfComponent, {
      disableClose: false,
      width: '70%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

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
        // console.log("service excel", data);
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

    // console.log("data excel", main.listPrioridad);
    let excel = await this._serviceExcelEjecutor.exportExcelTrabajador(trabajador, jefe, main.listPrioridad);
  }

}
