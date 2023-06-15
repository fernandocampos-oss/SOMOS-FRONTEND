import { PersonalFiltroNombreDTO } from './../models/gestion-rendimiento/personalFiltroNombreDTO';
import { Tarea } from './../models/gestion-rendimiento/tarea';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
// import { Requerimiento, RequerimientoAsignado} from '@data/models/requerimiento/requerimiento.model';
import { Poi } from '@data/models/gestion-rendimiento/poi';
import { TareaDTO } from '@data/models/gestion-rendimiento/tareaDTO';
import { Requerimiento } from '@data/models/gestion-rendimiento/requerimiento';
import { Persona } from '@modules/gestion-rendimiento/components/mi-equipo/dialogs/user-add-delete/user-add-delete.component';
import { Personal } from '@data/models/gestion-rendimiento/personal';

const URL_BASE = `${environment.apiUrlLocal}`;

@Injectable({ providedIn: 'root' })
export class GestionRendimientoService {
  constructor(private http: HttpClient) { }

  reques: Requerimiento[] = [//Tabla Provisional
    // { idRequerimiento: 1,  nombreRequerimiento: 'Hacer informe del SAP Planillas	', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 1', gerenciaSolicitante: 'GPyORH', gerenciaReceptor:'SGSA', estadoRequerimiento: null},
    // { idRequerimiento: 2,  nombreRequerimiento: 'Requerimiento Prueba 1', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 2', gerenciaSolicitante: 'GDP', gerenciaReceptor:'SGSA', estado:'PENDIENTE'},
    // { idRequerimiento: 3,  nombreRequerimiento: 'Requerimiento Prueba 2', tipoRequerimiento:'Problemas de acceso', descripcion: 'Descripcion medianamente larga para el requerimiento 3', gerenciaSolicitante: 'GAP', gerenciaReceptor:'SGSA', estado:'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos'},
    // { idRequerimiento: 4,  nombreRequerimiento: 'Requerimiento Prueba 3', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 4', gerenciaSolicitante: 'GDP', gerenciaReceptor:'SGSA', estado:'APROBADO'},
    // { idRequerimiento: 5,  nombreRequerimiento: 'Requerimiento Prueba 4', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 5', gerenciaSolicitante: 'GAP', gerenciaReceptor:'SGSA', estado:'PENDIENTE'},
    // { idRequerimiento: 6,  nombreRequerimiento: 'Requerimiento Prueba 5', tipoRequerimiento:'Problemas de encendido', descripcion: 'Descripcion medianamente larga para el requerimiento 6', gerenciaSolicitante: 'GAP', gerenciaReceptor:'SGSA', estado:'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos'},
    // { idRequerimiento: 7,  nombreRequerimiento: 'Requerimiento Prueba 6', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 7', gerenciaSolicitante: 'GDP', gerenciaReceptor:'OSI', estado:'APROBADO'},
    // { idRequerimiento: 8,  nombreRequerimiento: 'Requerimiento Prueba 7', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 8', gerenciaSolicitante: 'SGSA', gerenciaReceptor:'SGSA', estado:'EN PROCESO', actividad: 'Implementar los sistemas administrativos', 
    // tareas: [{nombreTarea: 'Creación de documento 1', plazo: '20/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
    //          {nombreTarea: 'Revisión de la documentación', plazo: '26/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
    //          {nombreTarea: 'Implementación de documentación', plazo: '28/05/2023', idPersonaAsignada:'Celia Requena Egas'}]},
    // { idRequerimiento: 9,  nombreRequerimiento: 'Requerimiento Prueba 8', tipoRequerimiento:'Problemas de encendido', descripcion: 'Descripcion medianamente larga para el requerimiento 9', gerenciaSolicitante: 'SGSA', gerenciaReceptora:'SGSA', estado:'EN PROCESO', motivo: 'Requerimiento a atender con Sistemas Administrativos', actividad:'Realizar actividades de soporte operativo y administrativo para garantizar la ejecución presupuestal de la GCTIC', 
    // tareas: [{nombreTarea: 'Creación de documento 2', plazo: '14/06/2023'},
    //          {nombreTarea: 'Creación de documento 4', plazo: '26/06/2023'},
    //          {nombreTarea: 'Implementación de documentación', plazo: '28/06/2023'}]},
    // { idRequerimiento: 10,  nombreRequerimiento: 'Requerimiento Prueba 9', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 10', gerenciaSolicitante: 'SGSA', gerenciaReceptora:'OSI', estado:'EN PROCESO', actividad: 'Implementar los sistemas administrativos', 
    // tareas: [{nombreTarea: 'Creación de documento 3', plazo: '19/05/2023'},
    //          {nombreTarea: 'Revisión de la documentación', plazo: '22/05/2023'},
    //          {nombreTarea: 'Implementación de documentación', plazo: '27/05/2023'}]},
    // { idRequerimiento: 11,  nombreRequerimiento: 'Requerimiento Prueba 10', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 11', gerenciaSolicitante: 'GPyORH', gerenciaReceptora:'SGSA', estado:'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos'},
    // { idRequerimiento: 12,  nombreRequerimiento: 'Requerimiento Prueba 11', tipoRequerimiento:'Errores con programas', descripcion: 'Descripcion medianamente larga para el requerimiento 12', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', motivo: 'No se proporcionó información relevante', actividad: 'Desarrollar y mantener los sistemas administrativos', 
    // tareas: [{nombreTarea: 'Creación de documento 5', plazo: '20/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
    //          {nombreTarea: 'Revisión de la documentación', plazo: '26/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
    //          {nombreTarea: 'Implementación de documentación', plazo: '28/05/2023'}]},
    // { idRequerimiento: 13, nombreRequerimiento: 'Requerimiento Prueba 12', tipoRequerimiento:'Problemas de acceso', descripcion: 'Descripcion medianamente larga para el requerimiento 13', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', actividad: 'Implementar los sistemas administrativos', 
    // tareas: [{nombreTarea: 'Creación de documento 6', plazo: '20/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
    //          {nombreTarea: 'Revisión de la documentación', plazo: '26/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
    //          {nombreTarea: 'Implementación de documentación', plazo: '28/05/2023'}]},
    // { idRequerimiento: 14,  nombreRequerimiento: 'Requerimiento Prueba 13', tipoRequerimiento:'Errores con programas', descripcion: 'Descripcion medianamente larga para el requerimiento 14', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'OSI', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante'},
    // { idRequerimiento: 15, nombreRequerimiento: 'Requerimiento Prueba 14', tipoRequerimiento:'Problemas de acceso', descripcion: 'Descripcion medianamente larga para el requerimiento 15', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'FINALIZADO'},
    // { idRequerimiento: 16, nombreRequerimiento: 'Requerimiento Prueba 15', tipoRequerimiento:'Problemas de acceso', descripcion: 'Descripcion medianamente larga para el requerimiento 16', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', motivo: 'Requerimiento a atender con Sistemas Administrativos', actividad: 'Desarrollar y mantener los sistemas administrativos', 
    // tareas: [{nombreTarea: 'Creación de documento 7', plazo: '20/05/2023'}, 
    //          {nombreTarea: 'Revisión de la documentación', plazo: '26/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
    //          {nombreTarea: 'Implementación de documentación', plazo: '28/05/2023'}]},
    // { idRequerimiento: 17, nombreRequerimiento: 'Requerimiento Prueba 16', tipoRequerimiento:'Errores con programas', descripcion: 'Descripcion medianamente larga para el requerimiento 17', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante'},
    // { idRequerimiento: 18, nombreRequerimiento: 'Requerimiento Prueba 17', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 18', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante'},
    // { idRequerimiento: 19, nombreRequerimiento: 'Requerimiento Prueba 18', tipoRequerimiento:'Errores con programas', descripcion: 'Descripcion medianamente larga para el requerimiento 19', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'APROBADO'},
    // { idRequerimiento: 20, nombreRequerimiento: 'Requerimiento Prueba 19', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 20', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'FINALIZADO'},
  ];

