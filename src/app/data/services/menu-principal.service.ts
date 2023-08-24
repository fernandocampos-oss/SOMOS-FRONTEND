import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '@env';
import { OnomasticosRequest, OnomasticosResponse } from '@data/models/menu-principal/menu-principal.model';
import { MenuEncuestaShow, encuestaRespuesta } from '@data/models/menu-principal/menu-encuesta.model';
import { PublicacionRequest, PublicacionResponse } from '@data/models/menu-principal/menu-publicacion.model';

const URL_BASE = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class MenuPrincipalService {

  constructor(private _httpClient: HttpClient) { }

  newPublicacion(model: PublicacionRequest){
    const url = `${URL_BASE}/publicaciones`;
    return this._httpClient.post(url,model);
  }

  getPublicaciones(){
    const url = `${URL_BASE}/publicaciones`;
    return this._httpClient.get<PublicacionResponse[]>(url);
  }

  getPublicacionesTable(){
    const url = `${URL_BASE}/publicaciones/administrador`;
    return this._httpClient.get<object[]>(url);
  }

  updatePublicacion(idPublicacion: number, model: PublicacionRequest){
    const url = `${URL_BASE}/publicaciones/${idPublicacion}`;
    return this._httpClient.put(url,model);
  }
  
  deletePublicacion(idPublicacion: number){
    const url = `${URL_BASE}/publicaciones/${idPublicacion}`;
    return this._httpClient.delete(url);
  }

  sendEncuesta(idEncuesta: number, model: encuestaRespuesta){
    const url = `${URL_BASE}/encuestas/${idEncuesta}/guardar-respuesta`;
    return this._httpClient.post(url,model);
  }

  getEncuestaActiva(){
    const url = `${URL_BASE}/encuestas/encuesta-activa`;
    return this._httpClient.get<MenuEncuestaShow>(url);
  }

  searchOnomasticos(model: OnomasticosRequest){
    return this._httpClient.get<OnomasticosResponse[]>(`${URL_BASE}/onomasticos/mes/${model.mesConsulta}/dia/${model.diaConsulta}`);
  }

  // async getListRed() {
  //   const url = `${URL_BASE}/usuarios-redes/redes`;
  //   return await this._httpClient.get<any[]>(url).toPromise();
  // }

  async getListRedesAsignadas() {
    const url = `${URL_BASE}/usuarios-redes/redes-asignadas`;
    return await this._httpClient.get<any[]>(url).toPromise();
  }

}
