import { Tarea } from './../models/gestion-rendimiento/tarea';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { Equipo, Requerimiento, Requerimiento_Integrante} from '@data/models/requerimiento/requerimiento.model';
import { Poi } from '@data/models/gestion-rendimiento/poi';
import { TareaDTO } from '@data/models/gestion-rendimiento/tareaDTO';

@Injectable({ providedIn: 'root' })
export class GestionRendimientoService {
  constructor(private http: HttpClient) {}

  equipo: Equipo[] = [//Tabla Provisional
  { id: 1, nombrePersona: 'Luis Lopez Gutierrez', cargo: 'Analista de costos'},
  { id: 2, nombrePersona: 'Leandro Zarsosa Manuel', cargo: 'Analista de procesos'},
  { id: 3, nombrePersona: 'Celia Requena Egas', cargo: 'Administrador de BD'},
  { id: 4, nombrePersona: 'Elder Lizana Rodriguez', cargo: 'Tester QA'},
  { id: 5, nombrePersona: 'Maria Lopez Uribe', cargo: 'Analista funcional'},
  ];

  requesAsociados: Requerimiento_Integrante[] = [
  {idReq: 8, idIntegrante: 1, nombreTarea: 'Prueba de tarea 1', plazo: '27/5/2023', estado: 'PENDIENTE', avance: 0},
  {idReq: 8, idIntegrante: 3, nombreTarea: 'Prueba de tarea 2', plazo: '28/5/2023', estado: 'PENDIENTE', avance: 20},
  {idReq: 9, idIntegrante: 4, nombreTarea: 'Prueba de tarea 3', plazo: '29/5/2023', estado: 'PENDIENTE', avance: 0},
  {idReq: 9, idIntegrante: 5, nombreTarea: 'Prueba de tarea 4', plazo: '30/5/2023', estado: 'PENDIENTE', avance: 40},
  {idReq: 10, idIntegrante: 1, nombreTarea: 'Prueba de tarea 5', plazo: '31/5/2023', estado: 'PENDIENTE', avance: 0},
  {idReq: 10, idIntegrante: 2, nombreTarea: 'Prueba de tarea 6', plazo: '1/6/2023', estado: 'PENDIENTE', avance: 60},
  {idReq: 10, idIntegrante: 5, nombreTarea: 'Prueba de tarea 7', plazo: '2/6/2023', estado: 'PENDIENTE', avance: 40},
  {idReq: 12, idIntegrante: 3, nombreTarea: 'Prueba de tarea 8', plazo: '3/6/2023', estado: 'PENDIENTE', avance: 0},
  {idReq: 12, idIntegrante: 1, nombreTarea: 'Prueba de tarea 9', plazo: '4/6/2023', estado: 'PENDIENTE', avance: 10},
  {idReq: 13, idIntegrante: 4, nombreTarea: 'Prueba de tarea 10', plazo: '5/6/2023', estado: 'PENDIENTE', avance: 0},
  {idReq: 13, idIntegrante: 2, nombreTarea: 'Prueba de tarea 11', plazo: '6/6/2023', estado: 'PENDIENTE', avance: 60},
  {idReq: 16, idIntegrante: 4, nombreTarea: 'Prueba de tarea 12', plazo: '7/6/2023', estado: 'PENDIENTE', avance: 0},
  ];
  