  FauxTablaRequerimientos(): Requerimiento[] {
    return this.reques;
  }

  insertFauxRequerimientos(model: Requerimiento) {
    this.reques.push(model);
  }

  // updateTareasFauxRequerimientos(model: RequerimientoAsignado){
  //   this.reques[model.id-1].actividad = model.actividad;
  //   this.reques[model.id-1].tareas = model.tareas;
  //   this.reques[model.id-1].estado = 'EN PROCESO';
  // }

  // BuscarPersona(data): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/equipo/filtarPersonal/${data}`);
  // }

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

  //Requerimientos
  listarRequerimiento() {
    const url = `${URL_BASE}/requerimientos`;
    console.log(url);
    return this.http.get<Requerimiento[]>(url);
  }

  aprobarRequerimiento(estado: number, idrequerimiento: number) {
    const url = `${URL_BASE}/requerimientos/aprobar?estado=${estado}&idrequerimiento=${idrequerimiento}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  rechazarRequerimiento(estado: number, motivo: string, idrequerimiento: number) {
    const url = `${URL_BASE}/requerimientos/rechazar?estado=${estado}&motivo=${motivo}&idrequerimiento=${idrequerimiento}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  derivarRequerimiento(estado: number, motivo: string, gerenciareceptor: string, idrequerimiento: number) {
    const url = `${URL_BASE}/requerimientos/derivar?estado=${estado}&motivo=${motivo}&gerenciareceptor=${gerenciareceptor}&idrequerimiento=${idrequerimiento}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  //poi
  listarPoi() {
    const url = `${URL_BASE}/pois`;
    console.log(url);
    return this.http.get<Poi[]>(url);
  }

  //tarea
  registrarTareas(tareaDTO: TareaDTO) {
    const url = `${URL_BASE}/tareas/registrar/transaccion`;
    console.log(url, tareaDTO);
    return this.http.post(url, tareaDTO);
  }

  //Equipo
  listarPersonalPorDependenciaAsignado(idDependencia, estadoAsignado) {
    const url = `${URL_BASE}/personal/listar/dependencia/${idDependencia}/estadoAsignado/${estadoAsignado}`;
    console.log(url);
    return this.http.get<Personal[]>(url);
  }

  BuscarPersona(filtroConsulta: PersonalFiltroNombreDTO) {
    const url = `${URL_BASE}/personal/filtrarPersonal/`;
    console.log(url, filtroConsulta);
    return this.http.post<Personal[]>(url, filtroConsulta);
  }

  registrarPersonal(persona): Observable<any> {
    const url = `${URL_BASE}/personal/registrar`;
    console.log(url, persona);
    return this.http.post(`${URL_BASE}/personal/registrar`, persona);
  }

}
