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
import { da } from 'date-fns/locale';

@Component({
  selector: 'gestion-rendimiento-gestionar-indicadores-trabajador',
  templateUrl: './gestionar-indicadores-trabajador.component.html',
  styleUrls: ['./gestionar-indicadores-trabajador.component.scss']
})
export class GestionarIndicadoresTrabajadorComponent implements OnInit {
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'sentido_indicador', 'valor_esperado', 'peso', 'evidencia', 'plazos', 'comentario', 'valor_alcanzado', 'puntuacion_meta'];
  columnsRow4: string[] = ['indicador_producto', 'sentido_indicador', 'valor_esperado', 'peso', 'evidencia', 'plazos', 'comentario'];
  // groupedColumns: string[] = ['grouped'];
  // menuToggle = new EventEmitter<void>();

  listDataTable: any[] = [];
  condicion_1: any;
  condicion_2: any;
  porcentajeTotal: number = 0;
  idSegmento: number = 0;
  flagEvaluador: boolean = true;

  // Opciones para el selector personalizado
  comentarioOptions = [
    { value: '', label: '[Seleccione]' },
    { value: 'logrado', label: 'Logrado' },
    { value: 'proceso', label: 'En proceso' },
    { value: 'no_presento', label: 'No presentó' }
  ];

  comentarioFinalOptions = [
    { value: '', label: '[Seleccione]' },
    { value: 'si_presenta', label: 'SÍ presenta' },
    { value: 'no_presenta', label: 'NO presenta' }
  ];

  // Valores seleccionados para cada tipo de comentario
  comentarioSinEvidencias: string = '';
  comentarioIndividuales: string = '';
  comentarioFinal: string = '';

  // Métodos para manejar cambios de selección específicos por evidencia
  onComentarioChange(tipo: string, valor: string, indicador?: any, evidencia?: any, index?: number): void {
    console.log(`Comentario ${tipo} changed to:`, valor || '[Seleccione]');
    console.log('Indicador:', indicador);
    console.log('Evidencia:', evidencia);
    console.log('Index:', index);
    
    switch(tipo) {
      case 'sinEvidencias':
        if (indicador) {
          indicador.comentarioSinEvidencias = valor || '';
        }
        break;
      case 'individuales':
        if (evidencia) {
          evidencia.comentario = valor || '';
        }
        break;
      case 'final':
        if (indicador) {
          indicador.comentarioFinal = valor || '';
        }
        break;
    }
    
    console.log('Valor actualizado para:', tipo, valor || '[Sin selección]');
  }

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
    let listPrioridades = await this._grService.listarPrioridadesPrincipal().then(async (data) => {
      if (data.length > 0) {
        console.log("info:",data);
        this.listDataTable = data;
        
        // Inicializar propiedades de comentario para cada elemento
        this.listDataTable.forEach(element => {
          if (element.listIndicador) {
            element.listIndicador.forEach(indicador => {
              // Inicializar comentarios del indicador
              if (!indicador.hasOwnProperty('comentarioSinEvidencias')) {
                indicador.comentarioSinEvidencias = '';
              }
              if (!indicador.hasOwnProperty('comentarioFinal')) {
                indicador.comentarioFinal = '';
              }
              
              // Inicializar valor alcanzado
              if (!indicador.hasOwnProperty('valorAlcanzado')) {
                indicador.valorAlcanzado = 0;
              }
              if (!indicador.hasOwnProperty('editingValorAlcanzado')) {
                indicador.editingValorAlcanzado = false;
              }
              
              // Inicializar comentarios de cada evidencia
              if (indicador.listEvidencia) {
                indicador.listEvidencia.forEach(evidencia => {
                  if (!evidencia.hasOwnProperty('comentario')) {
                    evidencia.comentario = '';
                  }
                });
              }
            });
          }
        });

        // Cargar sentidos de indicadores desde BD local DESPUÉS de tener los datos
        await this.cargarSentidosIndicadores();
      }
    });
  }

  async cargarSentidosIndicadores() {
    console.log('=== INICIO cargarSentidosIndicadores ===');
    console.log('listDataTable completo:', this.listDataTable);
    try {
      // Recolectar todos los IDs de indicadores (recorriendo la estructura anidada correctamente)
      const idsIndicadores: number[] = [];
      this.listDataTable.forEach(trabajador => {
        console.log('Trabajador:', trabajador);
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          console.log('  -> listPrioridad:', trabajador.listPrioridad);
          trabajador.listPrioridad.forEach(prioridad => {
            console.log('    -> Prioridad:', prioridad);
            if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
              console.log('      -> listIndicador:', prioridad.listIndicador);
              prioridad.listIndicador.forEach(indicador => {
                console.log('        -> Indicador completo:', indicador);
                console.log('        -> indicador.idIndicador:', indicador.idIndicador);
                if (indicador.idIndicador) {
                  idsIndicadores.push(indicador.idIndicador);
                }
              });
            }
          });
        }
      });

      console.log('IDs de indicadores encontrados:', idsIndicadores);

      if (idsIndicadores.length === 0) {
        console.log('No hay indicadores para cargar sentidos');
        return;
      }

      // Obtener sentidos en batch desde la BD local
      console.log('Llamando a obtenerSentidosMultiples...');
      const sentidosMap = await this._grService.obtenerSentidosMultiples(idsIndicadores);
      console.log('Respuesta recibida:', sentidosMap);
      console.log('Tipo de respuesta:', typeof sentidosMap, Array.isArray(sentidosMap));
      
      // Asignar sentidos a cada indicador (recorriendo la estructura anidada correctamente)
      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
            if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
              prioridad.listIndicador.forEach(indicador => {
                console.log(`Procesando indicador ID: ${indicador.idIndicador}`);
                if (indicador.idIndicador && sentidosMap[indicador.idIndicador]) {
                  indicador.sentido = sentidosMap[indicador.idIndicador];
                  console.log(`  -> Sentido asignado desde BD local: ${indicador.sentido}`);
                } else {
                  // No asignar valor si no existe en BD local (quedará undefined)
                  indicador.sentido = null;
                  console.log(`  -> Sin sentido en BD local (quedará como "Sin definir")`);
                }
              });
            }
          });
        }
      });

      console.log('Sentidos cargados exitosamente');
      console.log('Estado final de listDataTable:', this.listDataTable);
    } catch (error) {
      console.error('❌ Error cargando sentidos:', error);
      // Asignar valor por defecto en caso de error (recorriendo la estructura anidada correctamente)
      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
            if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
              prioridad.listIndicador.forEach(indicador => {
                // No asignar valor por defecto en caso de error
                // Dejar que quede null para que se muestre "Sin definir"
                if (!indicador.sentido) {
                  indicador.sentido = null;
                }
              });
            }
          });
        }
      });
    }
    console.log('=== FIN cargarSentidosIndicadores ===');
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
        if (data.idSegmento === 1){
          this.verificaEvaluador();
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
  async verificaEvaluador(){
      let load = await this._grService.verificaEvaluador().then((data: any) => {
        this.flagEvaluador = data
      });
  }

  // Métodos para edición del valor alcanzado
  editValorAlcanzado(indicador: any): void {
    // Guardar el valor original en caso de cancelar
    indicador.originalValorAlcanzado = indicador.valorAlcanzado;
    indicador.editingValorAlcanzado = true;
  }

  onValorAlcanzadoInput(event: any, indicador: any): void {
    const inputValue = event.target.value;
    
    // Validar que solo sea un número positivo
    if (inputValue !== '' && (isNaN(inputValue) || parseFloat(inputValue) <= 0)) {
      // Si no es válido, restaurar el valor anterior
      event.target.value = indicador.valorAlcanzado || 0;
      return;
    }
    
    // Si es válido, actualizar temporalmente
    indicador.valorAlcanzado = inputValue === '' ? 0 : parseFloat(inputValue);
  }

  saveValorAlcanzado(indicador: any): void {
    // Validar una vez más antes de guardar
    if (indicador.valorAlcanzado === undefined || indicador.valorAlcanzado === null || 
        isNaN(indicador.valorAlcanzado) || indicador.valorAlcanzado <= 0) {
      // Si no es válido, usar 0 como valor por defecto
      indicador.valorAlcanzado = 0;
    }
    
    // Salir del modo edición
    indicador.editingValorAlcanzado = false;
    delete indicador.originalValorAlcanzado;
    
    // Aquí puedes agregar lógica para guardar en el backend
    console.log('Valor alcanzado actualizado:', indicador.valorAlcanzado);
  }

  cancelEditValorAlcanzado(indicador: any): void {
    // Restaurar el valor original
    indicador.valorAlcanzado = indicador.originalValorAlcanzado;
    indicador.editingValorAlcanzado = false;
    delete indicador.originalValorAlcanzado;
  }
}
