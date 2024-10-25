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
import { EditMasterComponent } from '../buscar-reporte/dialogs/edit-master/edit-master.component';
import { VerPdfSustentoComponent } from '@modules/indicadores-trabajador/components/ver-pdf-sustento/ver-pdf-sustento.component';
import { CalificarComponent } from './dialogs/calificar/calificar.component';
import { RegistrarSustentoComponent } from '@modules/indicadores-trabajador/components/registrar-sustento/registrar-sustento.component';

@Component({
  selector: 'gestion-rendimiento-gestionar-indicadores-trabajador',
  templateUrl: './gestionar-indicadores-trabajador.component.html',
  styleUrls: ['./gestionar-indicadores-trabajador.component.scss']
})
export class GestionarIndicadoresTrabajadorComponent implements OnInit {
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'evidencia', 'tipo_formula', 'comentario', 'logro_final', 'puntuacion_meta'];
  // groupedColumns: string[] = ['grouped'];
  // menuToggle = new EventEmitter<void>();

  listDataTable: any[] = [];
  condicion_1: any;
  condicion_2: any;
  porcentajeTotal: number = 0;
  idSegmento: number = 0;

  constructor(
    private _dialog: MatDialog,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
    private _serviceExcelEjecutor: ExcelTrabajadorService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadTableJefe();
    this.getSegmentoModuloGR();
  }

  async actualizar() {
    this.listDataTable = [];
    let update = await this.loadTableJefe();
    this._snackbar.success("La lista se encuentra actualizada.");
  }

  async loadTableJefe() {
    let listPrioridades = await this._grService.listarPrioridadesPrincipal().then((data) => {
      if (data.length > 0) {
        console.log("info:",data);
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
      this.loadTableJefe();
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
      this.loadTableJefe();
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
      this.loadTableJefe();
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
      this.loadTableJefe();
    });
  }

  editarPrioridad(idPrioridad: number, idActividad: number, fechaAsignacion: any, control: number, nombreActual:string) {
    const dialogRef: MatDialogRef<EditMasterComponent> = this._dialog.open(EditMasterComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: true,
      data: {
        switch: control,
        idPrioridad: idPrioridad,
        idActividad: idActividad,
        fechaAsignacion: fechaAsignacion,
        nombreActual: nombreActual
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTableJefe();
    });
  }

  editarIndicador(element: any, control: number) {
    const dialogRef: MatDialogRef<EditMasterComponent> = this._dialog.open(EditMasterComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: true,
      data: {
        switch: control,
        indicador: element,
        pesoTotal: this.porcentajeTotal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTableJefe();
    });
  }

  editarEvidencia(element: any, control: number) {
    const dialogRef: MatDialogRef<EditMasterComponent> = this._dialog.open(EditMasterComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: true,
      data: {
        switch: control,
        evidencia: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTableJefe();
    });
  }

  verEvidenciaPdf(element) {
    const dialogRef: MatDialogRef<VerPdfSustentoComponent> = this._dialog.open(VerPdfSustentoComponent, {
      disableClose: false,
      width: '80%',
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
      this.loadTableJefe();
    });
  }

  async getSegmentoModuloGR() {
    let load = await this._grService.getVotanteByIdUsuario().then((data: any) => {
      if (data) {
        this.idSegmento = data.idSegmento;
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

  abrirEditor(idVotante:number, registro:any, idInd:number, nombrePrioridad:string){
    /*console.log("Capturado:",registro);
    let indicador:any = registro.listIndicador.find((dtInd:any)=>dtInd.idIndicador == idInd);
    let indicador = {...aux};
    registro.listIndicador = [];
    console.log("Capturado:",indicador);
    registro.listIndicador.push(indicador);*/
    let info:any = {
      "idPersona":idVotante,
      "prioridad":registro,
      "idIndicador": idInd,
      "nomPrioridad":nombrePrioridad
    }
    const dialogRef: MatDialogRef<AsignarPrioridadComponent> = this._dialog.open(AsignarPrioridadComponent, {
      disableClose: true,
      width: '60%',
      maxHeight: '80vh',
      autoFocus: false,
      data: info
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTableJefe();
    });
  }

  abrirCalificar(idEvidencia:number){
    let info:any = {
      "idEvidencia":idEvidencia,
    }
    const dialogRef: MatDialogRef<CalificarComponent> = this._dialog.open(CalificarComponent, {
      disableClose: true,
      width: '60%',
      maxHeight: '80vh',
      autoFocus: false,
      data: info
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTableJefe();
    });
  }

  registrarSustento(element) {
    const dialogRef: MatDialogRef<RegistrarSustentoComponent> = this._matDialog.open(RegistrarSustentoComponent, {
      disableClose: false,
      width: '780px',
      //height: '780px',
      autoFocus: true,
      data: {
        // idIndicador: this.data.model.idIndicador,
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTableJefe();
    });
  }
}
