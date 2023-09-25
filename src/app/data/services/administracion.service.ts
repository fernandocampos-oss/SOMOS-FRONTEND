import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdministracionRedesResponse, RedesDatos, RequestDatosUsuarios } from '@data/models/administracion/administracion';
import { environment } from '@env';

const URL_BASE = `${environment.apiUrl}/usuarios-redes`;

@Injectable({ providedIn: 'root' })
export class AdministracionService {

  constructor(private _httpClient: HttpClient) { }

  getUsuariosRedes(model: RequestDatosUsuarios){
    const url = `${URL_BASE}/usuarios-red-asignada`;
    return this._httpClient.post<AdministracionRedesResponse>(url, model);
  }

  getDatosRedes(){
    const url = `${URL_BASE}/datos-redes`;
    return this._httpClient.get<RedesDatos>(url);
  }
}
