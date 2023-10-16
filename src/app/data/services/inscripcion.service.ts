import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InscripcionRequest } from '@data/models/inscripcion/inscripcion.model';
import { environment } from '@env';

// const URL_BASE = `http://localhost/api/inscripciones`;
const URL_BASE = `${environment.apiUrl}/inscripciones`;

@Injectable({ providedIn: 'root' })
export class InscripcionService {

  constructor(private _httpClient: HttpClient) { }

  getInscripcionPorId(idInscripcion: number){
    const url = `${URL_BASE}/${idInscripcion}`;
    return this._httpClient.get<any>(url);
  }

  activarInscripcionPorId(idInscripcion: number, activarVotacion: boolean){
    const url = `${URL_BASE}/${idInscripcion}/activar-votacion/${activarVotacion}`;
    return this._httpClient.put<any>(url,{});
  }

  getInscripcionesVotacionesActivas(){
    const url = `${URL_BASE}/votaciones`;
    return this._httpClient.get<any>(url);
  }

  registerUserToInscripcion(model: InscripcionRequest){
    const url = `${URL_BASE}/guardar-respuesta`;
    return this._httpClient.post<any>(url,model);
  }

  getUsuariosInscritos(idInscripcion: number){
    const url = `${URL_BASE}/${idInscripcion}/inscritos`;
    return this._httpClient.get<any>(url);
  }
}
