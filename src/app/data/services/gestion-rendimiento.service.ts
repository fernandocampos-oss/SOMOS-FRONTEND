import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { ActividadResponse, EmailNotificacionRequestDto, EquipoRequest, EvidenciaResponseDto, EvidenciaSustentoRequestDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { IndicadorExistRequestDto } from '@data/models/gestion-rendimiento/indicador-exist-evidencia.model';
import { PrioridadExistRequestDto } from '@data/models/gestion-rendimiento/prioridad-exist-indicador.model';

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
  async listarActividades() {
    const url = `${URL_BASE}/prioridades/listar/actividades`;
    console.log(url);
    return await this.http.get<ActividadResponse[]>(url).toPromise();
  }

  async listarPrioridadesPrincipal() {
    const url = `${URL_BASE}/prioridades/listar-principal`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async generarExcelDirectivo() {
    const url = `${URL_BASE}/prioridades/excel/directivo`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async sendCorreoNotificacion(dto: EmailNotificacionRequestDto) {
    const url = `${URL_BASE}/prioridades/correo-notificar`;
    console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  //Indicadores
  async asignarPesoIndicador(peso: number, idIndicador: number) {
    const url = `${URL_BASE}/indicadores/asignar/peso/${peso}/indicador/${idIndicador}`;
    console.log(url);
    return await this.http.get<any>(url).toPromise();
  }

  async listarIndicadorPendiente() {
    const url = `${URL_BASE}/indicadores/listar/pendientes`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarTipoValorMeta() {
    const url = `${URL_BASE}/indicadores/listar/tipoValorMeta`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async registrarIndicador(indicadorRequest: any) {
    const url = `${URL_BASE}/indicadores/registrar`;
    console.log(url, indicadorRequest);
    return await this.http.post(url, indicadorRequest).toPromise();
  }

  async updateIndicador(idIndicador: number, model: any) {
    const url = `${URL_BASE}/indicadores/modificar/indicador/${idIndicador}`;
    console.log(url, model);
    return await this.http.put(url, model).toPromise();
  }

  async generarExcelTrabajador() {
    const url = `${URL_BASE}/indicadores/excel/trabajador`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
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

  //evidencias
  async registrarEvidenciaExistIndicador(dto: IndicadorExistRequestDto) {
    const url = `${URL_BASE}/evidencias/registrar/exist-indicador`;
    console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async registrarIndicadorExistPrioridad(dto: PrioridadExistRequestDto) {
    const url = `${URL_BASE}/evidencias/registrar/exist-prioridad`;
    console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async crearSustentoEvidencia(dto: EvidenciaSustentoRequestDto) {
    const url = `${URL_BASE}/evidencias/registrar/sustento`;
    console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async getEvidenciasByIndicador(idIndicador: number,) {
    const url = `${URL_BASE}/evidencias/listar/indicador/${idIndicador}`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async modificarTareaAdministrador(nombre: string, plazo: String, idTarea: number) {
    const url = `${URL_BASE}/evidencias/modificar?nombre=${nombre}&plazo=${plazo}&idTarea=${idTarea}`;
    console.log(url);
    return await this.http.get<any[]>(url).toPromise();
  }

  async getSustentoByEvidencia(idEvidencia: number) {
    const url = `${URL_BASE}/evidencias/obtener/evidencia/${idEvidencia}`;
    console.log(url);
    return await this.http.get<EvidenciaResponseDto>(url).toPromise();
  }

  // aprobarTarea(estado: number, idIndicadorUsuario: number) {
  //   const url = `${URL_BASE}/indicadores-usuarios/aprobar?estado=${estado}&idIndicadorUsuario=${idIndicadorUsuario}`;
  //   console.log(url);
  //   return this.http.get<any[]>(url);
  // }

  // rechazarTarear(estado: number, motivo: string, idIndicadorUsuario: number) {
  //   const url = `${URL_BASE}/indicadores-usuarios/rechazar?estado=${estado}&motivo=${motivo}&idRequerimientoUsuario=${idRequerimientoUsuario}`;
  //   console.log(url);
  //   return this.http.get<any[]>(url);
  // }

}
