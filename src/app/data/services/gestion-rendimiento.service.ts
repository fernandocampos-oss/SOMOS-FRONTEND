import { PersonalFiltroNombreDTO } from './../models/gestion-rendimiento/personalFiltroNombreDTO';
import { Tarea } from './../models/gestion-rendimiento/tarea';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
// import { Requerimiento, RequerimientoAsignado} from '@data/models/requerimiento/requerimiento.model';
import { Equipo, Requerimiento_Integrante } from '@data/models/requerimiento/requerimiento.model';
import { Poi } from '@data/models/gestion-rendimiento/poi';
import { Requerimiento } from '@data/models/gestion-rendimiento/requerimiento';
import { Persona } from '@modules/gestion-rendimiento/components/mi-equipo/dialogs/user-add-delete/user-add-delete.component';
import { Personal } from '@data/models/gestion-rendimiento/personal';
import { RequerimientoPersonal } from '@data/models/gestion-rendimiento/requerimientoPersonal';
import { TareaValidacionTransaccionalDTO } from '@data/models/gestion-rendimiento/tareaValidacionTransaccionalDTO';
import { PersonalEliminarDTO } from '@data/models/gestion-rendimiento/PersonalEliminarDTO';

const URL_BASE = `${environment.apiUrlLocal}`;

@Injectable({ providedIn: 'root' })
export class GestionRendimientoService {
  constructor(private http: HttpClient) { }

  equipo: Equipo[] = [//Tabla Provisional
    { id: 1, nombrePersona: 'Luis Lopez Gutierrez', cargo: 'Analista de costos' },
    { id: 2, nombrePersona: 'Leandro Zarsosa Manuel', cargo: 'Analista de procesos' },
    { id: 3, nombrePersona: 'Celia Requena Egas', cargo: 'Administrador de BD' },
    { id: 4, nombrePersona: 'Elder Lizana Rodriguez', cargo: 'Tester QA' },
    { id: 5, nombrePersona: 'Maria Lopez Uribe', cargo: 'Analista funcional' },
  ];

  // requesAsociados: Requerimiento_Integrante[] = [
  //   { idReq: 8, idIntegrante: 1, nombreTarea: 'Prueba de tarea 1', plazo: '27/5/2023', estado: 'PENDIENTE', avance: 0 },
  //   { idReq: 8, idIntegrante: 3, nombreTarea: 'Prueba de tarea 2', plazo: '28/5/2023', estado: 'PENDIENTE', avance: 20 },
  //   { idReq: 9, idIntegrante: 4, nombreTarea: 'Prueba de tarea 3', plazo: '29/5/2023', estado: 'PENDIENTE', avance: 0 },
  //   { idReq: 9, idIntegrante: 5, nombreTarea: 'Prueba de tarea 4', plazo: '30/5/2023', estado: 'PENDIENTE', avance: 40 },
  //   { idReq: 10, idIntegrante: 1, nombreTarea: 'Prueba de tarea 5', plazo: '31/5/2023', estado: 'PENDIENTE', avance: 0 },
  //   { idReq: 10, idIntegrante: 2, nombreTarea: 'Prueba de tarea 6', plazo: '1/6/2023', estado: 'PENDIENTE', avance: 60 },
  //   { idReq: 10, idIntegrante: 5, nombreTarea: 'Prueba de tarea 7', plazo: '2/6/2023', estado: 'PENDIENTE', avance: 40 },
  //   { idReq: 12, idIntegrante: 3, nombreTarea: 'Prueba de tarea 8', plazo: '3/6/2023', estado: 'PENDIENTE', avance: 0 },
  //   { idReq: 12, idIntegrante: 1, nombreTarea: 'Prueba de tarea 9', plazo: '4/6/2023', estado: 'PENDIENTE', avance: 10 },
  //   { idReq: 13, idIntegrante: 4, nombreTarea: 'Prueba de tarea 10', plazo: '5/6/2023', estado: 'PENDIENTE', avance: 0 },
  //   { idReq: 13, idIntegrante: 2, nombreTarea: 'Prueba de tarea 11', plazo: '6/6/2023', estado: 'PENDIENTE', avance: 60 },
  //   { idReq: 16, idIntegrante: 4, nombreTarea: 'Prueba de tarea 12', plazo: '7/6/2023', estado: 'PENDIENTE', avance: 0 },
  // ];

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

