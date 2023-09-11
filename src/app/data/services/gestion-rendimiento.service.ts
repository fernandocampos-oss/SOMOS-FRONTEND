import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { EvidenciaRequest, EvidenciaResponseDTO, Personal, Poi, RequerimientoRequest, UnidadOrganizativa } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { TareaDTO, TareaRequest, TareaResponse } from '@data/models/gestion-rendimiento/tarea-model';

const URL_BASE = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class GestionRendimientoService {

  constructor(
    private http: HttpClient
  ) { }

  AgregarPersona(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/equipo/registrarIntegrante/`, data);
  }

  ListarIntegrantes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/listarMisIntegrantes`);
  }

  EliminarIntegrante(id, motivo) {
    return this.http.delete(`${environment.apiUrl}/equipo/eliminarIntegrante/${id}/${motivo}`);
  }

  ListarTareas(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/tarea/listarTareas/${id}`);
  }

  RegistrarTarea(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/tarea/registrar`, data);
  }

  ListarInformes(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/evidencia/listarPorTarea/${id}`);
  }

  RegistrarInforme(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/evidencia/registrar`, data);
  }

  ListarArchivos(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/evidencia/listarArchivosEvidencia/${id}`);
  }

  CargarArchivo(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/evidencia/subirArchivo/`, data);
  }

  EliminarArchivo(id) {
    return this.http.delete(`${environment.apiUrl}/evidencia/eliminarArchivo/${id}`);
  }

  DescargarArchivo(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/archivo/descargar/${id}`);
  }

  AprobarRechazarTarea(data) {
    return this.http.put(`${environment.apiUrl}/tarea/actualizarEstado`, data);
  }

  ListarModalidad(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/listarModalidad`);
  }

  ListarRiesgo(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/listarRiesgo`);
  }

  ListarMisModalidades(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/listarMisModalidades/${id}`);
  }

  ListarMisRiesgos(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/listarMisRiesgos/${id}`);
  }

  RegistrarIntegranteDetalle(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/equipo/registrarIntegranteDetalle`, data);
  }

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  //Requerimientos
  async listarRequerimientoPendiente() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/pendiente`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarRequerimientoFinalizado() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/finalizado`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarRequerimientoRechazado() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/rechazado`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async registrarRequerimiento(requerimiento: RequerimientoRequest) {
    const url = `${URL_BASE}/requerimientosUsuarios/registrar/requerimiento`;
    console.log(url, requerimiento);
    return await this.http.post(url, requerimiento).toPromise();
  }

  async listarRequerimientoPrincipal() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/principal`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  aprobarRequerimiento(estado: number, idRequerimientoUsuario: number) {
    const url = `${URL_BASE}/requerimientosUsuarios/aprobar?estado=${estado}&idRequerimientoUsuario=${idRequerimientoUsuario}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  rechazarRequerimiento(estado: number, motivo: string, idRequerimientoUsuario: number) {
    const url = `${URL_BASE}/requerimientosUsuarios/rechazar?estado=${estado}&motivo=${motivo}&idRequerimientoUsuario=${idRequerimientoUsuario}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  derivarRequerimiento(estado: number, motivo: string, codUnidadReceptor: string, idRequerimientoUsuario: number) {
    const url = `${URL_BASE}/requerimientosUsuarios/derivar?estado=${estado}&motivo=${motivo}&codUnidadReceptor=${codUnidadReceptor}&idRequerimientoUsuario=${idRequerimientoUsuario}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  listarPoi() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/pois`;
    console.log(url);
    return this.http.get<Poi[]>(url);
  }

  async listarTodosUnidadOrganizativa() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/unidadOrganizacion`;
    console.log(url);
    return await this.http.get<UnidadOrganizativa[]>(url).toPromise();
  }

  async listarPersonalUnidad() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/personal`;
    console.log(url);
    return await this.http.get<Personal[]>(url).toPromise();
  }

  async registrarTareas(modelDTO: TareaDTO) {
    const url = `${URL_BASE}/tareas/registrar`;
    console.log(url, modelDTO);
    return await this.http.post(url, modelDTO).toPromise();
  }

  async modificarTareaAdministrador(nombreTarea: string, plazo: String, idTarea: number) {
    const url = `${URL_BASE}/tareas/modificar?nombreTarea=${nombreTarea}&plazo=${plazo}&idTarea=${idTarea}`;
    console.log(url);
    return await this.http.get<any[]>(url).toPromise();
  }

  //Equipos
  async listarRequerimientosPorPersonal(idUsuario) {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/requerimientos/${idUsuario}/personal`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarPersonalGeneral() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/personal/general`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async eliminarIntegranteUnidad(idUsuario: number) {
    const url = `${URL_BASE}/requerimientosUsuarios/integrante/eliminar?idUsuario=${idUsuario}`;
    console.log(url);
    return await this.http.get(url).toPromise();
  }

  async agregarIntegrante(idUsuario: number) {
    const url = `${URL_BASE}/requerimientosUsuarios/integrante/agregar?idUsuario=${idUsuario}`;
    console.log(url);
    return await this.http.get(url).toPromise();
  }

  finalizarTareaAdministrador(idRequerimientoUsuario: number) {
    const url = `${URL_BASE}/requerimientosUsuarios/finalizar/requerimiento?idRequerimientoUsuario=${idRequerimientoUsuario}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  async registrarEvidencia(evidencia: EvidenciaRequest) {
    const url = `${URL_BASE}/tareas/registrar/evidencia`;
    console.log(url, evidencia);
    return await this.http.post(url, evidencia).toPromise();
  }

  async getListarEvidenciasTarea(idTarea: number) {
    const url = `${URL_BASE}/tareas/listar/evidencias/${idTarea}`;
    console.log(url);
    return await this.http.get<EvidenciaResponseDTO[]>(url).toPromise();
  }

  // eliminarArchivo(estado: boolean, idEvidenciaArchivo: number) {
  //   return this.http.get(`${URL_BASE}/evidenciasArchivos/eliminar/estado/${estado}/id/${idEvidenciaArchivo}`);
  // }

}
