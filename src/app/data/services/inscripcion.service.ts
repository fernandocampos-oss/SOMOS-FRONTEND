import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  registerUserToInscripcion(idInscripcion: number){
    const url = `${URL_BASE}/${idInscripcion}/guardar-respuesta`;
    return this._httpClient.post<any>(url,{});
  }

  getUsuariosInscritos(idInscripcion: number){
    const url = `${URL_BASE}/${idInscripcion}/inscritos`;
    return this._httpClient.get<any>(url);
  }
}
