import { Tarea } from './../models/gestion-rendimiento/tarea';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { Requerimiento, RequerimientoAsignado} from '@data/models/requerimiento/requerimiento.model';
import { Poi } from '@data/models/gestion-rendimiento/poi';
import { TareaDTO } from '@data/models/gestion-rendimiento/tareaDTO';

@Injectable({ providedIn: 'root' })
export class GestionRendimientoService {
  constructor(private http: HttpClient) {}

  reques: Requerimiento[] = [//Tabla Provisional
    { id: 1,  nombreRequerimiento: 'Hacer informe del SAP Planillas	', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 1', gerenciaSolicitante: 'GPyORH', gerenciaReceptora:'SGSA', estado:'APROBADO'},
    { id: 2,  nombreRequerimiento: 'Requerimiento Prueba 1', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 2', gerenciaSolicitante: 'GDP', gerenciaReceptora:'SGSA', estado:'PENDIENTE'},
    { id: 3,  nombreRequerimiento: 'Requerimiento Prueba 2', tipoRequerimiento:'Problemas de acceso', descripcion: 'Descripcion medianamente larga para el requerimiento 3', gerenciaSolicitante: 'GAP', gerenciaReceptora:'SGSA', estado:'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos'},
    { id: 4,  nombreRequerimiento: 'Requerimiento Prueba 3', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 4', gerenciaSolicitante: 'GDP', gerenciaReceptora:'SGSA', estado:'APROBADO'},
    { id: 5,  nombreRequerimiento: 'Requerimiento Prueba 4', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 5', gerenciaSolicitante: 'GAP', gerenciaReceptora:'SGSA', estado:'PENDIENTE'},
    { id: 6,  nombreRequerimiento: 'Requerimiento Prueba 5', tipoRequerimiento:'Problemas de encendido', descripcion: 'Descripcion medianamente larga para el requerimiento 6', gerenciaSolicitante: 'GAP', gerenciaReceptora:'SGSA', estado:'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos'},
    { id: 7,  nombreRequerimiento: 'Requerimiento Prueba 6', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 7', gerenciaSolicitante: 'GDP', gerenciaReceptora:'OSI', estado:'APROBADO'},
    { id: 8,  nombreRequerimiento: 'Requerimiento Prueba 7', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 8', gerenciaSolicitante: 'SGSA', gerenciaReceptora:'SGSA', estado:'EN PROCESO', actividad: 'Implementar los sistemas administrativos', 
    tareas: [{nombreTarea: 'Creación de documento 1', plazo: '20/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
             {nombreTarea: 'Revisión de la documentación', plazo: '26/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
             {nombreTarea: 'Implementación de documentación', plazo: '28/05/2023', idPersonaAsignada:'Celia Requena Egas'}]},
    { id: 9,  nombreRequerimiento: 'Requerimiento Prueba 8', tipoRequerimiento:'Problemas de encendido', descripcion: 'Descripcion medianamente larga para el requerimiento 9', gerenciaSolicitante: 'SGSA', gerenciaReceptora:'SGSA', estado:'EN PROCESO', motivo: 'Requerimiento a atender con Sistemas Administrativos', actividad:'Realizar actividades de soporte operativo y administrativo para garantizar la ejecución presupuestal de la GCTIC', 
    tareas: [{nombreTarea: 'Creación de documento 2', plazo: '14/06/2023'},
             {nombreTarea: 'Creación de documento 4', plazo: '26/06/2023'},
             {nombreTarea: 'Implementación de documentación', plazo: '28/06/2023'}]},
    { id: 10,  nombreRequerimiento: 'Requerimiento Prueba 9', tipoRequerimiento:'Elaboración de Documento', descripcion: 'Descripcion medianamente larga para el requerimiento 10', gerenciaSolicitante: 'SGSA', gerenciaReceptora:'OSI', estado:'EN PROCESO', actividad: 'Implementar los sistemas administrativos', 
    tareas: [{nombreTarea: 'Creación de documento 3', plazo: '19/05/2023'},
             {nombreTarea: 'Revisión de la documentación', plazo: '22/05/2023'},
             {nombreTarea: 'Implementación de documentación', plazo: '27/05/2023'}]},
    { id: 11,  nombreRequerimiento: 'Requerimiento Prueba 10', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 11', gerenciaSolicitante: 'GPyORH', gerenciaReceptora:'SGSA', estado:'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos'},
    { id: 12,  nombreRequerimiento: 'Requerimiento Prueba 11', tipoRequerimiento:'Errores con programas', descripcion: 'Descripcion medianamente larga para el requerimiento 12', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', motivo: 'No se proporcionó información relevante', actividad: 'Desarrollar y mantener los sistemas administrativos', 
    tareas: [{nombreTarea: 'Creación de documento 5', plazo: '20/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
             {nombreTarea: 'Revisión de la documentación', plazo: '26/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
             {nombreTarea: 'Implementación de documentación', plazo: '28/05/2023'}]},
    { id: 13, nombreRequerimiento: 'Requerimiento Prueba 12', tipoRequerimiento:'Problemas de acceso', descripcion: 'Descripcion medianamente larga para el requerimiento 13', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', actividad: 'Implementar los sistemas administrativos', 
    tareas: [{nombreTarea: 'Creación de documento 6', plazo: '20/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
             {nombreTarea: 'Revisión de la documentación', plazo: '26/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
             {nombreTarea: 'Implementación de documentación', plazo: '28/05/2023'}]},
    { id: 14,  nombreRequerimiento: 'Requerimiento Prueba 13', tipoRequerimiento:'Errores con programas', descripcion: 'Descripcion medianamente larga para el requerimiento 14', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'OSI', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante'},
    { id: 15, nombreRequerimiento: 'Requerimiento Prueba 14', tipoRequerimiento:'Problemas de acceso', descripcion: 'Descripcion medianamente larga para el requerimiento 15', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'FINALIZADO'},
    { id: 16, nombreRequerimiento: 'Requerimiento Prueba 15', tipoRequerimiento:'Problemas de acceso', descripcion: 'Descripcion medianamente larga para el requerimiento 16', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', motivo: 'Requerimiento a atender con Sistemas Administrativos', actividad: 'Desarrollar y mantener los sistemas administrativos', 
    tareas: [{nombreTarea: 'Creación de documento 7', plazo: '20/05/2023'}, 
             {nombreTarea: 'Revisión de la documentación', plazo: '26/05/2023', idPersonaAsignada:'Leandro Zarsosa Manuel'},
             {nombreTarea: 'Implementación de documentación', plazo: '28/05/2023'}]},
    { id: 17, nombreRequerimiento: 'Requerimiento Prueba 16', tipoRequerimiento:'Errores con programas', descripcion: 'Descripcion medianamente larga para el requerimiento 17', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante'},
    { id: 18, nombreRequerimiento: 'Requerimiento Prueba 17', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 18', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante'},
    { id: 19, nombreRequerimiento: 'Requerimiento Prueba 18', tipoRequerimiento:'Errores con programas', descripcion: 'Descripcion medianamente larga para el requerimiento 19', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'APROBADO'},
    { id: 20, nombreRequerimiento: 'Requerimiento Prueba 19', tipoRequerimiento:'Problemas con Plataforma', descripcion: 'Descripcion medianamente larga para el requerimiento 20', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'FINALIZADO'},
  ];

  FauxTablaRequerimientos(): Requerimiento[]{
    return this.reques;
  }

  insertFauxRequerimientos(model: Requerimiento){
    this.reques.push(model);
  }

  updateTareasFauxRequerimientos(model: RequerimientoAsignado){
    this.reques[model.id-1].actividad = model.actividad;
    this.reques[model.id-1].tareas = model.tareas;
    this.reques[model.id-1].estado = 'EN PROCESO';
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  BuscarPersona(data): Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/filtarPersonal/${data}`);
  }

  AgregarPersona(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/equipo/registrarIntegrante/`,data);
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
    return this.http.post(`${environment.apiUrl}/tarea/registrar`,data);
  }

  ListarInformes(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/evidencia/listarPorTarea/${id}`);
  }

  RegistrarInforme(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/evidencia/registrar`,data);
  }

  ListarArchivos(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/evidencia/listarArchivosEvidencia/${id}`);
  }

  CargarArchivo(data):Observable<any> {
    return this.http.post(`${environment.apiUrl}/evidencia/subirArchivo/`,data);
  }

  EliminarArchivo(id){
    return this.http.delete(`${environment.apiUrl}/evidencia/eliminarArchivo/${id}`);
  }

  DescargarArchivo(id):Observable<any> {
    return this.http.get(`${environment.apiUrl}/archivo/descargar/${id}`);
  }

  AprobarRechazarTarea(data){
    return this.http.put(`${environment.apiUrl}/tarea/actualizarEstado`,data);
  }

  ListarModalidad():Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/listarModalidad`);
  }

  ListarRiesgo():Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/listarRiesgo`);
  }

  ListarMisModalidades(id):Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/listarMisModalidades/${id}`);
  }

  ListarMisRiesgos(id):Observable<any> {
    return this.http.get(`${environment.apiUrl}/equipo/listarMisRiesgos/${id}`);
  }

  RegistrarIntegranteDetalle(data):Observable<any> {
    return this.http.post(`${environment.apiUrl}/equipo/registrarIntegranteDetalle`,data);
  }

  //acciones requerimientos
  listarRequerimiento() {
    console.log(`${environment.apiUrlGestionRendimiento}/requerimientos`);
    return this.http.get<Requerimiento[]>(`${environment.apiUrlGestionRendimiento}/requerimientos`);
  }
  
  aprobarRequerimiento(estado: number, idrequerimiento: number) {
    console.log(`${environment.apiUrlGestionRendimiento}/requerimientos/aprobar?estado=${estado}&idrequerimiento=${idrequerimiento}`);
    return this.http.get<any[]>(`${environment.apiUrlGestionRendimiento}/requerimientos/aprobar?estado=${estado}&idrequerimiento=${idrequerimiento}`);
  }

  rechazarRequerimiento(estado: number, motivo: string, idrequerimiento: number) {
    console.log(`${environment.apiUrlGestionRendimiento}/requerimientos/rechazar?estado=${estado}&motivo=${motivo}&idrequerimiento=${idrequerimiento}`);
    return this.http.get<any[]>(`${environment.apiUrlGestionRendimiento}/requerimientos/rechazar?estado=${estado}&motivo=${motivo}&idrequerimiento=${idrequerimiento}`);
  }

  derivarRequerimiento(estado: number, motivo: string, gerenciareceptor: string,idrequerimiento: number) {
    console.log(`${environment.apiUrlGestionRendimiento}/requerimientos/derivar?estado=${estado}&motivo=${motivo}&gerenciareceptor=${gerenciareceptor}&idrequerimiento=${idrequerimiento}`);
    return this.http.get<any[]>(`${environment.apiUrlGestionRendimiento}/requerimientos/derivar?estado=${estado}&motivo=${motivo}&gerenciareceptor=${gerenciareceptor}&idrequerimiento=${idrequerimiento}`);
  }

  //acciones poi
  listarPoi() {
    console.log(`${environment.apiUrlGestionRendimiento}/pois`);
    return this.http.get<Poi[]>(`${environment.apiUrlGestionRendimiento}/pois`);
  }

  //acciones tarea
  registrarTareas(tareaDTO: TareaDTO) {
    console.log(`${environment.apiUrlGestionRendimiento}/tareas/registrar/transaccion`, tareaDTO);
    return this.http.post(`${environment.apiUrlGestionRendimiento}/tareas/registrar/transaccion`, tareaDTO);
  }
  
}
