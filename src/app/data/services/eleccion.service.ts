import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EleccionActivaResponse, EleccionRequest } from '@data/models/eleccion/eleccion.model';
import { environment } from '@env';

const URL_BASE = `${environment.apiUrl}/elecciones`;

@Injectable({ providedIn: 'root' })
export class EleccionService {

  constructor(private _httpClient: HttpClient) { }

  getEleccionActiva(){
    const url = `${URL_BASE}/eleccion-activa`;
    return this._httpClient.get<EleccionActivaResponse>(url);
  }

  saveVotacion(model: EleccionRequest){
    const url = `${URL_BASE}/registrar-voto`;
    return this._httpClient.post(url, model);
  }
}