  reques: Requerimiento[] = [//Tabla Provisional
    { id: 1,  nombreRequerimiento: 'Hacer informe del SAP Planillas	', descripcion: 'Descripcion medianamente larga para el requerimiento 1',  medio: 'Correo', documentoIdentificador: 'DOC-NN1',gerenciaSolicitante: 'GPyORH', gerenciaReceptora:'SGSA', estado:'APROBADO'},
    { id: 2,  nombreRequerimiento: 'Requerimiento Prueba 1', descripcion: 'Descripcion medianamente larga para el requerimiento 2',  medio: 'Reunión', documentoIdentificador: 'DOC-NN2',gerenciaSolicitante: 'GDP', gerenciaReceptora:'SGSA', estado:'PENDIENTE'},
    { id: 3,  nombreRequerimiento: 'Requerimiento Prueba 2', descripcion: 'Descripcion medianamente larga para el requerimiento 3',  medio: 'Correo', documentoIdentificador: 'DOC-NN3',gerenciaSolicitante: 'GAP', gerenciaReceptora:'SGSA', estado:'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos'},
    { id: 4,  nombreRequerimiento: 'Requerimiento Prueba 3', descripcion: 'Descripcion medianamente larga para el requerimiento 4',  medio: 'Llamada', documentoIdentificador: 'DOC-NN4',gerenciaSolicitante: 'GDP', gerenciaReceptora:'SGSA', estado:'APROBADO'},
    { id: 5,  nombreRequerimiento: 'Requerimiento Prueba 4', descripcion: 'Descripcion medianamente larga para el requerimiento 5',  medio: 'Correo', documentoIdentificador: 'DOC-NN5',gerenciaSolicitante: 'GAP', gerenciaReceptora:'SGSA', estado:'PENDIENTE'},
    { id: 6,  nombreRequerimiento: 'Requerimiento Prueba 5', descripcion: 'Descripcion medianamente larga para el requerimiento 6',  medio: 'Llamada', documentoIdentificador: 'DOCDOC-NN6',gerenciaSolicitante: 'GAP', gerenciaReceptora:'SGSA', estado:'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos'},
    { id: 7,  nombreRequerimiento: 'Requerimiento Prueba 6', descripcion: 'Descripcion medianamente larga para el requerimiento 7',  medio: 'Reunión', documentoIdentificador: 'DOC-NN7',gerenciaSolicitante: 'GDP', gerenciaReceptora:'OSI', estado:'APROBADO'},
    { id: 8,  nombreRequerimiento: 'Requerimiento Prueba 7', descripcion: 'Descripcion medianamente larga para el requerimiento 8',  medio: 'Correo', documentoIdentificador: 'DOC-NN8',gerenciaSolicitante: 'SGSA', gerenciaReceptora:'SGSA', estado:'EN PROCESO', actividad: 'Implementar los sistemas administrativos'},
    { id: 9,  nombreRequerimiento: 'Requerimiento Prueba 8', descripcion: 'Descripcion medianamente larga para el requerimiento 9',  medio: 'Correo', documentoIdentificador: 'DOC-NN9',gerenciaSolicitante: 'SGSA', gerenciaReceptora:'SGSA', estado:'EN PROCESO', motivo: 'Requerimiento a atender con Sistemas Administrativos', actividad:'Realizar actividades de soporte operativo y administrativo para garantizar la ejecución presupuestal de la GCTIC'},
    { id: 10,  nombreRequerimiento: 'Requerimiento Prueba 9', descripcion: 'Descripcion medianamente larga para el requerimiento 10', medio: 'Llamada', documentoIdentificador: 'DOC-NN10', gerenciaSolicitante: 'SGSA', gerenciaReceptora:'SGSA', estado:'EN PROCESO', actividad: 'Implementar los sistemas administrativos'},
    { id: 11,  nombreRequerimiento: 'Requerimiento Prueba 10', descripcion: 'Descripcion medianamente larga para el requerimiento 11', medio: 'Reunión', documentoIdentificador: 'DOC-NN11', gerenciaSolicitante: 'GPyORH', gerenciaReceptora:'SGSA', estado:'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos'},
    { id: 12,  nombreRequerimiento: 'Requerimiento Prueba 11', descripcion: 'Descripcion medianamente larga para el requerimiento 12', medio: 'Correo', documentoIdentificador: 'DOC-NN12', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', motivo: 'No se proporcionó información relevante', actividad: 'Desarrollar y mantener los sistemas administrativos'},
    { id: 13, nombreRequerimiento: 'Requerimiento Prueba 12', descripcion: 'Descripcion medianamente larga para el requerimiento 13', medio: 'Llamada', documentoIdentificador: 'DOC-NN13', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', actividad: 'Implementar los sistemas administrativos'},
    { id: 14,  nombreRequerimiento: 'Requerimiento Prueba 13', descripcion: 'Descripcion medianamente larga para el requerimiento 14', medio: 'Reunión', documentoIdentificador: 'DOC-NN14', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'OSI', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante'},
    { id: 15, nombreRequerimiento: 'Requerimiento Prueba 14', descripcion: 'Descripcion medianamente larga para el requerimiento 15', medio: 'Reunión', documentoIdentificador: 'DOC-NN15', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'FINALIZADO'},
    { id: 16, nombreRequerimiento: 'Requerimiento Prueba 15', descripcion: 'Descripcion medianamente larga para el requerimiento 16', medio: 'Correo', documentoIdentificador: 'DOC-NN16', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', motivo: 'Requerimiento a atender con Sistemas Administrativos', actividad: 'Desarrollar y mantener los sistemas administrativos'},
    { id: 17, nombreRequerimiento: 'Requerimiento Prueba 16', descripcion: 'Descripcion medianamente larga para el requerimiento 17', medio: 'Reunión', documentoIdentificador: 'DOC-NN17', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante'},
    { id: 18, nombreRequerimiento: 'Requerimiento Prueba 17', descripcion: 'Descripcion medianamente larga para el requerimiento 18', medio: 'Reunión', documentoIdentificador: 'DOC-NN18', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante'},
    { id: 19, nombreRequerimiento: 'Requerimiento Prueba 18', descripcion: 'Descripcion medianamente larga para el requerimiento 19', medio: 'Reunión', documentoIdentificador: 'DOC-NN19', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'APROBADO'},
    { id: 20, nombreRequerimiento: 'Requerimiento Prueba 19', descripcion: 'Descripcion medianamente larga para el requerimiento 20', medio: 'Llamada', documentoIdentificador: 'DOC-NN20', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'FINALIZADO'},
  ];

  FauxTablaRequerimientos(): Requerimiento[]{
    return this.reques;
  }

  getFauxRequerimiento(idReq: number): Requerimiento{
    return this.reques.find((x) => x.id == idReq);
  }

  FauxTablaEquipo(): Equipo[]{
    return this.equipo;
  }

  insertFauxRequerimientos(model: Requerimiento){
    this.reques.push(model);
  }

  insertTareasFauxRequerimientos(actividad: string, model: Requerimiento_Integrante[]){
    for (let i = 0; i < model.length; i++) {
      this.requesAsociados.push(model[i]);
    }
    this.reques.find(x => x.id == model[0].idReq).actividad = actividad;
    this.reques.find(x => x.id == model[0].idReq).estado = 'EN PROCESO';
    console.log(this.requesAsociados);
    console.log(this.reques.find(x => x.id == model[0].idReq));
  }
  getFauxTablaRequeAsignados(id: number): Requerimiento_Integrante[]{
    return this.requesAsociados.filter(function(x){
      return x.idIntegrante ==id;
    })
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
