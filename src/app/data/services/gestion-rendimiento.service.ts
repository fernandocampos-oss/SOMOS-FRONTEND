import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { EquipoRequest, IndicadorRequest, Actividad, TipoIngreso, EvidenciaRequestDto, EvidenciaResponseDto, PrioridadDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { TareaRequestDto } from '@data/models/gestion-rendimiento/tarea-model';

const URL_BASE = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class GestionRendimientoService {

  constructor(
    private http: HttpClient
  ) { }

  // AgregarPersona(data): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/equipo/registrarIntegrante/`, data);
  // }

  // ListarIntegrantes(): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/equipo/listarMisIntegrantes`);
  // }

  // EliminarIntegrante(id, motivo) {
  //   return this.http.delete(`${environment.apiUrl}/equipo/eliminarIntegrante/${id}/${motivo}`);
  // }

  // ListarTareas(id): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/tarea/listarTareas/${id}`);
  // }

  // RegistrarTarea(data): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/tarea/registrar`, data);
  // }

  // ListarInformes(id): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/evidencia/listarPorTarea/${id}`);
  // }

  // RegistrarInforme(data): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/evidencia/registrar`, data);
  // }

  // ListarArchivos(id): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/evidencia/listarArchivosEvidencia/${id}`);
  // }

  // CargarArchivo(data): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/evidencia/subirArchivo/`, data);
  // }

  // EliminarArchivo(id) {
  //   return this.http.delete(`${environment.apiUrl}/evidencia/eliminarArchivo/${id}`);
  // }

  // DescargarArchivo(id): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/archivo/descargar/${id}`);
  // }

  // AprobarRechazarTarea(data) {
  //   return this.http.put(`${environment.apiUrl}/tarea/actualizarEstado`, data);
  // }

  // ListarModalidad(): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/equipo/listarModalidad`);
  // }

  // ListarRiesgo(): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/equipo/listarRiesgo`);
  // }

  // ListarMisModalidades(id): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/equipo/listarMisModalidades/${id}`);
  // }

  // ListarMisRiesgos(id): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/equipo/listarMisRiesgos/${id}`);
  // }

  // RegistrarIntegranteDetalle(data): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/equipo/registrarIntegranteDetalle`, data);
  // }

  //Prioridad
  async listarPrioridadesPrincipal() {
    const url = `${URL_BASE}/prioridades/listar-principal`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarIndicadorPrincipal() {
    const url = `${URL_BASE}/prioridades/listar/indicador`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async registrarAsignarPrioridad(prioridadDto: PrioridadDto) {
    const url = `${URL_BASE}/prioridades/actualizar/indicadores`;
    console.log(url, prioridadDto);
    return await this.http.post(url, prioridadDto).toPromise();
  }

  async asignarPesoPrioridad(peso: number, idPrioridad: number) {
    const url = `${URL_BASE}/prioridades/asignar/peso/${peso}/prioridad/${idPrioridad}`;
    console.log(url);
    return await this.http.get<any>(url).toPromise();
  }

  //Indicadores
  async listarIndicadorPendiente() {
    const url = `${URL_BASE}/indicadores/listar/pendientes`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarIndicadorFinalizado() {
    const url = `${URL_BASE}/indicadores/listar/finalizado`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  //tareas
  async getTareasByIdIndicador(idIndicador: number,) {
    const url = `${URL_BASE}/tareas/listar/indicador/${idIndicador}`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  // async listarRequerimientoRechazado() {
  //   const url = `${URL_BASE}/indicadores-usuarios/listar/rechazado`;
  //   console.log(url);
  //   return await this.http.get<Object[]>(url).toPromise();
  // }

  async registrarIndicador(indicadorRequest: IndicadorRequest) {
    const url = `${URL_BASE}/indicadores/registrar`;
    console.log(url, indicadorRequest);
    return await this.http.post(url, indicadorRequest).toPromise();
  }

  async updateIndicador(idIndicador: number, model: IndicadorRequest) {
    const url = `${URL_BASE}/indicadores/modificar/indicador/${idIndicador}`;
    console.log(url, model);
    return await this.http.put(url, model).toPromise();
  }

  // aprobarIndicador(estado: number, idIndicadorUsuario: number) {
  //   const url = `${URL_BASE}/indicadores-usuarios/aprobar?estado=${estado}&idIndicadorUsuario=${idIndicadorUsuario}`;
  //   console.log(url);
  //   return this.http.get<any[]>(url);
  // }

  // rechazarIndicador(estado: number, motivo: string, idIndicadorUsuario: number) {
  //   const url = `${URL_BASE}/indicadores-usuarios/rechazar?estado=${estado}&motivo=${motivo}&idRequerimientoUsuario=${idRequerimientoUsuario}`;
  //   console.log(url);
  //   return this.http.get<any[]>(url);
  // }

  async listarActividades() {
    const url = `${URL_BASE}/prioridades/listar/actividades`;
    console.log(url);
    return await this.http.get<Actividad[]>(url).toPromise();
  }

  // async listarTodosUnidadOrganizativa() {
  //   const url = `${URL_BASE}/indicadores-usuarios/listar/unidadOrganizacion`;
  //   console.log(url);
  //   return await this.http.get<UnidadOrganizativa[]>(url).toPromise();
  // }

  async registrarTareas(tareaRequestDto: TareaRequestDto) {
    const url = `${URL_BASE}/tareas/registrar`;
    console.log(url, tareaRequestDto);
    return await this.http.post(url, tareaRequestDto).toPromise();
  }

  async modificarTareaAdministrador(nombre: string, plazo: String, idTarea: number) {
    const url = `${URL_BASE}/tareas/modificar?nombre=${nombre}&plazo=${plazo}&idTarea=${idTarea}`;
    console.log(url);
    return await this.http.get<any[]>(url).toPromise();
  }

  //Equipo
  async listarIntegrantesPorLider() {
    const url = `${URL_BASE}/equipos/listar`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarVotantes() {
    const url = `${URL_BASE}/equipos/listar/votantes`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async eliminarTrabajador(idEquipo: number) {
    const url = `${URL_BASE}/equipos/eliminar?idEquipo=${idEquipo}`;
    console.log(url);
    return await this.http.get(url).toPromise();
  }

  async registrarTrabajador(equipoRequest: EquipoRequest) {
    const url = `${URL_BASE}/equipos/registrar`;
    console.log(url, equipoRequest);
    return await this.http.post(url, equipoRequest).toPromise();
  }

  async getVotanteByIdUsuario() {
    const url = `${URL_BASE}/equipos/obtener/votante/segmento`;
    console.log(url);
    return await this.http.get<Object>(url).toPromise();
  }

  //Indicador
  finalizarTareaAdministrador(idRequerimientoUsuario: number) {
    const url = `${URL_BASE}/indicadores-usuarios/finalizar/requerimiento?idRequerimientoUsuario=${idRequerimientoUsuario}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  async registrarEvidencia(evidenciaRequestDto: EvidenciaRequestDto) {
    const url = `${URL_BASE}/tareas/registrar/evidencia`;
    console.log(url, evidenciaRequestDto);
    return await this.http.post(url, evidenciaRequestDto).toPromise();
  }

  async getEvidenciaPorTarea(idTarea: number) {
    const url = `${URL_BASE}/tareas/obtener/evidencia/${idTarea}`;
    console.log(url);
    return await this.http.get<EvidenciaResponseDto>(url).toPromise();
  }

  async listarTipoIngreso() {
    const url = `${URL_BASE}/indicadores/listar/tipoIngreso`;
    console.log(url);
    return await this.http.get<TipoIngreso[]>(url).toPromise();
  }

  async reporteGeneralRequerimientos(anio: number) {
    const url = `${URL_BASE}/indicadores-usuarios/reporte/excel/anio/${anio}`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarTipoValorMeta() {
    const url = `${URL_BASE}/indicadores/listar/tipoValorMeta`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

}
