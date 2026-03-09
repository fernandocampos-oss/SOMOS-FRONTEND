import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { ActividadResponse, CargaMasivaVotante, EmailNotificacionRequestDto, EquipoRequest, EvidenciaResponseDto, EvidenciaSustentoRequestDto, VotanteSegmentoVotante } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { IndicadorExistRequestDto } from '@data/models/gestion-rendimiento/indicador-exist-evidencia.model';
import { PrioridadExistRequestDto, UpdatePrioridadDto } from '@data/models/gestion-rendimiento/prioridad-exist-indicador.model';
import { SeguimientoRequestDto } from '@data/models/gestion-rendimiento/reporte-gdr.model';
import { EvidenciaRequest } from '@data/models/gestion-rendimiento/indicador-dto.model';

const URL_BASE = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class GestionRendimientoService {

  constructor(
    private http: HttpClient
  ) { }

  async listarActividades() {
    const url = `${URL_BASE}/prioridades/listar/actividades`;
    // console.log(url);
    return await this.http.get<ActividadResponse[]>(url).toPromise();
  }

  async listarPrioridadesPrincipal() {
    const url = `${URL_BASE}/prioridades/listar-principal`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async generarExcelDirectivo() {
    const url = `${URL_BASE}/prioridades/excel/directivo`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async sendCorreoNotificacion(dto: EmailNotificacionRequestDto) {
    const url = `${URL_BASE}/prioridades/correo-notificar`;
    // console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async listAllUnidadOrganizativa() {
    const url = `${URL_BASE}/prioridades/listar/unidades`;
    return await this.http.get<Object[]>(url).toPromise();
  }

  async reporteGdrSeguimiento(dto: SeguimientoRequestDto) {
    const url = `${URL_BASE}/prioridades/reporte-seguimiento`;
    // console.log(url, dto);
    return await this.http.post<Object[]>(url, dto).toPromise();
  }

  async reporteGdrMatriz(dto: SeguimientoRequestDto) {
    const url = `${URL_BASE}/prioridades/reporte-matriz`;
    // console.log(url, dto);
    return await this.http.post<Object[]>(url, dto).toPromise();
  }

  async modificarPrioridad(id: number, model: UpdatePrioridadDto) {
    const url = `${URL_BASE}/prioridades/modificar/${id}`;
    // console.log(url, model);
    return await this.http.put(url, model).toPromise();
  }

  async listarIndicadorPendiente() {
    const url = `${URL_BASE}/indicadores/listar/pendientes`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listPendientesTrabajadorByVotanteAdmin(idVotante: number) {
    const url = `${URL_BASE}/indicadores/listar/pendientes/admin/${idVotante}`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarTipoValorMeta() {
    const url = `${URL_BASE}/indicadores/listar/tipoValorMeta`;
    const data = await this.http.get<any[]>(url).toPromise();
    return data.filter(item => item.descripcion?.toLowerCase() !== 'promedio');
  }

  async registrarIndicador(indicadorRequest: any) {
    const url = `${URL_BASE}/indicadores/registrar`;
    // console.log(url, indicadorRequest);
    return await this.http.post(url, indicadorRequest).toPromise();
  }

  async modificarIndicador(id: number, model: any) {
    const url = `${URL_BASE}/indicadores/modificar/${id}`;
    // console.log(url, model);
    return await this.http.put(url, model).toPromise();
  }

  async sumaTotalPesoAllIndicadorByTrabajador(idVotante: number) {
    const url = `${URL_BASE}/indicadores/peso-total/${idVotante}`;
    // console.log(url);
    return await this.http.get<number>(url).toPromise();
  }

  async generarExcelTrabajador() {
    const url = `${URL_BASE}/indicadores/excel/trabajador`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarIntegrantesPorLider() {
    const url = `${URL_BASE}/equipos/listar`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarEvaluadorPorLider() {
    const url = `${URL_BASE}/equipos/listar/evaluador`;
    return await this.http.get<{ evaluador: string }>(url).toPromise();
  }

  async listarVotantes() {
    const url = `${URL_BASE}/equipos/listar/votantes`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarEvaluadoresDisponible() {
    const url = `${URL_BASE}/equipos/listar/candidatos/evaluador`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async verificaEvaluador() {
    const url = `${URL_BASE}/equipos/verifica/evaluador`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async eliminarTrabajador(idEquipo: number) {
    const url = `${URL_BASE}/equipos/eliminar?idEquipo=${idEquipo}`;
    // console.log(url);
    return await this.http.get(url).toPromise();
  }

  async registrarTrabajador(equipoRequest: EquipoRequest) {
    const url = `${URL_BASE}/equipos/registrar`;
    // console.log(url, equipoRequest);
    return await this.http.post(url, equipoRequest).toPromise();
  }

  async registrarEvaluador(equipoRequest: EquipoRequest) {
    const url = `${URL_BASE}/equipos/registrar/evaluador`;
    // console.log(url, equipoRequest);
    return await this.http.post(url, equipoRequest).toPromise();
  }

  async getVotanteByIdUsuario() {
    const url = `${URL_BASE}/equipos/obtener/votante/segmento`;
    // console.log(url);
    return await this.http.get<Object>(url).toPromise();
  }

  async findVotanteByNombre(nombre: string) {
    //const url = `${URL_BASE}/equipos/buscar/nombre?nombre=${nombre}`;
    const url = `${URL_BASE}/equipos/buscar/nombre2?nombre=${nombre}`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async findVotanteByDni(dni: string) {
    const url = `${URL_BASE}/equipos/buscar/votante/dni?dni=${dni}`;
    return await this.http.get<any>(url).toPromise();
  }

  async findVotanteById(idVotante: number) {
    const url = `${URL_BASE}/equipos/buscar/votante/id/${idVotante}`;
    return await this.http.get<any>(url).toPromise();
  }

  async registrarEvidenciaExistIndicador(dto: IndicadorExistRequestDto) {
    const url = `${URL_BASE}/evidencias/registrar/exist-indicador`;
    // console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async registrarIndicadorExistPrioridad(dto: PrioridadExistRequestDto) {
    const url = `${URL_BASE}/evidencias/registrar/exist-prioridad`;
    // console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async crearSustentoEvidencia(dto: EvidenciaSustentoRequestDto) {
    const url = `${URL_BASE}/evidencias/registrar/sustento`;
    // console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async getSustentoByEvidencia(id: number) {
    const url = `${URL_BASE}/evidencias/obtener/evidencia/${id}`;
    // console.log(url);
    return await this.http.get<EvidenciaResponseDto>(url).toPromise();
  }
  
  async modificarEvidencia(id: number, model: EvidenciaRequest) {
    const url = `${URL_BASE}/evidencias/modificar/${id}`;
    // console.log(url, model);
    return await this.http.put(url, model).toPromise();
  }

  async deleteEvidenciaById(id: number) {
    const url = `${URL_BASE}/evidencias/eliminar/${id}`;
    return await this.http.delete(url).toPromise();
  }

  async eliminarArchivoEvidencia(id: number) {
    const url = `${URL_BASE}/evidencias/eliminar/sustento/${id}`;
    return await this.http.delete(url).toPromise();
  }

  async deleteIndicadorById(id: number) {
    const url = `${URL_BASE}/indicadores/eliminar/${id}`;
    return await this.http.delete(url).toPromise();
  }

  async deletePrioridadById(id: number) {
    const url = `${URL_BASE}/prioridades/eliminar/${id}`;
    return await this.http.delete(url).toPromise();
  }

  async procesarExcelVotante(personas: CargaMasivaVotante[]) {
    const url = `${URL_BASE}/equipos/carga/excel/votante`;
    // console.log(url, personas);
    return await this.http.post<CargaMasivaVotante[]>(url, personas).toPromise();
  }

  async listarVotantePerfil() {
    const url = `${URL_BASE}/equipos/listar/perfil/votantes`;
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async actualizarSegmentoVotante(id: number, model: VotanteSegmentoVotante) {
    const url = `${URL_BASE}/equipos/modificar/votante/${id}`;
    // console.log(url, model);
    return await this.http.put(url, model).toPromise();
  }

  async actualizarCalificacionEvidencia(id: number, comentario: string, calificacion: number){
    const url = `${URL_BASE}/evidencias/modificar/calificacion`;
    return await this.http.put(url, {'idEvidencia':id,'comentario':comentario, 'calificacion':calificacion}).toPromise();
  }

  // Métodos para sentido de indicadores
  async obtenerSentidoIndicador(idIndicador: number): Promise<any> {
    const url = `${URL_BASE}/gdr/sentido-indicador/${idIndicador}`;
    return await this.http.get(url).toPromise();
  }

  async obtenerSentidosMultiples(idIndicadores: number[]): Promise<any> {
    const url = `${URL_BASE}/gdr/sentido-indicador/batch`;
    const response = await this.http.post(url, idIndicadores).toPromise();
    // console.log('Respuesta del backend (sentidos):', response);
    // console.log('IDs solicitados:', idIndicadores);
    return response;
  }

  // Métodos para tipo de evidencia
  async guardarEvidenciaTipo(idEvidencia: number, idIndicador: number, tipo: string, orden: number): Promise<any> {
    const url = `${URL_BASE}/gdr/evidencia-tipo/guardar`;
    return await this.http.post(url, { idEvidencia, idIndicador, tipo, orden }).toPromise();
  }

  async obtenerEvidenciaTipo(idEvidencia: number): Promise<any> {
    const url = `${URL_BASE}/gdr/evidencia-tipo/obtener/${idEvidencia}`;
    try {
      return await this.http.get(url).toPromise();
    } catch (error: any) {
      // Si es 404, retornar null sin mostrar error (registro aún no existe)
      if (error?.status === 404) {
        return null;
      }
      // Para otros errores, re-lanzar
      throw error;
    }
  }

  async obtenerEvidenciasPorIndicador(idIndicador: number): Promise<any> {
    const url = `${URL_BASE}/gdr/evidencia-tipo/indicador/${idIndicador}`;
    return await this.http.get(url).toPromise();
  }

  async obtenerEvidenciasTipoMultiples(idsEvidencia: number[]): Promise<any> {
    const url = `${URL_BASE}/gdr/evidencia-tipo/batch`;
    return await this.http.post(url, idsEvidencia).toPromise();
  }
  
  async obtenerFechasPlazoFinalPorIndicadores(idsIndicador: number[]): Promise<any> {
    const url = `${URL_BASE}/gdr/evidencia-tipo/fechas-plazo-final`;
    return await this.http.post(url, idsIndicador).toPromise();
  }

  async eliminarEvidenciaTipo(idEvidencia: number): Promise<any> {
    const url = `${URL_BASE}/gdr/evidencia-tipo/eliminar/${idEvidencia}`;
    return await this.http.delete(url).toPromise();
  }

  async reordenarEvidencias(idIndicador: number): Promise<any> {
    const url = `${URL_BASE}/gdr/evidencia-tipo/reordenar/${idIndicador}`;
    return await this.http.post(url, {}).toPromise();
  }

  async actualizarFechaPlazo(idEvidencia: number, idIndicador: number, fechaPlazo: string): Promise<any> {
    const url = `${URL_BASE}/gdr/evidencia-tipo/actualizar-fecha-plazo`;
    return await this.http.post(url, { idEvidencia, idIndicador, fechaPlazo }).toPromise();
  }

  async actualizarFechaPlazoFinal(idIndicador: number, fechaPlazo: string): Promise<any> {
    const url = `${URL_BASE}/gdr/evidencia-tipo/actualizar-fecha-plazo-final/${idIndicador}`;
    return await this.http.post(url, { fechaPlazo }).toPromise();
  }

  // Métodos para comentario estado
  async guardarComentarioEstado(idEvidencia: number, estadoDropdown: string, comentarioAdicional: string, tipoComentario: string = 'individual'): Promise<any> {
    const url = `${URL_BASE}/gdr/comentario-estado/guardar`;
    return await this.http.post(url, { idEvidencia, tipoComentario, estadoDropdown, comentarioAdicional }).toPromise();
  }

  async obtenerComentarioEstado(idEvidencia: number, tipoComentario: string = 'individual'): Promise<any> {
    const url = `${URL_BASE}/gdr/comentario-estado/obtener/${idEvidencia}/${tipoComentario}`;
    return await this.http.get(url).toPromise();
  }

  async obtenerComentariosEstadoMultiples(idsEvidencia: number[]): Promise<any> {
    const url = `${URL_BASE}/gdr/comentario-estado/batch-all`;
    return await this.http.post(url, idsEvidencia).toPromise();
  }

  async eliminarComentarioEstado(idEvidencia: number): Promise<any> {
    const url = `${URL_BASE}/gdr/comentario-estado/eliminar/${idEvidencia}`;
    return await this.http.delete(url).toPromise();
  }

  // Métodos para valor alcanzado prioridad
  async guardarValorAlcanzado(idPrioridad: number, valorAlcanzado: number): Promise<any> {
    const url = `${URL_BASE}/gdr/valor-alcanzado/guardar`;
    return await this.http.post(url, { idPrioridad, valorAlcanzado }).toPromise();
  }

  async obtenerValorAlcanzado(idPrioridad: number): Promise<any> {
    const url = `${URL_BASE}/gdr/valor-alcanzado/obtener/${idPrioridad}`;
    return await this.http.get(url).toPromise();
  }

  async obtenerValoresAlcanzadosMultiples(idsPrioridad: number[]): Promise<any> {
    const url = `${URL_BASE}/gdr/valor-alcanzado/batch`;
    return await this.http.post(url, idsPrioridad).toPromise();
  }

  async eliminarValorAlcanzado(idPrioridad: number): Promise<any> {
    const url = `${URL_BASE}/gdr/valor-alcanzado/eliminar/${idPrioridad}`;
    return await this.http.delete(url).toPromise();
  }

  // ========== Resultados Finales ==========
  async guardarResultadosFinales(idVotante: number, anio: number, rendimientoDistinguido: string, 
                                   accionesCapacitacion: string, otrasAcciones: string, fechaReunion: string): Promise<any> {
    const url = `${URL_BASE}/gdr/resultados-finales/guardar`;
    const body = {
      idVotante,
      anio,
      // Convertir '[Seleccione]' a null antes de enviar
      rendimientoDistinguido: rendimientoDistinguido === '[Seleccione]' ? null : rendimientoDistinguido,
      accionesCapacitacion: accionesCapacitacion || null,
      otrasAcciones: otrasAcciones || null,
      fechaReunion: fechaReunion || null
    };
    return await this.http.post(url, body).toPromise();
  }

  async obtenerResultadosFinales(idVotante: number, anio: number): Promise<any> {
    const url = `${URL_BASE}/gdr/resultados-finales/obtener/${idVotante}/${anio}`;
    try {
      return await this.http.get(url).toPromise();
    } catch (error: any) {
      if (error?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async obtenerResultadosFinalesMultiples(idsVotantes: number[], anio: number): Promise<any> {
    try {
      const url = `${URL_BASE}/gdr/resultados-finales/batch`;
      const body = { idsVotantes, anio };
      return await this.http.post(url, body).toPromise();
    } catch (error) {
      // console.error('Error al obtener resultados finales múltiples:', error);
      return {}; // Retornar objeto vacío en caso de error
    }
  }

  async eliminarResultadosFinales(idVotante: number, anio: number): Promise<any> {
    const url = `${URL_BASE}/gdr/resultados-finales/eliminar/${idVotante}/${anio}`;
    return await this.http.delete(url).toPromise();
  }

  // ============================================
  // MAESTRO GDR - Endpoints
  // ============================================

  async esMaestroGdr(): Promise<any> {
    const url = `${URL_BASE}/maestro-gdr/es-maestro`;
    return await this.http.get(url).toPromise();
  }

  async listarMaestrosGdr(): Promise<any> {
    const url = `${URL_BASE}/maestro-gdr/listar`;
    return await this.http.get(url).toPromise();
  }

  async listarTodosMaestrosGdr(): Promise<any> {
    const url = `${URL_BASE}/maestro-gdr/listar-todos`;
    return await this.http.get(url).toPromise();
  }

  async agregarMaestroGdr(dni: string): Promise<any> {
    const url = `${URL_BASE}/maestro-gdr/agregar`;
    return await this.http.post(url, { dni }).toPromise();
  }

  async desactivarMaestroGdr(dni: string): Promise<any> {
    const url = `${URL_BASE}/maestro-gdr/desactivar/${dni}`;
    return await this.http.put(url, {}).toPromise();
  }

  async activarMaestroGdr(dni: string): Promise<any> {
    const url = `${URL_BASE}/maestro-gdr/activar/${dni}`;
    return await this.http.put(url, {}).toPromise();
  }

  async estadisticasMaestroGdr(): Promise<any> {
    const url = `${URL_BASE}/maestro-gdr/estadisticas`;
    return await this.http.get(url).toPromise();
  }

  // ============================================
  // REUNIÓN ESTABLECIMIENTO DE METAS - Endpoints
  // ============================================

  /**
   * Obtener o crear registro de reunión para la combinación evaluado-evaluador-periodo
   */
  async obtenerOCrearReunionMetas(idVotanteEvaluado: number, idVotanteEvaluador: number, periodo: string): Promise<any> {
    const url = `${URL_BASE}/gdr/reunion-metas/obtener-o-crear`;
    return await this.http.post(url, { idVotanteEvaluado, idVotanteEvaluador, periodo }).toPromise();
  }

  /**
   * Buscar reunión por parámetros
   */
  async buscarReunionMetas(idVotanteEvaluado: number, idVotanteEvaluador: number, periodo: string): Promise<any> {
    const url = `${URL_BASE}/gdr/reunion-metas/buscar?idVotanteEvaluado=${idVotanteEvaluado}&idVotanteEvaluador=${idVotanteEvaluador}&periodo=${periodo}`;
    return await this.http.get(url).toPromise();
  }

  /**
   * Actualizar asistencia de la reunión
   * @param asistio '-' = No seleccionado, 'S' = Sí asistió, 'N' = No asistió
   * @param fechaReunion Solo obligatorio si asistio = 'S'
   */
  async actualizarAsistenciaReunion(idReunion: number, asistio: string, fechaReunion?: string): Promise<any> {
    const url = `${URL_BASE}/gdr/reunion-metas/${idReunion}/asistencia`;
    return await this.http.put(url, { asistio, fechaReunion }).toPromise();
  }

  /**
   * Confirmar la reunión (bloquea edición)
   */
  async confirmarReunionMetas(idReunion: number): Promise<any> {
    const url = `${URL_BASE}/gdr/reunion-metas/${idReunion}/confirmar`;
    return await this.http.put(url, {}).toPromise();
  }

  /**
   * Reiniciar confirmación (solo Maestro GDR)
   */
  async reiniciarConfirmacionReunion(idReunion: number, dniMaestroGdr: string): Promise<any> {
    const url = `${URL_BASE}/gdr/reunion-metas/${idReunion}/reiniciar`;
    return await this.http.put(url, { dniMaestroGdr }).toPromise();
  }

  /**
   * Buscar reuniones de un evaluado (para Maestro GDR)
   */
  async buscarReunionesMetasPorEvaluado(idVotanteEvaluado: number, periodo: string): Promise<any[]> {
    const url = `${URL_BASE}/gdr/reunion-metas/por-evaluado?idVotanteEvaluado=${idVotanteEvaluado}&periodo=${periodo}`;
    return await this.http.get<any[]>(url).toPromise() || [];
  }

  /**
   * Verificar si ya está confirmado
   */
  async estaConfirmadaReunion(idVotanteEvaluado: number, idVotanteEvaluador: number, periodo: string): Promise<any> {
    const url = `${URL_BASE}/gdr/reunion-metas/esta-confirmado?idVotanteEvaluado=${idVotanteEvaluado}&idVotanteEvaluador=${idVotanteEvaluador}&periodo=${periodo}`;
    return await this.http.get(url).toPromise();
  }

  // ============================================
  // CONFIGURACIÓN GDR - Fases y Evidencias
  // ============================================

  /**
   * Obtener o crear configuración GDR para un periodo
   */
  async obtenerConfiguracionGdr(periodo: string): Promise<any> {
    const url = `${URL_BASE}/gdr/configuracion/${periodo}`;
    return await this.http.get(url).toPromise();
  }

  /**
   * Actualizar configuración de fases
   */
  async actualizarFasesGdr(periodo: string, fases: {
    fasePreActiva: boolean,
    fasePlanificacionActiva: boolean,
    faseSeguimientoActiva: boolean,
    faseEvaluacionActiva: boolean,
    fasePostActiva: boolean
  }): Promise<any> {
    const url = `${URL_BASE}/gdr/configuracion/${periodo}/fases`;
    return await this.http.put(url, fases).toPromise();
  }

  /**
   * Actualizar configuración de evidencias
   */
  async actualizarEvidenciasGdr(periodo: string, evidencias: {
    evidencia1Activa: boolean,
    evidencia2Activa: boolean,
    evidenciaFinalActiva: boolean
  }): Promise<any> {
    const url = `${URL_BASE}/gdr/configuracion/${periodo}/evidencias`;
    return await this.http.put(url, evidencias).toPromise();
  }

  /**
   * Actualizar configuración completa
   */
  async actualizarConfiguracionGdr(periodo: string, config: any): Promise<any> {
    const url = `${URL_BASE}/gdr/configuracion/${periodo}`;
    return await this.http.put(url, config).toPromise();
  }

  /**
   * Verificar si una fase está activa
   */
  async esFaseActiva(periodo: string, fase: string): Promise<boolean> {
    const url = `${URL_BASE}/gdr/configuracion/${periodo}/fase/${fase}`;
    return await this.http.get<boolean>(url).toPromise() || false;
  }

  /**
   * Verificar si una evidencia está activa
   */
  async esEvidenciaActiva(periodo: string, numero: number): Promise<boolean> {
    const url = `${URL_BASE}/gdr/configuracion/${periodo}/evidencia/${numero}`;
    return await this.http.get<boolean>(url).toPromise() || false;
  }

  // ============================================
  // DASHBOARD DE AVANCE GDR
  // ============================================

  /**
   * Obtener dashboard de avance GDR
   * @param request Filtros: anio, listCodRed, codUnidad, tipoAgrupacion (PERSONA, UNIDAD, ORGANO), allRed
   */
  async obtenerDashboardAvance(request: {
    anio: string,
    listCodRed?: string[],
    codUnidad?: string,
    tipoAgrupacion: string,
    allRed?: boolean
  }): Promise<any[]> {
    const url = `${URL_BASE}/gdr/dashboard/avance`;
    return await this.http.post<any[]>(url, request).toPromise() || [];
  }

  /**
   * Exportar dashboard de avance a Excel
   * @param request Filtros para el dashboard
   */
  async exportarDashboardExcel(request: {
    anio: string,
    listCodRed?: string[],
    codUnidad?: string,
    tipoAgrupacion: string,
    allRed?: boolean
  }): Promise<Blob> {
    const url = `${URL_BASE}/gdr/dashboard/avance/excel`;
    return await this.http.post(url, request, { responseType: 'blob' }).toPromise() as Blob;
  }

  // ==================== GESTIÓN DE EVALUADORES ====================

  /**
   * Listar evaluadores paginado (id_segmento = 3)
   */
  async listarEvaluadores(page: number = 0, size: number = 50, filtro: string = '', soloConTrabajadores: boolean = false): Promise<any> {
    let url = `${URL_BASE}/gdr/evaluadores/listar?page=${page}&size=${size}&filtro=${filtro}`;
    if (soloConTrabajadores) {
      url += '&soloConTrabajadores=true';
    }
    return await this.http.get(url).toPromise();
  }

  /**
   * Buscar trabajador por DNI para agregar como evaluador
   */
  async buscarTrabajadorParaEvaluador(dni: string): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/buscar/${dni}`;
    return await this.http.get(url).toPromise();
  }

  /**
   * Agregar un evaluador individual
   */
  async agregarEvaluador(dni: string): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/agregar/${dni}`;
    return await this.http.post(url, {}).toPromise();
  }

  /**
   * Validar carga masiva de evaluadores (preview)
   */
  async validarCargaMasivaEvaluadores(dnis: string[]): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/carga-masiva/validar`;
    return await this.http.post(url, { dnis }).toPromise();
  }

  /**
   * Confirmar carga masiva de evaluadores
   */
  async confirmarCargaMasivaEvaluadores(dnis: string[]): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/carga-masiva/confirmar`;
    return await this.http.post(url, { dnis }).toPromise();
  }

  /**
   * Cambiar segmento de un evaluador (quitar rol)
   */
  async cambiarSegmentoEvaluador(idVotante: number, nuevoSegmento: number): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/cambiar-segmento`;
    return await this.http.put(url, { idVotante, nuevoSegmento }).toPromise();
  }

  /**
   * Exportar lista de evaluadores a Excel
   */
  async exportarEvaluadoresExcel(): Promise<Blob> {
    const url = `${URL_BASE}/gdr/evaluadores/exportar-excel`;
    return await this.http.get(url, { responseType: 'blob' }).toPromise() as Blob;
  }

  // ==================== ASIGNAR TRABAJADORES ====================

  /**
   * Listar trabajadores asignados a un evaluador
   */
  async listarTrabajadoresPorEvaluador(idEvaluador: number): Promise<any[]> {
    const url = `${URL_BASE}/gdr/evaluadores/${idEvaluador}/trabajadores`;
    return await this.http.get(url).toPromise() as any[];
  }

  /**
   * Buscar trabajador por DNI para asignar
   */
  async buscarTrabajadorParaAsignar(idEvaluador: number, dni: string): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/${idEvaluador}/buscar-trabajador/${dni}`;
    return await this.http.get(url).toPromise();
  }

  /**
   * Asignar trabajador a evaluador
   */
  async asignarTrabajador(idEvaluador: number, dniTrabajador: string): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/${idEvaluador}/asignar/${dniTrabajador}`;
    return await this.http.post(url, {}).toPromise();
  }

  /**
   * Desasignar trabajador de evaluador
   */
  async desasignarTrabajador(idEquipo: number): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/trabajador/${idEquipo}`;
    return await this.http.delete(url).toPromise();
  }

  /**
   * Validar carga masiva de asignaciones trabajadores
   */
  async validarCargaMasivaTrabajadores(filas: string[][]): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/trabajadores/carga-masiva/validar`;
    return await this.http.post(url, { filas }).toPromise();
  }

  /**
   * Confirmar carga masiva de asignaciones trabajadores
   */
  async confirmarCargaMasivaTrabajadores(filas: string[][]): Promise<any> {
    const url = `${URL_BASE}/gdr/evaluadores/trabajadores/carga-masiva/confirmar`;
    return await this.http.post(url, { filas }).toPromise();
  }
}
