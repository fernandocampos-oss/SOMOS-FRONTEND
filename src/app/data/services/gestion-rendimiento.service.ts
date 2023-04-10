import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GestionRendimientoService {
  constructor(private http: HttpClient) {}

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
  
}
