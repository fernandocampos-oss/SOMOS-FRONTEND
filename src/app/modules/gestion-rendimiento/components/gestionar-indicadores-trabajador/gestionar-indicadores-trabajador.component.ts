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
import { ComentarioDialogComponent } from './dialogs/comentario-dialog/comentario-dialog.component';
import { FechaPlazoDialogComponent } from './dialogs/fecha-plazo-dialog/fecha-plazo-dialog.component';
import { ConfirmarPanelComponent } from '@shared/confirmar-panel/confirmar-panel.component';
import { RegistrarFormatoComponent } from './dialogs/registrar-formato/registrar-formato.component';
import { NotificationDialogComponent } from '@shared/notification-dialog/notification-dialog.component';
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

  // Variables para Reunión de Establecimiento de Metas
  idVotanteEvaluador: number = 0;
  dniEvaluador: string = '';
  periodoActual: string = new Date().getFullYear().toString();
  esMaestroGdr: boolean = false;

  // Configuración del ciclo GDR
  configuracionGdr: any = null;

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
  async onComentarioChange(tipo: string, valor: string, indicador?: any, evidencia?: any, index?: number): Promise<void> {
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
    
    switch(tipo) {
      case 'sinEvidencias':
        if (indicador) {
          indicador.comentarioSinEvidencias = valor || '';
        }
        break;
      case 'individuales':
        if (evidencia && evidencia.idEvidencia) {
          evidencia.comentario = valor || '';
          // Guardar en BD local con tipo 'individual'
          try {
            await this._grService.guardarComentarioEstado(
              evidencia.idEvidencia,
              valor || '',
              evidencia.comentarioAdicional || '',
              'individual'
            );
    // console.log removed for production
            this._notification.success('Comentario guardado correctamente');
          } catch (error) {
            // console.error('Error al guardar comentario:', error);
            this._notification.error('Error: No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
          }
        }
        break;
      case 'final':
        if (indicador) {
          indicador.comentarioFinal = valor || '';
          
          // Guardar en BD local con tipo 'final' - buscar evidencia con descripcion 'SUSTENTO FINAL'
          if (indicador.listEvidencia && indicador.listEvidencia.length > 0) {
            const evidenciaFinal = indicador.listEvidencia.find((ev: any) => ev.descripcion === 'SUSTENTO FINAL');
            if (evidenciaFinal && evidenciaFinal.idEvidencia) {
              try {
                // Guardar usando tipo 'final' para distinguir del comentario individual
                await this._grService.guardarComentarioEstado(
                  evidenciaFinal.idEvidencia,
                  valor || '',
                  evidenciaFinal.comentarioAdicional || '',
                  'final'
                );
    // console.log removed for production
                this._notification.success('Comentario final guardado correctamente');
              } catch (error) {
                // console.error('Error al guardar comentario final:', error);
                this._notification.error('Error: No se pudo guardar el comentario final');
              }
            }
          }
        }
        break;
    }
    
    //console.log('Valor actualizado para:', tipo, valor || '[Sin selección]');
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
    this.inicializar();
  }

  async inicializar() {
    // Primero obtener los datos del evaluador actual
    await this.getSegmentoModuloGR();
    // Cargar configuración del ciclo GDR
    await this.cargarConfiguracionGdr();
    // Luego cargar la tabla con los trabajadores
    await this.loadTableJefe();
  }

  /**
   * Carga la configuración del ciclo GDR para el periodo actual
   */
  async cargarConfiguracionGdr(): Promise<void> {
    try {
      this.configuracionGdr = await this._grService.obtenerConfiguracionGdr(this.periodoActual);
    } catch (error) {
      console.error('Error al cargar configuración GDR:', error);
      this.configuracionGdr = null;
    }
  }

  async actualizar() {
    this.listDataTable = [];
    let update = await this.loadTableJefe();
    this._snackbar.success("La lista se encuentra actualizada.");
  }

  async loadTableJefe() {
    let listPrioridades = await this._grService.listarPrioridadesPrincipal().then(async (data) => {
      if (data.length > 0) {
        this.listDataTable = data;
        
        // Inicializar propiedades para cada trabajador → prioridad → indicador
        this.listDataTable.forEach(trabajador => {
          if (trabajador.listPrioridad) {
            trabajador.listPrioridad.forEach(prioridad => {
              if (prioridad.listIndicador) {
                prioridad.listIndicador.forEach(indicador => {
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
                  
                  // Asignar evidenciaFinal buscando por descripcion 'SUSTENTO FINAL'
                  if (indicador.listEvidencia && indicador.listEvidencia.length > 0) {
                    indicador.evidenciaFinal = indicador.listEvidencia.find(
                      (ev: any) => ev.descripcion === 'SUSTENTO FINAL'
                    );
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
          }
        });

        // Cargar sentidos de indicadores desde BD local DESPUÉS de tener los datos
        await this.cargarSentidosIndicadores();
        
        // Cargar comentarios de evidencias desde BD local
        await this.cargarComentariosEvidencias();
        
        // Cargar fechas de plazo desde BD local
        await this.cargarFechasPlazo();
        
        // Cargar valores alcanzados desde BD local
        await this.cargarValoresAlcanzados();

        // Cargar resultados finales desde BD local
        await this.cargarResultadosFinales();

        // Cargar datos de reunión de establecimiento de metas
        await this.cargarReunionesEstablecimientoMetas();
      }
    });
  }

  /**
   * Carga los datos de reunión de establecimiento de metas para cada trabajador
   */
  async cargarReunionesEstablecimientoMetas() {
    if (!this.idVotanteEvaluador || this.listDataTable.length === 0) return;

    for (const trabajador of this.listDataTable) {
      try {
        const reunion = await this._grService.obtenerOCrearReunionMetas(
          trabajador.idVotante,
          this.idVotanteEvaluador,
          this.periodoActual
        );
        trabajador.reunionMetas = reunion;
      } catch (error) {
        console.error('Error cargando reunión de metas para trabajador:', trabajador.idVotante, error);
        trabajador.reunionMetas = null;
      }
    }
  }

  /**
   * Actualiza la asistencia de la reunión de establecimiento de metas
   */
  async onAsistenciaReunionChange(trabajador: any, asistio: string) {
    if (!trabajador.reunionMetas) return;
    
    try {
      // Si cambia a "No" o "-", limpiar la fecha
      const fechaReunion = asistio === 'S' ? trabajador.reunionMetas.fechaReunion : null;
      
      const resultado = await this._grService.actualizarAsistenciaReunion(
        trabajador.reunionMetas.idReunion,
        asistio,
        fechaReunion
      );
      trabajador.reunionMetas = resultado;
      this._notification.success('Asistencia actualizada');
    } catch (error: any) {
      this._notification.error(error?.error?.error || 'Error al actualizar asistencia');
    }
  }

  /**
   * Actualiza la fecha de la reunión de establecimiento de metas
   */
  async onFechaReunionMetasChange(trabajador: any, fecha: Date) {
    if (!trabajador.reunionMetas || trabajador.reunionMetas.asistio !== 'S') return;
    
    try {
      const fechaStr = fecha ? fecha.toISOString().split('T')[0] : null;
      const resultado = await this._grService.actualizarAsistenciaReunion(
        trabajador.reunionMetas.idReunion,
        'S',
        fechaStr
      );
      trabajador.reunionMetas = resultado;
      this._notification.success('Fecha actualizada');
    } catch (error: any) {
      this._notification.error(error?.error?.error || 'Error al actualizar fecha');
    }
  }

  /**
   * Confirma la reunión de establecimiento de metas
   */
  async confirmarReunionMetas(trabajador: any) {
    if (!trabajador.reunionMetas) return;
    
    // Validar
    if (trabajador.reunionMetas.asistio === '-') {
      this._notification.warning('Debe seleccionar si asistió o no a la reunión');
      return;
    }
    if (trabajador.reunionMetas.asistio === 'S' && !trabajador.reunionMetas.fechaReunion) {
      this._notification.warning('Debe ingresar la fecha de la reunión');
      return;
    }
    
    try {
      const resultado = await this._grService.confirmarReunionMetas(trabajador.reunionMetas.idReunion);
      trabajador.reunionMetas = resultado;
      this._notification.success('Reunión confirmada exitosamente');
    } catch (error: any) {
      this._notification.error(error?.error?.error || 'Error al confirmar reunión');
    }
  }

  /**
   * Reinicia la confirmación de la reunión (solo Maestro GDR)
   */
  async reiniciarConfirmacionReunion(trabajador: any) {
    if (!trabajador.reunionMetas || !this.esMaestroGdr) return;
    
    try {
      const resultado = await this._grService.reiniciarConfirmacionReunion(
        trabajador.reunionMetas.idReunion,
        this.dniEvaluador
      );
      trabajador.reunionMetas = resultado;
      this._notification.success('Confirmación reiniciada');
    } catch (error: any) {
      this._notification.error(error?.error?.error || 'Error al reiniciar confirmación');
    }
  }

  async cargarSentidosIndicadores() {
    // console.log removed for production
    try {
      // Recolectar todos los IDs de indicadores (recorriendo la estructura anidada correctamente)
      const idsIndicadores: number[] = [];
      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
            if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
              prioridad.listIndicador.forEach(indicador => {
                if (indicador.idIndicador) {
                  idsIndicadores.push(indicador.idIndicador);
                }
              });
            }
          });
        }
      });

    // console.log removed for production

      if (idsIndicadores.length === 0) {
    // console.log removed for production
        return;
      }

      // Obtener sentidos en batch desde la BD local
    // console.log removed for production
      const sentidosMap = await this._grService.obtenerSentidosMultiples(idsIndicadores);
    // console.log removed for production
    // console.log removed for production
    // console.log removed for production
      
      // Asignar sentidos a cada indicador (recorriendo la estructura anidada correctamente)
      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
            if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
              prioridad.listIndicador.forEach(indicador => {
    // console.log removed for production
    // console.log removed for production
                if (indicador.idIndicador && sentidosMap[indicador.idIndicador]) {
                  indicador.sentido = sentidosMap[indicador.idIndicador];
    // console.log removed for production
                } else {
                  // No asignar valor si no existe en BD local (quedará undefined)
                  indicador.sentido = null;
    // console.log removed for production
                }
              });
            }
          });
        }
      });

    // console.log removed for production
    // console.log removed for production
    } catch (error) {
      // console.error('Error cargando sentidos:', error);
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
    // console.log removed for production
  }

  async cargarComentariosEvidencias() {
    // console.log removed for production
    try {
      // Recolectar todos los IDs de evidencias
      const idsEvidencias: number[] = [];
      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
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
        }
      });

    // console.log removed for production

      if (idsEvidencias.length === 0) {
    // console.log removed for production
        return;
      }

      // Obtener comentarios en batch desde la BD local (ahora retorna objeto con clave compuesta idEvidencia_tipo)
    // console.log removed for production
      const comentariosMap = await this._grService.obtenerComentariosEstadoMultiples(idsEvidencias);
    // console.log removed for production

      // Asignar comentarios a cada evidencia
      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
            if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
              prioridad.listIndicador.forEach(indicador => {
                if (indicador.listEvidencia && indicador.listEvidencia.length > 0) {
                  indicador.listEvidencia.forEach((evidencia, index) => {
                    if (evidencia.idEvidencia) {
                      // Buscar comentario individual
                      const claveIndividual = evidencia.idEvidencia + '_individual';
                      if (comentariosMap[claveIndividual]) {
                        const comentarioData = comentariosMap[claveIndividual];
                        evidencia.comentario = comentarioData.estadoDropdown || '';
                        evidencia.comentarioAdicional = comentarioData.comentarioAdicional || '';
    // console.log removed for production
                      }
                      
                      // Si es la última evidencia, buscar también comentario final
                      if (index === indicador.listEvidencia.length - 1) {
                        const claveFinal = evidencia.idEvidencia + '_final';
                        if (comentariosMap[claveFinal]) {
                          const comentarioFinalData = comentariosMap[claveFinal];
                          indicador.comentarioFinal = comentarioFinalData.estadoDropdown || '';
    // console.log removed for production
                        }
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });

    // console.log removed for production
    } catch (error) {
      // console.error('Error cargando comentarios:', error);
    }
    // console.log removed for production
  }

  async cargarFechasPlazo() {
    // console.log removed for production
    try {
      const idsIndicadores: number[] = [];
      
      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
            if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
              prioridad.listIndicador.forEach(indicador => {
                if (indicador.idIndicador) {
                  idsIndicadores.push(indicador.idIndicador);
                }
              });
            }
          });
        }
      });

    // console.log removed for production

      if (idsIndicadores.length === 0) {
    // console.log removed for production
        return;
      }

      const fechasMap = await this._grService.obtenerFechasPlazoFinalPorIndicadores(idsIndicadores);
    // console.log removed for production

      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
            if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
              prioridad.listIndicador.forEach(indicador => {
    // console.log removed for production
                if (indicador.idIndicador && fechasMap[indicador.idIndicador]) {
                  const fechaPlazo = fechasMap[indicador.idIndicador];
    // console.log removed for production
                  
                  // Guardar la fecha directamente en el indicador
                  indicador.fechaPlazoFinal = fechaPlazo;
                  
                  if (indicador.listEvidencia && indicador.listEvidencia.length > 0) {
                    // Buscar la evidencia final por descripcion 'SUSTENTO FINAL'
                    const evidenciaFinal = indicador.listEvidencia.find((ev: any) => ev.descripcion === 'SUSTENTO FINAL');
                    if (evidenciaFinal) {
                      evidenciaFinal.fechaPlazoFinal = fechaPlazo;
                    }
    // console.log removed for production
                  } else {
                    if (!indicador.listEvidencia) {
                      indicador.listEvidencia = [];
                    }
                    indicador.listEvidencia.push({
                      esFinal: true,
                      fechaPlazoFinal: fechaPlazo
                    });
    // console.log removed for production
                  }
                } else {
    // console.log removed for production
                }
              });
            }
          });
        }
      });
    } catch (error) {
      // console.error('Error cargando fechas de plazo:', error);
    }
  }

  async cargarValoresAlcanzados() {
    // console.log removed for production
    try {
      // Recolectar todos los IDs de prioridades
      const idsPrioridades: number[] = [];
      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
            if (prioridad.idPrioridad) {
              idsPrioridades.push(prioridad.idPrioridad);
            }
          });
        }
      });

      if (idsPrioridades.length === 0) {
    // console.log removed for production
        return;
      }

    // console.log removed for production

      // Llamar al servicio para obtener múltiples valores alcanzados
      const valoresMap = await this._grService.obtenerValoresAlcanzadosMultiples(idsPrioridades);
    // console.log removed for production

      // Asignar valores alcanzados a cada prioridad
      this.listDataTable.forEach(trabajador => {
        if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
          trabajador.listPrioridad.forEach(prioridad => {
            if (prioridad.idPrioridad && valoresMap[prioridad.idPrioridad] !== undefined) {
              const valorAlcanzado = valoresMap[prioridad.idPrioridad];
              
              // Asignar el valor a todos los indicadores de esta prioridad
              if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
                prioridad.listIndicador.forEach(indicador => {
                  indicador.valorAlcanzado = valorAlcanzado;
    // console.log removed for production
                });
              }
            }
          });
        }
      });

    // console.log removed for production
    } catch (error) {
      // console.error('Error cargando valores alcanzados:', error);
    }
    // console.log removed for production
  }

  async registrarPrioridad(trabajador?: any) {
    const dialogRef: MatDialogRef<AsignarPrioridadComponent> = this._dialog.open(AsignarPrioridadComponent, {
      disableClose: true,
      width: '60%',
      maxHeight: '80vh',
      autoFocus: false,
      data: {
        trabajador: trabajador, // Pasar el trabajador pre-seleccionado
        bloqueado: trabajador ? true : false // Si viene trabajador, bloquearlo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTableJefe();
      }
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
      if (result) {
        this.loadTableJefe();
      }
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
      if (result) {
        this.loadTableJefe();
      }
    });

  }

  async eliminarEvidencia(indicador: any) {
    if (!indicador.listEvidencia || indicador.listEvidencia.length === 0) {
      this._notification.warning('No hay evidencias para eliminar');
      return;
    }

    // Obtener la penúltima evidencia (la última evidencia inicial)
    const ultimaEvidenciaInicial = indicador.listEvidencia[indicador.listEvidencia.length - 1];
    
    if (!ultimaEvidenciaInicial || !ultimaEvidenciaInicial.idEvidencia) {
      this._notification.warning('No se puede eliminar esta evidencia');
      return;
    }

    // Usar dialog de confirmación de Angular Material
    const confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    confirmDialogRef.componentInstance.confirmMessage = '¿Está seguro que desea eliminar esta evidencia?';
    
    confirmDialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this._grService.deleteEvidenciaById(ultimaEvidenciaInicial.idEvidencia);
          this._notification.success('Evidencia eliminada correctamente');
          
          // Eliminar del array local inmediatamente
          indicador.listEvidencia = indicador.listEvidencia.filter(
            (ev: any) => ev.idEvidencia !== ultimaEvidenciaInicial.idEvidencia
          );
          
          // Recargar los datos completos
          await this.loadTableJefe();
        } catch (error) {
          // console.error('Error al eliminar evidencia:', error);
          this._notification.error('Error al eliminar la evidencia');
        }
      }
    });
  }

  async eliminarArchivoEvidencia(evidencia: any) {
    if (!evidencia || !evidencia.idEvidencia) {
      this._notification.warning('No se puede eliminar el archivo de esta evidencia');
      return;
    }

    // Verificar que tenga un archivo cargado
    if (!evidencia.sustentoExtensionFile) {
      this._notification.warning('Esta evidencia no tiene archivo adjunto');
      return;
    }

    // Usar dialog de confirmación
    const confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    confirmDialogRef.componentInstance.confirmMessage = '¿Está seguro que desea eliminar el archivo de esta evidencia? La evidencia se mantendrá pero sin archivo adjunto.';
    
    confirmDialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          // Llamar al servicio para eliminar solo el archivo (limpiar campos de sustento)
          await this._grService.eliminarArchivoEvidencia(evidencia.idEvidencia);
          this._notification.success('Archivo eliminado correctamente');
          
          // Limpiar campos localmente
          evidencia.sustentoExtensionFile = null;
          evidencia.sustentoDescripcion = null;
          evidencia.sustentoFechaRegistro = null;
          
          // Recargar los datos completos
          await this.loadTableJefe();
        } catch (error) {
          // console.error('Error al eliminar archivo:', error);
          this._notification.error('Error al eliminar el archivo de la evidencia');
        }
      }
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
      if (result) {
        this.loadTableJefe();
      }
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
      if (result) {
        this.loadTableJefe();
      }
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

  // Método para abrir dialog de comentario
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
        esFinal: esFinal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.actualizado) {
        // Recargar datos si se actualizó el comentario
        this.loadTableJefe();
      }
    });
  }

  abrirFechaPlazoDialog(evidencia: any, indicador: any) {
    if (!evidencia || !evidencia.idEvidencia) {
      this._notification.warning('No hay evidencia asociada');
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
        idEvidencia: evidencia.idEvidencia,
        idIndicador: indicador.idIndicador
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.actualizado) {
        // Recargar datos si se actualizó la fecha
        this.loadTableJefe();
      }
    });
  }

  async getSegmentoModuloGR() {
    let load = await this._grService.getVotanteByIdUsuario().then((data: any) => {
      if (data) {
        this.idSegmento = data.idSegmento;
        this.idVotanteEvaluador = data.idVotante;
        this.dniEvaluador = data.numeroDocumento || '';
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

    // Verificar si es Maestro GDR
    try {
      const resultado = await this._grService.esMaestroGdr();
      this.esMaestroGdr = resultado?.esMaestro || false;
    } catch (error) {
      this.esMaestroGdr = false;
    }
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
    // console.log removed for production
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
      if (result) {
        this.loadTableJefe();
      }
    });
  }

  confirmarEliminarIndicador(idIndicador: number, prioridad: any): void {
    // Verificar que haya al menos un indicador
    if (prioridad.listIndicador.length <= 1) {
      this._notification.warning('No se puede eliminar el único indicador de esta prioridad');
      return;
    }

    // Abrir dialog de confirmación
    const confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    confirmDialogRef.componentInstance.confirmMessage = '¿Está seguro que desea eliminar este indicador?';
    
    confirmDialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this._grService.deleteIndicadorById(idIndicador);
          this._notification.success('Indicador eliminado correctamente');
          
          // Eliminar del array local inmediatamente
          prioridad.listIndicador = prioridad.listIndicador.filter(
            (ind: any) => ind.idIndicador !== idIndicador
          );
          
          // Recargar los datos completos
          await this.loadTableJefe();
        } catch (error) {
          // console.error('Error al eliminar indicador:', error);
          this._notification.error('Error al eliminar el indicador');
        }
      }
    });
  }

  confirmarEliminarPrioridad(idPrioridad: number, trabajador: any): void {
    const dialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = '¿Está seguro de eliminar esta prioridad? Se eliminarán todos los indicadores y evidencias asociadas. Esta acción no se puede deshacer.';

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._grService.deletePrioridadById(idPrioridad).then(() => {
          this._notification.success('Prioridad eliminada correctamente');
          // Recargar datos
          this.loadTableJefe();
        }).catch(error => {
          this._notification.error('Error al eliminar la prioridad');
        });
      }
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
      if (result) {
        this.loadTableJefe();
      }
    });
  }

  registrarSustentoFinal(indicador: any) {
    // Buscar la evidencia final por descripción 'SUSTENTO FINAL'
    let evidenciaFinal = null;
    
    if (indicador.listEvidencia && indicador.listEvidencia.length > 0) {
      // Buscar la evidencia con descripcion = 'SUSTENTO FINAL'
      evidenciaFinal = indicador.listEvidencia.find(
        (ev: any) => ev.descripcion === 'SUSTENTO FINAL'
      );
    }
    
    // Fallback: usar indicador.evidenciaFinal si existe
    if (!evidenciaFinal && indicador.evidenciaFinal) {
      evidenciaFinal = indicador.evidenciaFinal;
    }

    if (!evidenciaFinal) {
      this._notification.warning('No se encontró la evidencia final para este indicador');
      return;
    }

    const dialogRef: MatDialogRef<RegistrarSustentoComponent> = this._matDialog.open(RegistrarSustentoComponent, {
      disableClose: false,
      width: '780px',
      autoFocus: true,
      data: {
        model: evidenciaFinal,
        esFinal: true // Marcar que es evidencia final
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTableJefe();
      }
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

  async saveValorAlcanzado(indicador: any) {
    // Validar una vez más antes de guardar
    if (indicador.valorAlcanzado === undefined || indicador.valorAlcanzado === null || 
        isNaN(indicador.valorAlcanzado) || indicador.valorAlcanzado <= 0) {
      // Si no es válido, usar 0 como valor por defecto
      indicador.valorAlcanzado = 0;
    }
    
    // Salir del modo edición
    indicador.editingValorAlcanzado = false;
    delete indicador.originalValorAlcanzado;
    
    // Guardar en BD local
    try {
      // Buscar el idPrioridad del indicador (necesitamos encontrar la prioridad padre)
      let idPrioridad = null;
      for (const trabajador of this.listDataTable) {
        if (trabajador.listPrioridad) {
          for (const prioridad of trabajador.listPrioridad) {
            if (prioridad.listIndicador && prioridad.listIndicador.includes(indicador)) {
              idPrioridad = prioridad.idPrioridad;
              break;
            }
          }
        }
        if (idPrioridad) break;
      }
      
      if (idPrioridad) {
    // console.log removed for production
        await this._grService.guardarValorAlcanzado(idPrioridad, indicador.valorAlcanzado);
        this._notification.success('Valor alcanzado guardado correctamente');
      } else {
        // console.error('No se encontró idPrioridad para el indicador');
      }
    } catch (error) {
      // console.error('Error al guardar valor alcanzado:', error);
      this._notification.error('Error al guardar el valor alcanzado');
    }
  }

  cancelEditValorAlcanzado(indicador: any): void {
    // Restaurar el valor original
    indicador.valorAlcanzado = indicador.originalValorAlcanzado;
    indicador.editingValorAlcanzado = false;
    delete indicador.originalValorAlcanzado;
  }

  /**
   * Calcula el puntaje por meta según la fórmula:
   * =SI.ERROR(SI($L$18="No";"No corresponde";SI(O(M21="";E21="[Seleccione]");"-";SI(SI(E21="Ascendente";(M21/F21)*100*G21;(((1-(M21/F21))+1)*100*G21))>(G21*100);(G21*100);SI(E21="Ascendente";(M21/F21)*100*G21;SI(Y(E21="Descendente";(M21>F21*2));0;((1-(M21/F21))+1)*100*G21)))));"-")
   * 
   * Donde:
   * - E21 = sentido del indicador (Ascendente/Descendente)
   * - F21 = valor esperado (meta)
   * - G21 = peso (como porcentaje, ej: 50)
   * - M21 = valor alcanzado
   */
  
  /**
   * Obtiene solo las evidencias iniciales (excluye la evidencia final con descripcion 'SUSTENTO FINAL')
   */
  getEvidenciasIniciales(indicador: any): any[] {
    if (!indicador.listEvidencia || indicador.listEvidencia.length === 0) {
      return [];
    }
    return indicador.listEvidencia.filter((ev: any) => ev.descripcion !== 'SUSTENTO FINAL');
  }

  /**
   * Calcula la altura total que debe ocupar un indicador
   * según el número de evidencias (cada evidencia = 44px + 12px margin = 56px)
   * Siempre hay al menos 1 evidencia inicial + 1 evidencia final = 112px mínimo
   */
  calcularAlturaIndicador(indicador: any): number {
    const ALTURA_EVIDENCIA = 56; // 44px min-height + 12px margin-bottom
    
    // Contar evidencias iniciales (excluyendo 'SUSTENTO FINAL')
    let numEvidenciasIniciales = this.getEvidenciasIniciales(indicador).length;
    if (numEvidenciasIniciales === 0) {
      // Si no hay evidencias iniciales, mostrar placeholder inicial
      numEvidenciasIniciales = 1;
    }
    
    // Siempre hay 1 evidencia final
    const numEvidenciaFinal = 1;
    
    // Altura total
    const alturaTotal = (numEvidenciasIniciales + numEvidenciaFinal) * ALTURA_EVIDENCIA;
    
    return alturaTotal;
  }

  calcularPuntajePorMeta(indicador: any): string {
    try {
      // Validar que tengamos todos los datos necesarios
      const sentido = indicador.sentido;
      const valorEsperado = parseFloat(indicador.valorMeta);
      const peso = parseFloat(indicador.peso);
      const valorAlcanzado = parseFloat(indicador.valorAlcanzado);

      // SI(O(M21="";E21="[Seleccione]");"-"; ...)
      if (!sentido || sentido === '' || isNaN(valorAlcanzado) || valorAlcanzado === null || valorAlcanzado === undefined) {
        return '-';
      }

      if (isNaN(valorEsperado) || isNaN(peso)) {
        return '-';
      }

      // Convertir peso de porcentaje a decimal (50 -> 0.5)
      const pesoDecimal = peso / 100;

      let puntaje: number;

      // Calcular según el sentido
      if (sentido.toLowerCase() === 'ascendente') {
        // Para ascendente: (M21/F21)*100*G21
        puntaje = (valorAlcanzado / valorEsperado) * 100 * pesoDecimal;
      } else if (sentido.toLowerCase() === 'descendente') {
        // Para descendente: primero verificar si M21 > F21*2
        if (valorAlcanzado > valorEsperado * 2) {
          return '0';
        }
        // Si no: ((1-(M21/F21))+1)*100*G21
        puntaje = ((1 - (valorAlcanzado / valorEsperado)) + 1) * 100 * pesoDecimal;
      } else {
        return '-';
      }

      // Verificar que no exceda el peso máximo (G21*100)
      const pesoMaximo = peso;
      if (puntaje > pesoMaximo) {
        puntaje = pesoMaximo;
      }

      // Asegurar que no sea negativo
      if (puntaje < 0) {
        puntaje = 0;
      }

      // Retornar con 2 decimales
      return puntaje.toFixed(2);
    } catch (error) {
      // console.error('Error al calcular puntaje por meta:', error);
      return 'Error';
    }
  }

  calcularPuntuacionFinal(trabajador: any): string {
    try {
      let sumaTotal = 0;
      
      // Recorrer todas las prioridades del trabajador
      if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
        trabajador.listPrioridad.forEach((prioridad: any) => {
          // Recorrer todos los indicadores de la prioridad
          if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
            prioridad.listIndicador.forEach((indicador: any) => {
              const puntaje = this.calcularPuntajePorMeta(indicador);
              // Solo sumar si es un número válido (no es '-' ni 'Error')
              if (puntaje !== '-' && puntaje !== 'Error') {
                const valor = parseFloat(puntaje);
                if (!isNaN(valor)) {
                  sumaTotal += valor;
                }
              }
            });
          }
        });
      }
      
      return sumaTotal.toFixed(2);
    } catch (error) {
      // console.error('Error al calcular puntuación final:', error);
      return '0.00';
    }
  }

  calcularCalificacion(trabajador: any): string {
    try {
      const puntuacionFinal = this.calcularPuntuacionFinal(trabajador);
      
      if (puntuacionFinal === '-' || puntuacionFinal === 'Error') {
        return '-';
      }

      const puntaje = parseFloat(puntuacionFinal);

      if (isNaN(puntaje)) {
        return '-';
      }

      if (puntaje >= 100) {
        return 'Rendimiento Distinguido';
      } else if (puntaje >= 60) {
        return 'Buen rendimiento';
      } else {
        return 'Rendimiento sujeto a observación';
      }
    } catch (error) {
      // console.error('Error al calcular calificación:', error);
      return '-';
    }
  }
  // ========== Resultados Finales ==========
  async cargarResultadosFinales() {
    try {
      const anioActual = new Date().getFullYear();
      const idsVotantes: number[] = [];

      this.listDataTable.forEach(trabajador => {
        if (trabajador.idVotante) {
          idsVotantes.push(trabajador.idVotante);
        }
      });

      if (idsVotantes.length === 0) return;

      const resultados = await this._grService.obtenerResultadosFinalesMultiples(idsVotantes, anioActual);

      this.listDataTable.forEach(trabajador => {
        const resultado = resultados[trabajador.idVotante];
        if (resultado) {
          trabajador.resultadosFinales = resultado;
        } else {
          // Inicializar con valores por defecto
          trabajador.resultadosFinales = {
            rendimientoDistinguido: '[Seleccione]',
            accionesCapacitacion: '',
            otrasAcciones: '',
            fechaReunion: null
          };
        }
      });
    // console.log removed for production
    } catch (error) {
      console.warn('No se pudieron cargar resultados finales (endpoint puede no estar disponible):', error);
      // Inicializar todos con valores por defecto
      this.listDataTable.forEach(trabajador => {
        trabajador.resultadosFinales = {
          rendimientoDistinguido: '[Seleccione]',
          accionesCapacitacion: '',
          otrasAcciones: '',
          fechaReunion: null
        };
      });
    }
  }

  async guardarResultadoFinal(trabajador: any) {
    try {
      const anioActual = new Date().getFullYear();
      const resultados = trabajador.resultadosFinales || {};

      await this._grService.guardarResultadosFinales(
        trabajador.idVotante,
        anioActual,
        resultados.rendimientoDistinguido || '[Seleccione]',
        resultados.accionesCapacitacion || '',
        resultados.otrasAcciones || '',
        resultados.fechaReunion || null
      );

      this._notification.success('Resultados finales guardados');
    } catch (error) {
      // console.error('Error al guardar:', error);
      this._notification.error('Error al guardar');
    }
  }

  onRendimientoDistinguidoChange(trabajador: any, value: string) {
    if (!trabajador.resultadosFinales) trabajador.resultadosFinales = {};
    trabajador.resultadosFinales.rendimientoDistinguido = value;
    
    // Solo guardar si el valor es diferente de '[Seleccione]'
    if (value !== '[Seleccione]') {
      this.guardarResultadoFinal(trabajador);
    }
  }

  onAccionesCapacitacionChange(trabajador: any, value: string) {
    if (!trabajador.resultadosFinales) trabajador.resultadosFinales = {};
    trabajador.resultadosFinales.accionesCapacitacion = value;
  }

  onOtrasAccionesChange(trabajador: any, value: string) {
    if (!trabajador.resultadosFinales) trabajador.resultadosFinales = {};
    trabajador.resultadosFinales.otrasAcciones = value;
  }

  async guardarTextoResultadoFinal(trabajador: any) {
    await this.guardarResultadoFinal(trabajador);
  }

  // Métodos para editar/guardar acciones de capacitación
  editarAccionesCapacitacion(trabajador: any) {
    if (!trabajador.resultadosFinales) {
      trabajador.resultadosFinales = {
        rendimientoDistinguido: '[Seleccione]',
        accionesCapacitacion: '',
        otrasAcciones: '',
        fechaReunion: null
      };
    }
    trabajador.tempAccionesCapacitacion = trabajador.resultadosFinales.accionesCapacitacion;
    trabajador.editingAccionesCapacitacion = true;
  }

  async guardarAccionesCapacitacion(trabajador: any) {
    trabajador.editingAccionesCapacitacion = false;
    await this.guardarResultadoFinal(trabajador);
  }

  cancelarAccionesCapacitacion(trabajador: any) {
    trabajador.resultadosFinales.accionesCapacitacion = trabajador.tempAccionesCapacitacion;
    trabajador.editingAccionesCapacitacion = false;
  }

  // Métodos para editar/guardar otras acciones
  editarOtrasAcciones(trabajador: any) {
    if (!trabajador.resultadosFinales) {
      trabajador.resultadosFinales = {
        rendimientoDistinguido: '[Seleccione]',
        accionesCapacitacion: '',
        otrasAcciones: '',
        fechaReunion: null
      };
    }
    trabajador.tempOtrasAcciones = trabajador.resultadosFinales.otrasAcciones;
    trabajador.editingOtrasAcciones = true;
  }

  async guardarOtrasAcciones(trabajador: any) {
    trabajador.editingOtrasAcciones = false;
    await this.guardarResultadoFinal(trabajador);
  }

  cancelarOtrasAcciones(trabajador: any) {
    trabajador.resultadosFinales.otrasAcciones = trabajador.tempOtrasAcciones;
    trabajador.editingOtrasAcciones = false;
  }

  async onFechaReunionChange(trabajador: any, fecha: any) {
    if (!trabajador.resultadosFinales) trabajador.resultadosFinales = {};
    let fechaStr = null;
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      fechaStr = `${year}-${month}-${day}`;
    }
    trabajador.resultadosFinales.fechaReunion = fechaStr;
    await this.guardarResultadoFinal(trabajador);
  }

  // ========== Registrar Formato ==========
  /**
   * Calcula el peso total de los indicadores de un trabajador
   */
  calcularPesoTotal(trabajador: any): number {
    let pesoTotal = 0;
    if (trabajador.listPrioridad && trabajador.listPrioridad.length > 0) {
      trabajador.listPrioridad.forEach((prioridad: any) => {
        if (prioridad.listIndicador && prioridad.listIndicador.length > 0) {
          prioridad.listIndicador.forEach((indicador: any) => {
            const peso = parseFloat(indicador.peso) || 0;
            pesoTotal += peso;
          });
        }
      });
    }
    return pesoTotal;
  }

  /**
   * Verifica si se puede registrar sustento para una evidencia inicial
   * @param trabajador El trabajador actual
   * @param evIdx Índice de la evidencia (0 = EVIDENCIA 1, 1 = EVIDENCIA 2)
   */
  puedeRegistrarSustento(trabajador: any, evIdx: number): boolean {
    // Debe tener el formato confirmado
    if (!trabajador.reunionMetas?.confirmado) {
      return false;
    }
    // Verificar la evidencia correspondiente
    if (evIdx === 0) {
      return this.configuracionGdr?.evidencia1Activa === true;
    } else if (evIdx === 1) {
      return this.configuracionGdr?.evidencia2Activa === true;
    }
    return false;
  }

  /**
   * Verifica si se puede registrar sustento final
   * @param trabajador El trabajador actual
   */
  puedeRegistrarSustentoFinal(trabajador: any): boolean {
    // Debe tener el formato confirmado
    if (!trabajador.reunionMetas?.confirmado) {
      return false;
    }
    // Verificar evidencia final activa
    return this.configuracionGdr?.evidenciaFinalActiva === true;
  }

  /**
   * Verifica si el botón Registrar Formato debe estar habilitado
   * Condiciones: fase planificación activa + peso total = 100% + al menos 1 prioridad con indicadores
   */
  puedeRegistrarFormato(trabajador: any): boolean {
    // Si ya está confirmado, no se puede volver a registrar
    if (trabajador.reunionMetas?.confirmado) {
      return false;
    }
    
    // Verificar que la fase de planificación esté activa
    if (!this.configuracionGdr?.fasePlanificacionActiva) {
      return false;
    }
    
    // Verificar que tenga prioridades con indicadores
    if (!trabajador.listPrioridad || trabajador.listPrioridad.length === 0) {
      return false;
    }
    
    // Verificar que el peso total sea 100%
    const pesoTotal = this.calcularPesoTotal(trabajador);
    return pesoTotal === 100;
  }

  /**
   * Obtiene el tooltip para el botón Registrar Formato
   */
  getTooltipRegistrarFormato(trabajador: any): string {
    if (trabajador.reunionMetas?.confirmado) {
      return 'Formato ya registrado';
    }
    
    // Verificar fase de planificación
    if (!this.configuracionGdr?.fasePlanificacionActiva) {
      return 'La fase de PLANIFICACIÓN no está activa';
    }
    
    if (!trabajador.listPrioridad || trabajador.listPrioridad.length === 0) {
      return 'Debe agregar al menos una prioridad con indicadores';
    }
    
    const pesoTotal = this.calcularPesoTotal(trabajador);
    if (pesoTotal !== 100) {
      return `El peso total debe ser 100% (actualmente: ${pesoTotal}%)`;
    }
    
    return 'Registrar formato y bloquear edición';
  }

  /**
   * Abre el diálogo de Registrar Formato
   */
  abrirRegistrarFormato(trabajador: any): void {
    const dialogRef = this._dialog.open(RegistrarFormatoComponent, {
      disableClose: true,
      width: '600px',
      maxHeight: '80vh',
      autoFocus: false,
      data: {
        trabajador: trabajador,
        idVotante: trabajador.idVotante,
        idVotanteEvaluador: this.idVotanteEvaluador,
        nombreCompleto: `${trabajador.trabajadorApellido || ''}, ${trabajador.trabajadorNombre || ''}`.trim(),
        periodo: this.periodoActual
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmado) {
        // Actualizar el estado local del trabajador
        if (!trabajador.reunionMetas) {
          trabajador.reunionMetas = {};
        }
        trabajador.reunionMetas.confirmado = true;
        trabajador.reunionMetas.fechaReunion = result.fechaReunion;
        trabajador.reunionMetas.huboReunion = result.huboReunion;
        
        this._notification.success('Formato registrado correctamente. La edición ha sido bloqueada.');
        
        // Recargar los datos para asegurar sincronización
        this.loadTableJefe();
      }
    });
  }
}




