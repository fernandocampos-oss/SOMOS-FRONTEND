import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { NotificationService, SnackbarService } from '@core/services';
import { VerPdfSustentoComponent } from '@modules/indicadores-trabajador/components/ver-pdf-sustento/ver-pdf-sustento.component';
import { ComentarioDialogComponent } from '../gestionar-indicadores-trabajador/dialogs/comentario-dialog/comentario-dialog.component';

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

  // DNI del Maestro GDR actual
  dniMaestroGdr: string = '';
  periodoActual: string = new Date().getFullYear().toString();

  // Columnas para la tabla de indicadores (tabla completa)
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'sentido_indicador', 'valor_esperado', 'peso', 'evidencia', 'plazos', 'comentario', 'valor_alcanzado', 'puntuacion_meta'];
  columnsRow4: string[] = ['indicador_producto', 'sentido_indicador', 'valor_esperado', 'peso', 'evidencia', 'plazos', 'comentario'];

  constructor(
    private _grService: GestionRendimientoService,
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
      if (response) {
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

    try {
      // Buscar trabajador por DNI usando el nuevo endpoint específico
      const trabajador = await this._grService.findVotanteByDni(this.dniBusqueda);
      
      if (!trabajador) {
        this._notification.warning('No se encontró ningún trabajador con ese DNI');
        this.buscando = false;
        return;
      }

      this.trabajadorEncontrado = trabajador;

      // Buscar la reunión de establecimiento de metas
      await this.cargarReunionMetas();

      // Cargar evaluador si hay reunión
      await this.cargarEvaluador();

      // Cargar formato GDR del trabajador
      await this.cargarFormatoGdr();

      this._snackbar.success('Trabajador encontrado');
    } catch (error) {
      console.error('Error buscando trabajador:', error);
      this._notification.error('Error al buscar el trabajador');
    } finally {
      this.buscando = false;
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
      
      // Si hay reuniones, tomamos la primera (o podríamos mostrar todas)
      if (reuniones && reuniones.length > 0) {
        this.reunionMetas = reuniones[0];
      } else {
        this.reunionMetas = null;
      }
    } catch (error) {
      // Si no existe, puede ser normal
      console.log('No se encontró reunión de metas:', error);
      this.reunionMetas = null;
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
                  (ev: any) => ev.descripcion === 'SUSTENTO FINAL'
                );
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
                // Buscar la evidencia final por descripcion 'SUSTENTO FINAL'
                const evidenciaFinal = indicador.listEvidencia.find((ev: any) => ev.descripcion === 'SUSTENTO FINAL');
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

  async cargarEvaluador() {
    if (!this.reunionMetas || !this.reunionMetas.idVotanteEvaluador) {
      this.evaluador = null;
      return;
    }

    try {
      const evaluador = await this._grService.findVotanteById(this.reunionMetas.idVotanteEvaluador);
      this.evaluador = evaluador;
    } catch (error) {
      console.error('Error cargando evaluador:', error);
      this.evaluador = null;
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
      const resultado = await this._grService.reiniciarConfirmacionReunion(
        this.reunionMetas.idReunion,
        this.dniMaestroGdr
      );
      this.reunionMetas = resultado;
      this._notification.success('Confirmación reiniciada exitosamente');
    } catch (error: any) {
      this._notification.error(error?.error?.error || 'Error al reiniciar confirmación');
    }
  }

  limpiarBusqueda() {
    this.dniBusqueda = '';
    this.trabajadorEncontrado = null;
    this.reunionMetas = null;
    this.formatoGdr = null;
    this.evaluador = null;
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
        soloLectura: true // modo solo lectura
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  /**
   * Obtiene solo las evidencias iniciales (excluye la evidencia final con descripcion 'SUSTENTO FINAL')
   */
  getEvidenciasIniciales(indicador: any): any[] {
    if (!indicador.listEvidencia || indicador.listEvidencia.length === 0) {
      return [];
    }
    return indicador.listEvidencia.filter((ev: any) => ev.descripcion !== 'SUSTENTO FINAL');
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

  // Obtener calificación según puntuación
  getCalificacion(puntuacion: number): string {
    if (puntuacion >= 95) return 'Rendimiento Distinguido';
    if (puntuacion >= 85) return 'Buen Rendimiento';
    if (puntuacion >= 65) return 'Rendimiento Sujeto a Observación';
    if (puntuacion >= 50) return 'Desaprobado';
    return 'Desaprobado';
  }

  getCalificacionColor(puntuacion: number): string {
    if (puntuacion >= 95) return '#4caf50';
    if (puntuacion >= 85) return '#8bc34a';
    if (puntuacion >= 65) return '#ff9800';
    return '#f44336';
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
}
