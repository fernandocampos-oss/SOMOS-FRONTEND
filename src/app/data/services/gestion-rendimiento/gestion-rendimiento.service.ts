import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    // console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
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
    console.log(url, personas);
    return await this.http.post<CargaMasivaVotante[]>(url, personas).toPromise();
  }

  async listarVotantePerfil() {
    const url = `${URL_BASE}/equipos/listar/perfil/votantes`;
    console.log(url);
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
    console.log('Respuesta del backend (sentidos):', response);
    console.log('IDs solicitados:', idIndicadores);
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

  // Métodos para comentario estado
  async guardarComentarioEstado(idEvidencia: number, estadoDropdown: string, comentarioAdicional: string): Promise<any> {
    const url = `${URL_BASE}/gdr/comentario-estado/guardar`;
    return await this.http.post(url, { idEvidencia, estadoDropdown, comentarioAdicional }).toPromise();
  }

  async obtenerComentarioEstado(idEvidencia: number): Promise<any> {
    const url = `${URL_BASE}/gdr/comentario-estado/obtener/${idEvidencia}`;
    return await this.http.get(url).toPromise();
  }

  async obtenerComentariosEstadoMultiples(idsEvidencia: number[]): Promise<any> {
    const url = `${URL_BASE}/gdr/comentario-estado/batch`;
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
      rendimientoDistinguido,
      accionesCapacitacion,
      otrasAcciones,
      fechaReunion
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
      console.error('Error al obtener resultados finales múltiples:', error);
      return {}; // Retornar objeto vacío en caso de error
    }
  }

  async eliminarResultadosFinales(idVotante: number, anio: number): Promise<any> {
    const url = `${URL_BASE}/gdr/resultados-finales/eliminar/${idVotante}/${anio}`;
    return await this.http.delete(url).toPromise();
  }
}

