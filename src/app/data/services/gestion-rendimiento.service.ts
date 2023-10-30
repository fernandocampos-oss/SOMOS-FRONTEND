import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { EvidenciaRequest, EvidenciaResponseDTO, LiderEquipoRequest, Personal, Poi, RequerimientoRequest, TipoIngreso, UnidadOrganizativa } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { TareaDTO } from '@data/models/gestion-rendimiento/tarea-model';

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

  // async listarRequerimientoRechazado() {
  //   const url = `${URL_BASE}/requerimientosUsuarios/listar/rechazado`;
  //   console.log(url);
  //   return await this.http.get<Object[]>(url).toPromise();
  // }

  async registrarRequerimiento(requerimiento: RequerimientoRequest) {
    const url = `${URL_BASE}/requerimientosUsuarios/registrar/requerimiento`;
    console.log(url, requerimiento);
    return await this.http.post(url, requerimiento).toPromise();
  }

  async updateRequerimiento(idRequerimiento: number, model: RequerimientoRequest) {
    const url = `${URL_BASE}/requerimientosUsuarios/modificar/requerimiento/${idRequerimiento}`;
    console.log(url, model);
    return await this.http.put(url, model).toPromise();
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

  // rechazarRequerimiento(estado: number, motivo: string, idRequerimientoUsuario: number) {
  //   const url = `${URL_BASE}/requerimientosUsuarios/rechazar?estado=${estado}&motivo=${motivo}&idRequerimientoUsuario=${idRequerimientoUsuario}`;
  //   console.log(url);
  //   return this.http.get<any[]>(url);
  // }

  derivarRequerimiento(estado: number, motivo: string, codUnidadReceptor: string, idRequerimientoUsuario: number) {
    const url = `${URL_BASE}/requerimientosUsuarios/derivar?estado=${estado}&motivo=${motivo}&codUnidadReceptor=${codUnidadReceptor}&idRequerimientoUsuario=${idRequerimientoUsuario}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  async listarPoi() {
    const url = `${URL_BASE}/tareas/listar/pois`;
    console.log(url);
    return await this.http.get<Poi[]>(url).toPromise();
  }

  async listarTodosUnidadOrganizativa() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/unidadOrganizacion`;
    console.log(url);
    return await this.http.get<UnidadOrganizativa[]>(url).toPromise();
  }

  async listarIntegrantesPorLider() {
    const url = `${URL_BASE}/lideres-equipos/listar/equipo`;
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

  //Equipo
  async listarRequerimientosPorPersonal(idUsuario) {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/requerimientos/${idUsuario}/personal`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarPersonalDesdeVotante() {
    // const url = `${URL_BASE}/lideres-equipos/listar/votantes`;
    const url = `${URL_BASE}/requerimientosUsuarios/listar/personal/red`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async eliminarIntegrante(idIntegrante: number) {
    const url = `${URL_BASE}/lideres-equipos/integrante/eliminar?idIntegrante=${idIntegrante}`;
    console.log(url);
    return await this.http.get(url).toPromise();
  }

  async agregarIntegrante(liderEquipoRequest: LiderEquipoRequest) {
    const url = `${URL_BASE}/lideres-equipos/integrante/agregar`;
    console.log(url, liderEquipoRequest);
    return await this.http.post(url, liderEquipoRequest).toPromise();
  }

  // async findUsuarioByNumeroDocumento(numeroDocumento: string) {
  //   const url = `${URL_BASE}/lideres-equipos/obtener/usuario/${numeroDocumento}`;
  //   console.log(url);
  //   return await this.http.get<Object>(url).toPromise();
  // }

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

  async getEvidenciaPorTarea(idTarea: number) {
    const url = `${URL_BASE}/tareas/obtener/evidencia/${idTarea}`;
    console.log(url);
    return await this.http.get<EvidenciaResponseDTO>(url).toPromise();
  }

  async listarTipoIngreso() {
    const url = `${URL_BASE}/tareas/listar/tipoIngreso`;
    console.log(url);
    return await this.http.get<TipoIngreso[]>(url).toPromise();
  }

  async reporteGeneralRequerimientos(anio: number) {
    const url = `${URL_BASE}/requerimientosUsuarios/reporte/excel/anio/${anio}`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarValorMeta() {
    const url = `${URL_BASE}/requerimientosUsuarios/listar/tipoValorMeta`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

}