    // { id: 1, nombreRequerimiento: 'Hacer informe del SAP Planillas	', descripcion: 'Descripcion medianamente larga para el requerimiento 1', medio: 'Correo', documentoIdentificador: 'DOC-NN1', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'APROBADO' },
    // { id: 2, nombreRequerimiento: 'Requerimiento Prueba 1', descripcion: 'Descripcion medianamente larga para el requerimiento 2', medio: 'Reunión', documentoIdentificador: 'DOC-NN2', gerenciaSolicitante: 'GDP', gerenciaReceptora: 'SGSA', estado: 'PENDIENTE' },
    // { id: 3, nombreRequerimiento: 'Requerimiento Prueba 2', descripcion: 'Descripcion medianamente larga para el requerimiento 3', medio: 'Correo', documentoIdentificador: 'DOC-NN3', gerenciaSolicitante: 'GAP', gerenciaReceptora: 'SGSA', estado: 'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos' },
    // { id: 4, nombreRequerimiento: 'Requerimiento Prueba 3', descripcion: 'Descripcion medianamente larga para el requerimiento 4', medio: 'Llamada', documentoIdentificador: 'DOC-NN4', gerenciaSolicitante: 'GDP', gerenciaReceptora: 'SGSA', estado: 'APROBADO' },
    // { id: 5, nombreRequerimiento: 'Requerimiento Prueba 4', descripcion: 'Descripcion medianamente larga para el requerimiento 5', medio: 'Correo', documentoIdentificador: 'DOC-NN5', gerenciaSolicitante: 'GAP', gerenciaReceptora: 'SGSA', estado: 'PENDIENTE' },
    // { id: 6, nombreRequerimiento: 'Requerimiento Prueba 5', descripcion: 'Descripcion medianamente larga para el requerimiento 6', medio: 'Llamada', documentoIdentificador: 'DOCDOC-NN6', gerenciaSolicitante: 'GAP', gerenciaReceptora: 'SGSA', estado: 'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos' },
    // { id: 7, nombreRequerimiento: 'Requerimiento Prueba 6', descripcion: 'Descripcion medianamente larga para el requerimiento 7', medio: 'Reunión', documentoIdentificador: 'DOC-NN7', gerenciaSolicitante: 'GDP', gerenciaReceptora: 'OSI', estado: 'APROBADO' },
    // { id: 8, nombreRequerimiento: 'Requerimiento Prueba 7', descripcion: 'Descripcion medianamente larga para el requerimiento 8', medio: 'Correo', documentoIdentificador: 'DOC-NN8', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', actividad: 'Implementar los sistemas administrativos' },
    // { id: 9, nombreRequerimiento: 'Requerimiento Prueba 8', descripcion: 'Descripcion medianamente larga para el requerimiento 9', medio: 'Correo', documentoIdentificador: 'DOC-NN9', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', motivo: 'Requerimiento a atender con Sistemas Administrativos', actividad: 'Realizar actividades de soporte operativo y administrativo para garantizar la ejecución presupuestal de la GCTIC' },
    // { id: 10, nombreRequerimiento: 'Requerimiento Prueba 9', descripcion: 'Descripcion medianamente larga para el requerimiento 10', medio: 'Llamada', documentoIdentificador: 'DOC-NN10', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', actividad: 'Implementar los sistemas administrativos' },
    // { id: 11, nombreRequerimiento: 'Requerimiento Prueba 10', descripcion: 'Descripcion medianamente larga para el requerimiento 11', medio: 'Reunión', documentoIdentificador: 'DOC-NN11', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'DERIVADO', motivo: 'Requerimiento a atender con Sistemas Administrativos' },
    // { id: 12, nombreRequerimiento: 'Requerimiento Prueba 11', descripcion: 'Descripcion medianamente larga para el requerimiento 12', medio: 'Correo', documentoIdentificador: 'DOC-NN12', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', motivo: 'No se proporcionó información relevante', actividad: 'Desarrollar y mantener los sistemas administrativos' },
    // { id: 13, nombreRequerimiento: 'Requerimiento Prueba 12', descripcion: 'Descripcion medianamente larga para el requerimiento 13', medio: 'Llamada', documentoIdentificador: 'DOC-NN13', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', actividad: 'Implementar los sistemas administrativos' },
    // { id: 14, nombreRequerimiento: 'Requerimiento Prueba 13', descripcion: 'Descripcion medianamente larga para el requerimiento 14', medio: 'Reunión', documentoIdentificador: 'DOC-NN14', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'OSI', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante' },
    // { id: 15, nombreRequerimiento: 'Requerimiento Prueba 14', descripcion: 'Descripcion medianamente larga para el requerimiento 15', medio: 'Reunión', documentoIdentificador: 'DOC-NN15', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'FINALIZADO' },
    // { id: 16, nombreRequerimiento: 'Requerimiento Prueba 15', descripcion: 'Descripcion medianamente larga para el requerimiento 16', medio: 'Correo', documentoIdentificador: 'DOC-NN16', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'EN PROCESO', motivo: 'Requerimiento a atender con Sistemas Administrativos', actividad: 'Desarrollar y mantener los sistemas administrativos' },
    // { id: 17, nombreRequerimiento: 'Requerimiento Prueba 16', descripcion: 'Descripcion medianamente larga para el requerimiento 17', medio: 'Reunión', documentoIdentificador: 'DOC-NN17', gerenciaSolicitante: 'GPyORH', gerenciaReceptora: 'SGSA', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante' },
    // { id: 18, nombreRequerimiento: 'Requerimiento Prueba 17', descripcion: 'Descripcion medianamente larga para el requerimiento 18', medio: 'Reunión', documentoIdentificador: 'DOC-NN18', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'RECHAZADO', motivo: 'No se proporcionó información relevante' },
    // { id: 19, nombreRequerimiento: 'Requerimiento Prueba 18', descripcion: 'Descripcion medianamente larga para el requerimiento 19', medio: 'Reunión', documentoIdentificador: 'DOC-NN19', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'APROBADO' },
    // { id: 20, nombreRequerimiento: 'Requerimiento Prueba 19', descripcion: 'Descripcion medianamente larga para el requerimiento 20', medio: 'Llamada', documentoIdentificador: 'DOC-NN20', gerenciaSolicitante: 'SGSA', gerenciaReceptora: 'SGSA', estado: 'FINALIZADO' },
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

