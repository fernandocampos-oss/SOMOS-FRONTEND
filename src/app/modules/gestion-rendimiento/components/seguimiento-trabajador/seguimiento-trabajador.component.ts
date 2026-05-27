import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { PdfTrabajadorService } from '@data/services/gestion-rendimiento/pdf-trabajador.service';
import { NotificationService, SnackbarService } from '@core/services';
import { VerPdfSustentoComponent } from '@modules/indicadores-trabajador/components/ver-pdf-sustento/ver-pdf-sustento.component';
import { ComentarioDialogComponent } from '../gestionar-indicadores-trabajador/dialogs/comentario-dialog/comentario-dialog.component';
import { RegistrarFormatoComponent } from '../gestionar-indicadores-trabajador/dialogs/registrar-formato/registrar-formato.component';
import { FechaPlazoDialogComponent } from '../gestionar-indicadores-trabajador/dialogs/fecha-plazo-dialog/fecha-plazo-dialog.component';
import { NotificationDialogComponent } from '@shared/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-seguimiento-trabajador',
  templateUrl: './seguimiento-trabajador.component.html',
  styleUrls: ['./seguimiento-trabajador.component.scss']
})
export class SeguimientoTrabajadorComponent implements OnInit {

  // Búsqueda
  dniBusqueda: string = '';
  buscando: boolean = false;

  // Datos del trabajador encontrado
  trabajadorEncontrado: any = null;
  reunionMetas: any = null;
  formatoGdr: any = null;
  evaluador: any = null;
  resultadosFinales: any = null;

  // Multi-evaluador
  todasLasReuniones: any[] = [];
  evaluadoresList: any[] = [];
  reunionSeleccionadaId: number | null = null;

  // DNI del Maestro GDR actual
  dniMaestroGdr: string = '';
  esMaestroGdr: boolean = false;
  periodoActual: string = new Date().getFullYear().toString();