  // getFauxRequerimiento(idReq: number): Requerimiento {
  //   return this.reques.find((x) => x.id == idReq);
  // }

  FauxTablaEquipo(): Equipo[] {
    return this.equipo;
  }

  // insertFauxRequerimientos(model: Requerimiento) {
  //   this.reques.push(model);
  // }

  // insertTareasFauxRequerimientos(actividad: string, model: Requerimiento_Integrante[]) {
  //   for (let i = 0; i < model.length; i++) {
  //     this.requesAsociados.push(model[i]);
  //   }
  //   this.reques.find(x => x.id == model[0].idReq).actividad = actividad;
  //   this.reques.find(x => x.id == model[0].idReq).estado = 'EN PROCESO';
  //   console.log(this.requesAsociados);
  //   console.log(this.reques.find(x => x.id == model[0].idReq));
  // }

  // getFauxTablaRequeAsignados(id: number): Requerimiento_Integrante[] {
  //   return this.requesAsociados.filter(function (x) {
  //     return x.idIntegrante == id;
  //   })
  // }

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
  registrarRequerimiento(requerimiento): Observable<any> {
    const url = `${URL_BASE}/requerimientos/registrar`;
    console.log(url, requerimiento);
    return this.http.post(`${URL_BASE}/requerimientos/registrar`, requerimiento);
  }

  listarRequerimiento() {
    const url = `${URL_BASE}/requerimientos/listar`;
    console.log(url);
    return this.http.get<Requerimiento[]>(url);
  }

  aprobarRequerimiento(estado: number, idRequerimiento: number) {
    const url = `${URL_BASE}/requerimientos/aprobar?estado=${estado}&idRequerimiento=${idRequerimiento}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  rechazarRequerimiento(estado: number, motivo: string, idRequerimiento: number) {
    const url = `${URL_BASE}/requerimientos/rechazar?estado=${estado}&motivo=${motivo}&idRequerimiento=${idRequerimiento}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  derivarRequerimiento(estado: number, motivo: string, idAreaReceptor: string, idRequerimiento: number) {
    const url = `${URL_BASE}/requerimientos/derivar?estado=${estado}&motivo=${motivo}&idAreaReceptor=${idAreaReceptor}&idRequerimiento=${idRequerimiento}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  listarPoi() {
    const url = `${URL_BASE}/pois/listar`;
    console.log(url);
    return this.http.get<Poi[]>(url);
  }

  registrarTareas(tareaReqPer: any) {
    const url = `${URL_BASE}/requerimientosPersonal/tareas/registrar/transaccion`;
    console.log(url, tareaReqPer);
    return this.http.post(url, tareaReqPer);
  }

  //Equipos
  listarPersonalPorDependenciaAsignado(idDependencia, idEstadoPersonal) {
    const url = `${URL_BASE}/personal/listar/dependencia/${idDependencia}/estadoAsignado/${idEstadoPersonal}`;
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

  listarRequerimientosPorPersonal(idPersonal) { 
    const url = `${URL_BASE}/requerimientosPersonal/listar/requerimientos/${idPersonal}/personal`;
    console.log(url);
    return this.http.get<Personal[]>(url);
  }

  listarTareaPorRequermientoPersonal(idRequerimientoPersonal) {
    const url = `${URL_BASE}/tareas/listar/requerimientoPersonal/${idRequerimientoPersonal}`;
    console.log(url);
    return this.http.get<Personal[]>(url);
  }

  validarDuplicadoRequerimientoPersonal(idRequerimiento, idPersonal) {
    const url = `${URL_BASE}/requerimientosPersonal/validar/duplicado/requerimiento/${idRequerimiento}/personal/${idPersonal}`;
    console.log(url);
    return this.http.get<RequerimientoPersonal[]>(url);
  }

  registrarTareaNoDuplicado(tareaValidacionTransaccionalDTO: TareaValidacionTransaccionalDTO) {
    const url = `${URL_BASE}/tareas/registrar/noDuplicado`;
    console.log(url, tareaValidacionTransaccionalDTO);
    return this.http.post(url, tareaValidacionTransaccionalDTO);
  }

  eliminarPersonalMotivo(personalEliminarDTO: PersonalEliminarDTO) {
    const url = `${URL_BASE}/personal/eliminar`;
    console.log(url, personalEliminarDTO);
    return this.http.post(url, personalEliminarDTO);
  }

  //Mis tareas
  listarTareaPorPersonal(idPersonal) {
    const url = `${URL_BASE}/tareas/listar/personal/${idPersonal}`;
    console.log(url);
    return this.http.get<Tarea[]>(url);
  }

}