  // Columnas para la tabla de indicadores (tabla completa)
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'sentido_indicador', 'valor_esperado', 'peso', 'evidencia', 'plazos', 'comentario', 'valor_alcanzado', 'puntuacion_meta'];
  columnsRow4: string[] = ['indicador_producto', 'sentido_indicador', 'valor_esperado', 'peso', 'evidencia', 'plazos', 'comentario'];

  constructor(
    private _grService: GestionRendimientoService,
    private _pdfService: PdfTrabajadorService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerDniMaestroGdr();
  }

  async obtenerDniMaestroGdr() {
    try {
      const response = await this._grService.esMaestroGdr();
      this.esMaestroGdr = response?.esMaestroGdr ?? response?.esMaestro ?? false;
      if (response && this.esMaestroGdr) {
        this.dniMaestroGdr = response.dni || '';
      }
    } catch (error) {
      console.error('Error obteniendo DNI Maestro GDR:', error);
    }
  }

  async buscarTrabajador() {
    if (!this.dniBusqueda || this.dniBusqueda.length < 8) {
      this._notification.warning('Ingrese un DNI válido (8 dígitos)');
      return;
    }

    this.buscando = true;
    this.trabajadorEncontrado = null;
    this.reunionMetas = null;
    this.formatoGdr = null;
    this.evaluador = null;
    this.todasLasReuniones = [];
    this.evaluadoresList = [];
    this.reunionSeleccionadaId = null;

    try {
      // Buscar trabajador por DNI usando el nuevo endpoint específico
      const trabajador = await this._grService.findVotanteByDni(this.dniBusqueda);
      
      if (!trabajador) {
        this._notification.warning('No se encontró ningún trabajador con ese DNI');
        this.buscando = false;
        return;
      }

      this.trabajadorEncontrado = trabajador;

      // Buscar el segmento del trabajador desde tabla segmento_gdr
      await this.cargarSegmentoTrabajador();

      // Buscar la reunión de establecimiento de metas
      await this.cargarReunionMetas();

      // Cargar todos los evaluadores (soporta multi-evaluador/rotación)
      await this.cargarTodosLosEvaluadores();

      // Cargar formato GDR del trabajador
      await this.cargarFormatoGdr();

      // Cargar resultados finales
      await this.cargarResultadosFinales();

      this._snackbar.success('Trabajador encontrado');
    } catch (error) {
      console.error('Error buscando trabajador:', error);
      this._notification.error('Error al buscar el trabajador');
    } finally {
      this.buscando = false;
    }
  }

  async cargarSegmentoTrabajador() {
    if (!this.trabajadorEncontrado || !this.dniBusqueda) return;

    try {
      // Buscar segmento del trabajador desde tabla segmento_gdr
      const segmentos = await this._grService.buscarSegmentosGdr(this.dniBusqueda);
      if (segmentos && segmentos.length > 0) {
        this.trabajadorEncontrado.segmento = segmentos[0].segmento;
      } else {
        this.trabajadorEncontrado.segmento = '';
      }
    } catch (error) {
      console.log('No se encontró segmento del trabajador:', error);
      this.trabajadorEncontrado.segmento = '';
    }
  }

  async cargarReunionMetas() {
    if (!this.trabajadorEncontrado) return;

    try {
      // Buscar reuniones de metas para este trabajador usando el nuevo endpoint
      const reuniones = await this._grService.buscarReunionesMetasPorEvaluado(
        this.trabajadorEncontrado.idVotante,
        this.periodoActual
      );
      
      // Preferir la confirmada; si ninguna está confirmada, tomar la primera.
      if (reuniones && reuniones.length > 0) {
        this.todasLasReuniones = reuniones;
        this.reunionMetas = reuniones.find((r: any) => r.confirmado) || reuniones[0];
        this.reunionSeleccionadaId = this.reunionMetas.idVotanteEvaluador;
      } else {
        this.todasLasReuniones = [];
        this.reunionMetas = null;
        this.reunionSeleccionadaId = null;
      }
    } catch (error) {
      // Si no existe, puede ser normal
      console.log('No se encontró reunión de metas:', error);
      this.todasLasReuniones = [];
      this.reunionMetas = null;
      this.reunionSeleccionadaId = null;
    }
  }

  async cargarFormatoGdr() {
    if (!this.trabajadorEncontrado) return;

    try {
      // Usar el endpoint existente para obtener los indicadores del trabajador
      const resultado = await this._grService.listPendientesTrabajadorByVotanteAdmin(
        this.trabajadorEncontrado.idVotante
      );
      
      this.formatoGdr = resultado;
      
      // Asignar evidenciaFinal a cada indicador buscando por descripcion 'SUSTENTO FINAL'
      if (this.formatoGdr && this.formatoGdr.length > 0) {
        this.formatoGdr.forEach(prioridad => {
          if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
            prioridad.listIndicador.forEach(indicador => {
              if (indicador.listEvidencia && indicador.listEvidencia.length > 0) {
                indicador.evidenciaFinal = indicador.listEvidencia.find(
                  (ev: any) => this.esEvidenciaFinal(ev)
                );
              }
              if (!indicador.hasOwnProperty('comentarioFinal')) {
                indicador.comentarioFinal = '';
              }
              if (!indicador.hasOwnProperty('valorAlcanzado')) {
                indicador.valorAlcanzado = 0;
              }
              if (!indicador.hasOwnProperty('editingValorAlcanzado')) {
                indicador.editingValorAlcanzado = false;
              }
            });
          }
        });
      }
      
      // Cargar datos adicionales desde tablas separadas
      console.log('[DEBUG] formatoGdr cargado:', this.formatoGdr);
      if (this.formatoGdr && this.formatoGdr.length > 0) {
        await this.cargarSentidosIndicadores();
        await this.cargarFechasPlazo();
        await this.cargarValoresAlcanzados();
        await this.cargarComentariosEvidencias();
        console.log('[DEBUG] Datos adicionales cargados, formatoGdr final:', this.formatoGdr);
      }
    } catch (error) {
      console.error('Error cargando formato GDR:', error);
      this.formatoGdr = null;
    }
  }

  // Cargar sentidos de indicadores desde BD local
  async cargarSentidosIndicadores() {
    try {
      const idsIndicadores: number[] = [];
      this.formatoGdr.forEach(prioridad => {
        if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
          prioridad.listIndicador.forEach(indicador => {
            if (indicador.idIndicador) {
              idsIndicadores.push(indicador.idIndicador);
            }
          });
        }
      });

      console.log('[DEBUG] IDs indicadores para sentidos:', idsIndicadores);
      if (idsIndicadores.length === 0) return;

      const sentidosMap = await this._grService.obtenerSentidosMultiples(idsIndicadores);
      console.log('[DEBUG] Sentidos obtenidos:', sentidosMap);

      this.formatoGdr.forEach(prioridad => {
        if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
          prioridad.listIndicador.forEach(indicador => {
            if (indicador.idIndicador && sentidosMap[indicador.idIndicador]) {
              indicador.sentido = sentidosMap[indicador.idIndicador];
            } else {
              indicador.sentido = null;
            }
          });
        }
      });
    } catch (error) {
      console.error('Error cargando sentidos:', error);
    }
  }

  // Cargar fechas de plazo final desde BD local
  async cargarFechasPlazo() {
    try {
      const idsIndicadores: number[] = [];
      this.formatoGdr.forEach(prioridad => {
        if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
          prioridad.listIndicador.forEach(indicador => {
            if (indicador.idIndicador) {
              idsIndicadores.push(indicador.idIndicador);
            }
          });
        }
      });

      console.log('[DEBUG] IDs indicadores para fechas plazo:', idsIndicadores);
      if (idsIndicadores.length === 0) return;

      const fechasMap = await this._grService.obtenerFechasPlazoFinalPorIndicadores(idsIndicadores);
      console.log('[DEBUG] Fechas plazo obtenidas:', fechasMap);

      this.formatoGdr.forEach(prioridad => {
        if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
          prioridad.listIndicador.forEach(indicador => {
            if (indicador.idIndicador && fechasMap[indicador.idIndicador]) {
              const fechaPlazo = fechasMap[indicador.idIndicador];
              indicador.fechaPlazoFinal = fechaPlazo;
              
              if (indicador.listEvidencia && indicador.listEvidencia.length > 0) {
                // Buscar la evidencia final de forma robusta
                const evidenciaFinal = this.getEvidenciaFinal(indicador);
                if (evidenciaFinal) {
                  evidenciaFinal.fechaPlazoFinal = fechaPlazo;
                }
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Error cargando fechas de plazo:', error);
    }
  }

  // Cargar valores alcanzados desde BD local
  async cargarValoresAlcanzados() {
    try {
      const idsPrioridades: number[] = [];
      this.formatoGdr.forEach(prioridad => {
        if (prioridad.idPrioridad) {
          idsPrioridades.push(prioridad.idPrioridad);
        }
      });

      console.log('[DEBUG] IDs prioridades para valores:', idsPrioridades);
      if (idsPrioridades.length === 0) return;

      const valoresMap = await this._grService.obtenerValoresAlcanzadosMultiples(idsPrioridades);
      console.log('[DEBUG] Valores alcanzados obtenidos:', valoresMap);

      this.formatoGdr.forEach(prioridad => {
        if (prioridad.idPrioridad && valoresMap[prioridad.idPrioridad] !== undefined) {
          const valorAlcanzado = valoresMap[prioridad.idPrioridad];
          console.log(`[DEBUG] Asignando valor ${valorAlcanzado} a prioridad ${prioridad.idPrioridad}`);
          
          if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
            prioridad.listIndicador.forEach(indicador => {
              indicador.valorAlcanzado = valorAlcanzado;
            });
          }
        }
      });
    } catch (error) {
      console.error('Error cargando valores alcanzados:', error);
    }
  }

  // Cargar comentarios de evidencias desde BD local
  async cargarComentariosEvidencias() {
    try {
      const idsEvidencias: number[] = [];
      this.formatoGdr.forEach(prioridad => {
        if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
          prioridad.listIndicador.forEach(indicador => {
            if (indicador.listEvidencia && indicador.listEvidencia.length > 0) {
              indicador.listEvidencia.forEach(evidencia => {
                if (evidencia.idEvidencia) {
                  idsEvidencias.push(evidencia.idEvidencia);
                }
              });
            }
          });
        }
      });

      if (idsEvidencias.length === 0) return;

      const comentariosMap = await this._grService.obtenerComentariosEstadoMultiples(idsEvidencias);

      this.formatoGdr.forEach(prioridad => {
        if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
          prioridad.listIndicador.forEach(indicador => {
            if (indicador.listEvidencia && indicador.listEvidencia.length > 0) {
              indicador.listEvidencia.forEach((evidencia, index) => {
                if (evidencia.idEvidencia) {
                  const claveIndividual = evidencia.idEvidencia + '_individual';
                  if (comentariosMap[claveIndividual]) {
                    const comentarioData = comentariosMap[claveIndividual];
                    evidencia.comentario = comentarioData.estadoDropdown || '';
                    evidencia.comentarioAdicional = comentarioData.comentarioAdicional || '';
                  }
                  
                  if (index === indicador.listEvidencia.length - 1) {
                    const claveFinal = evidencia.idEvidencia + '_final';
                    if (comentariosMap[claveFinal]) {
                      const comentarioFinalData = comentariosMap[claveFinal];
                      indicador.comentarioFinal = comentarioFinalData.estadoDropdown || '';
                    }
                  }
                }
              });
            }
          });
        }
      });
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    }
  }

  async cargarTodosLosEvaluadores() {
    if (!this.todasLasReuniones || this.todasLasReuniones.length === 0) {
      this.evaluadoresList = [];
      this.evaluador = null;
      return;
    }
    try {
      this.evaluadoresList = await Promise.all(
        this.todasLasReuniones.map((r: any) => this._grService.findVotanteById(r.idVotanteEvaluador))
      );
      // Sincronizar evaluador con la reunión actualmente seleccionada
      const idx = this.todasLasReuniones.findIndex(
        (r: any) => r.idVotanteEvaluador === this.reunionSeleccionadaId
      );
      this.evaluador = idx >= 0 ? this.evaluadoresList[idx] : this.evaluadoresList[0];
    } catch (error) {
      console.error('Error cargando evaluadores:', error);
      this.evaluadoresList = [];
      this.evaluador = null;
    }
  }

  seleccionarEvaluador(idVotanteEvaluador: number) {
    const idx = this.todasLasReuniones.findIndex(
      (r: any) => r.idVotanteEvaluador === idVotanteEvaluador
    );
    if (idx >= 0) {
      this.reunionMetas = this.todasLasReuniones[idx];
      this.evaluador = this.evaluadoresList[idx];
      this.reunionSeleccionadaId = idVotanteEvaluador;
    }
  }

  async reiniciarConfirmacionReunion() {
    if (!this.reunionMetas || !this.reunionMetas.idReunion) {
      this._notification.warning('No hay reunión para reiniciar');
      return;
    }

    if (!this.reunionMetas.confirmado) {
      this._notification.warning('La reunión aún no ha sido confirmada');
      return;
    }

    try {
      await this._grService.reiniciarConfirmacionReunion(
        this.reunionMetas.idReunion,
        this.dniMaestroGdr
      );
      // Recargar datos frescos del servidor para reflejar el nuevo estado
      await this.cargarReunionMetas();
      await this.cargarTodosLosEvaluadores();
      this._notification.success('Confirmación reiniciada exitosamente');
    } catch (error: any) {
      this._notification.error(error?.error?.error || 'Error al reiniciar confirmación');
    }
  }

  abrirRegistrarFormato() {
    if (!this.esMaestroGdr) {
      this._notification.warning('Solo Maestro GDR puede registrar formato desde esta vista');
      return;
    }

    if (!this.trabajadorEncontrado || !this.trabajadorEncontrado.idVotante) {
      this._notification.warning('Primero busque un trabajador');
      return;
    }

    const idVotanteEvaluador = this.reunionMetas?.idVotanteEvaluador || this.reunionSeleccionadaId;
    if (!idVotanteEvaluador) {
      this._notification.warning('Seleccione un evaluador válido para registrar el formato');
      return;
    }

    const dialogRef = this._dialog.open(RegistrarFormatoComponent, {
      disableClose: true,
      width: '600px',
      maxHeight: '80vh',
      autoFocus: false,
      data: {
        trabajador: this.trabajadorEncontrado,
        idVotante: this.trabajadorEncontrado.idVotante,
        idVotanteEvaluador: idVotanteEvaluador,
        nombreCompleto: `${this.trabajadorEncontrado.apellidos || ''}, ${this.trabajadorEncontrado.nombres || ''}`.trim(),
        periodo: this.periodoActual
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.confirmado) {
        await this.cargarReunionMetas();
        await this.cargarTodosLosEvaluadores();
        this._notification.success('Formato registrado correctamente');
      }
    });
  }

  limpiarBusqueda() {
    this.dniBusqueda = '';
    this.trabajadorEncontrado = null;
    this.reunionMetas = null;
    this.formatoGdr = null;
    this.evaluador = null;
    this.resultadosFinales = null;
    this.todasLasReuniones = [];
    this.evaluadoresList = [];
    this.reunionSeleccionadaId = null;
  }

  async generarPdf() {
    if (!this.trabajadorEncontrado) return;
    const trabajador = {
      numeroDocumento: this.trabajadorEncontrado.numeroDocumento,
      nombre: `${this.trabajadorEncontrado.apellidos || ''} ${this.trabajadorEncontrado.nombres || ''}`.trim(),
      cargo: '-',
      segmento: this.trabajadorEncontrado.segmento || '-',
      codUnidad: '-'
    };
    const jefe = {
      numeroDocumento: this.evaluador?.numeroDocumento || '-',
      nombre: `${this.evaluador?.apellidos || ''} ${this.evaluador?.nombres || ''}`.trim() || '-',
      cargo: '-',
      segmento: '-',
      codUnidad: '-'
    };
    const reunionData = {
      asistio: this.reunionMetas?.asistio || '-',
      fecha: this.reunionMetas?.fechaReunion || '-'
    };
    try {
      await this._pdfService.exportPdfTrabajador(
        trabajador,
        jefe,
        this.formatoGdr || [],
        reunionData,
        this.resultadosFinales
      );
    } catch (error) {
      console.error('Error generando PDF:', error);
      this._notification.error('Error al generar el PDF');
    }
  }

  getAsistenciaTexto(asistio: string): string {
    switch (asistio) {
      case 'S': return 'Sí asistió';
      case 'N': return 'No asistió';
      default: return 'Sin seleccionar';
    }
  }

  getAsistenciaColor(asistio: string): string {
    switch (asistio) {
      case 'S': return '#4caf50';
      case 'N': return '#f44336';
      default: return '#9e9e9e';
    }
  }

  // Método para ver PDF de evidencia
  verEvidenciaPdf(element: any) {
    const dialogRef: MatDialogRef<VerPdfSustentoComponent> = this._dialog.open(VerPdfSustentoComponent, {
      disableClose: false,
      width: '80%',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  // Método para abrir dialog de comentario (solo lectura)
  abrirComentarioDialog(evidencia: any, esFinal: boolean = false) {
    if (!evidencia || !evidencia.idEvidencia) {
      this._notification.warning('No hay evidencia asociada');
      return;
    }
    
    const dialogRef: MatDialogRef<ComentarioDialogComponent> = this._dialog.open(ComentarioDialogComponent, {
      disableClose: false,
      width: '500px',
      maxHeight: '80vh',
      autoFocus: false,
      data: {
        idEvidencia: evidencia.idEvidencia,
        esFinal: esFinal,
        soloLectura: !this.puedeEditarTabla()
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  puedeEditarTabla(): boolean {
    return this.esMaestroGdr && !!this.trabajadorEncontrado && !!this.reunionMetas;
  }

  async onComentarioChange(tipo: string, valor: string, indicador?: any, evidencia?: any): Promise<void> {
    if (!this.puedeEditarTabla()) {
      this._notification.warning('Solo Maestro GDR puede editar en esta vista');
      return;
    }

    try {
      switch (tipo) {
        case 'individuales':
          if (evidencia && evidencia.idEvidencia) {
            evidencia.comentario = valor || '';
            await this._grService.guardarComentarioEstado(
              evidencia.idEvidencia,
              valor || '',
              evidencia.comentarioAdicional || '',
              'individual'
            );
          }
          break;
        case 'final':
          if (indicador) {
            indicador.comentarioFinal = valor || '';
            const evidenciaFinal = this.getEvidenciaFinal(indicador);
            if (evidenciaFinal?.idEvidencia) {
              await this._grService.guardarComentarioEstado(
                evidenciaFinal.idEvidencia,
                valor || '',
                evidenciaFinal.comentarioAdicional || '',
                'final'
              );
            } else {
              this._notification.warning('No se encontró evidencia final para guardar comentario');
            }
          }
          break;
      }
      this._notification.success('Comentario guardado correctamente');
    } catch (error) {
      this._notification.error('Error al guardar comentario');
    }
  }

  abrirFechaPlazoDialog(evidencia: any, indicador: any) {
    if (!this.puedeEditarTabla()) {
      this._notification.warning('Solo Maestro GDR puede editar en esta vista');
      return;
    }

    if (!indicador || !indicador.idIndicador) {
      this._notification.warning('No se encontró el indicador asociado');
      return;
    }

    const dialogRef: MatDialogRef<FechaPlazoDialogComponent> = this._dialog.open(FechaPlazoDialogComponent, {
      disableClose: false,
      width: '400px',
      autoFocus: false,
      data: {
        idEvidencia: evidencia?.idEvidencia || null,
        idIndicador: indicador.idIndicador,
        esFinal: true,
        fechaActual: evidencia?.fechaPlazoFinal || indicador?.fechaPlazoFinal || null
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result?.actualizado) {
        await this.cargarFormatoGdr();
      }
    });
  }

  editValorAlcanzado(indicador: any): void {
    if (!this.puedeEditarTabla()) {
      this._notification.warning('Solo Maestro GDR puede editar en esta vista');
      return;
    }
    indicador.originalValorAlcanzado = indicador.valorAlcanzado;
    indicador.editingValorAlcanzado = true;
  }

  onValorAlcanzadoInput(event: any, indicador: any): void {
    const inputValue = event.target.value;
    if (inputValue !== '' && (isNaN(inputValue) || parseFloat(inputValue) < 0)) {
      event.target.value = indicador.valorAlcanzado || 0;
      return;
    }
    indicador.valorAlcanzado = inputValue === '' ? 0 : parseFloat(inputValue);
  }

  async saveValorAlcanzado(indicador: any): Promise<void> {
    if (!this.puedeEditarTabla()) {
      this._notification.warning('Solo Maestro GDR puede editar en esta vista');
      return;
    }

    if (indicador.valorAlcanzado === undefined || indicador.valorAlcanzado === null || isNaN(indicador.valorAlcanzado) || indicador.valorAlcanzado < 0) {
      indicador.valorAlcanzado = 0;
    }

    indicador.editingValorAlcanzado = false;
    delete indicador.originalValorAlcanzado;

    try {
      let idPrioridad = null;
      for (const prioridad of this.formatoGdr || []) {
        if (prioridad.listIndicador && prioridad.listIndicador.includes(indicador)) {
          idPrioridad = prioridad.idPrioridad;
          break;
        }
      }

      if (idPrioridad) {
        await this._grService.guardarValorAlcanzado(idPrioridad, indicador.valorAlcanzado);
        this._notification.success('Valor alcanzado guardado correctamente');
      }
    } catch (error) {
      this._notification.error('Error al guardar el valor alcanzado');
    }
  }

  cancelEditValorAlcanzado(indicador: any): void {
    indicador.valorAlcanzado = indicador.originalValorAlcanzado;
    indicador.editingValorAlcanzado = false;
    delete indicador.originalValorAlcanzado;
  }

  // Método para ver descripción de evidencia a presentar
  verDescripcionEvidencia(evidencia: any) {
    if (!evidencia) {
      this._notification.warning('No hay evidencia');
      return;
    }
    
    const descripcion = evidencia.descripcion || 'Sin descripción';
    
    this._dialog.open(NotificationDialogComponent, {
      disableClose: false,
      width: '450px',
      autoFocus: false,
      data: {
        title: 'Evidencia a presentar',
        message: descripcion
      }
    });
  }

  /**
   * Obtiene solo las evidencias iniciales (excluye la evidencia final con descripcion 'SUSTENTO FINAL')
   */
  getEvidenciasIniciales(indicador: any): any[] {
    if (!indicador.listEvidencia || indicador.listEvidencia.length === 0) {
      return [];
    }
    return indicador.listEvidencia.filter((ev: any) => !this.esEvidenciaFinal(ev));
  }

  getEvidenciaFinal(indicador: any): any {
    if (!indicador || !indicador.listEvidencia || indicador.listEvidencia.length === 0) {
      return indicador?.evidenciaFinal || null;
    }
    return indicador.listEvidencia.find((ev: any) => this.esEvidenciaFinal(ev)) || indicador.evidenciaFinal || null;
  }

  private esEvidenciaFinal(evidencia: any): boolean {
    if (!evidencia) {
      return false;
    }
    const descripcion = (evidencia.descripcion || '').toString().trim().toUpperCase();
    return evidencia.esFinal === true || descripcion === 'SUSTENTO FINAL';
  }

  // Calcular altura de indicador basándose en evidencias
  calcularAlturaIndicador(indicador: any): number {
    const baseHeight = 56; // altura mínima
    const evidenciaHeight = 56; // altura por cada evidencia
    
    // Contar solo evidencias iniciales
    let numEvidenciasIniciales = this.getEvidenciasIniciales(indicador).length;
    if (numEvidenciasIniciales === 0) {
      numEvidenciasIniciales = 1; // mínimo 1 placeholder
    }
    
    // Siempre hay 1 evidencia final
    const numEvidenciaFinal = 1;
    
    // altura = (evidencias iniciales + evidencia final) * altura por evidencia
    return (numEvidenciasIniciales + numEvidenciaFinal) * evidenciaHeight;
  }

  // Calcular puntaje por meta
  calcularPuntajePorMeta(indicador: any): string {
    if (!indicador.valorMeta || !indicador.peso) {
      return '-';
    }
    
    const valorAlcanzado = indicador.valorAlcanzado || 0;
    const valorMeta = parseFloat(indicador.valorMeta);
    const peso = parseFloat(indicador.peso);
    
    if (valorMeta === 0) {
      return 'Error';
    }
    
    let porcentajeCumplimiento: number;
    
    if (indicador.sentido === 'descendente') {
      // Para descendente: si alcanzado < meta es mejor
      porcentajeCumplimiento = valorAlcanzado <= valorMeta ? 
        ((2 * valorMeta - valorAlcanzado) / valorMeta) : 
        (valorMeta / valorAlcanzado);
    } else {
      // Para ascendente: alcanzado / meta
      porcentajeCumplimiento = valorAlcanzado / valorMeta;
    }
    
    // Limitar a 100%
    if (porcentajeCumplimiento > 1) porcentajeCumplimiento = 1;
    
    const puntaje = (porcentajeCumplimiento * peso).toFixed(2);
    return puntaje;
  }

  // Calcular suma total de puntajes
  calcularPuntuacionFinal(): number {
    if (!this.formatoGdr) return 0;
    
    let totalPuntaje = 0;
    
    for (const prioridad of this.formatoGdr) {
      if (prioridad.listIndicador) {
        for (const indicador of prioridad.listIndicador) {
          const puntaje = this.calcularPuntajePorMeta(indicador);
          if (puntaje !== '-' && puntaje !== 'Error') {
            totalPuntaje += parseFloat(puntaje);
          }
        }
      }
    }
    
    return Math.round(totalPuntaje * 100) / 100;
  }

  // Obtener calificación según el algoritmo completo
  getCalificacion(puntuacion: number): string {
    // 1. Si no asistió a reunión de metas → Desaprobado
    if (this.reunionMetas?.asistio === 'N') {
      return 'Desaprobado';
    }

    // 2. Si tiene menos de 6 meses → No corresponde calificación
    if (this.resultadosFinales?.permanenciaSeisMeses === 'NO') {
      return 'No corresponde calificación';
    }

    // 3. Si no hay puntuación válida
    if (!puntuacion || isNaN(puntuacion) || puntuacion <= 0) {
      return '-';
    }

    const segmento = (this.trabajadorEncontrado?.segmento || '').toUpperCase();
    const rendimientoDistinguido = this.resultadosFinales?.rendimientoDistinguido;

    // 4. Rendimiento Distinguido: puntaje >= 100 Y opción "Sí" seleccionada
    if (rendimientoDistinguido === 'Si' && puntuacion >= 100) {
      return 'Rendimiento Distinguido';
    }

    // 5. Buen rendimiento para DIRECTIVO: puntaje >= 70
    if (segmento === 'DIRECTIVO' && puntuacion >= 70) {
      return 'Buen rendimiento';
    }

    // 6. Buen rendimiento para otros segmentos: puntaje >= 60
    const segmentosConUmbral60 = ['MANDO MEDIO', 'EJECUTOR', 'OPERADOR Y ASISTENCIA'];
    if (puntuacion >= 60 && segmentosConUmbral60.includes(segmento)) {
      return 'Buen rendimiento';
    }

    // 7. Caso contrario → Rendimiento sujeto a observación
    return 'Rendimiento sujeto a observación';
  }

  getCalificacionColor(puntuacion: number): string {
    const calificacion = this.getCalificacion(puntuacion);
    switch (calificacion) {
      case 'Rendimiento Distinguido': return '#4caf50';
      case 'Buen rendimiento': return '#8bc34a';
      case 'No corresponde calificación': return '#9e9e9e';
      case 'Desaprobado': return '#f44336';
      case 'Rendimiento sujeto a observación': return '#ff9800';
      default: return '#9e9e9e';
    }
  }

  // Obtener texto de comentario
  getComentarioTexto(comentario: string): string {
    switch (comentario) {
      case 'logrado': return 'Logrado';
      case 'proceso': return 'En proceso';
      case 'no_presento': return 'No presentó';
      case 'si_presenta': return 'SÍ presenta';
      case 'no_presenta': return 'NO presenta';
      default: return '-';
    }
  }

  // Cargar resultados finales del trabajador
  async cargarResultadosFinales() {
    if (!this.trabajadorEncontrado || !this.trabajadorEncontrado.idVotante) {
      this.resultadosFinales = null;
      return;
    }

    try {
      const anioActual = new Date().getFullYear();
      const resultados = await this._grService.obtenerResultadosFinalesMultiples(
        [this.trabajadorEncontrado.idVotante],
        anioActual
      );
      
      // El endpoint devuelve un objeto donde la clave es el idVotante
      const resultado = resultados[this.trabajadorEncontrado.idVotante];
      if (resultado) {
        this.resultadosFinales = resultado;
      } else {
        this.resultadosFinales = {
          rendimientoDistinguido: null,
          accionesCapacitacion: null,
          otrasAcciones: null,
          fechaReunion: null
        };
      }
    } catch (error) {
      console.error('Error cargando resultados finales:', error);
      this.resultadosFinales = {
        rendimientoDistinguido: null,
        accionesCapacitacion: null,
        otrasAcciones: null,
        fechaReunion: null
      };
    }
  }
}
