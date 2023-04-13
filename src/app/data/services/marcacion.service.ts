import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@env';
import {
  MarcacionAdminRegisterUpdate,
  MarcacionRegister,
  MarcacionResponse,
  MarcacionSearchRequest,
  MarcacionSearchResponse,
  MarcacionTrabajadorRegister,
  MarcacionesRequest,
  MarcacionesResponse,
} from '../models';

const URL_BASE = `${environment.apiUrl}/marcaciones`;
const URL_BASE2 = `${environment.apiUrlMarcacion}`;

@Injectable({ providedIn: 'root' })
export class MarcacionService {
  constructor(private _httpClient: HttpClient) {}

  searchMarcaciones(model: MarcacionesRequest){
    return this._httpClient.get<MarcacionesResponse[]>(`${URL_BASE2}/lista?desde=${model.desde}&hasta=${model.hasta}&codigo=${model.codigo}`);
  }


  // Antes del cambio
  search(model: Partial<MarcacionSearchRequest>) {
    return this._search(URL_BASE, model);
  }

  searchMisMarcaciones(model: Partial<MarcacionSearchRequest>) {
    const url = `${URL_BASE}/me`;
    return this._search(url, model);
  }

  private _search(url: string, model: Partial<MarcacionSearchRequest>) {
    const params = new HttpParams()
      .set('usuario', model.usuario || '')
      .set('fechaInicioMarcacion', model.fechaInicioMarcacion?.toString() || '')
      .set('fechaFinMarcacion', model.fechaFinMarcacion?.toString() || '')
      .set('idTipoMarcacion', model.idTipoMarcacion || '');
    return this._httpClient.get<MarcacionSearchResponse[]>(url, {
      params,
    });
  }

  get(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.get<MarcacionResponse>(url);
  }

  save(model: MarcacionRegister) {
    return this._httpClient.post(URL_BASE, model);
  }
  saveMarcacionTrabajador(model: MarcacionTrabajadorRegister) {
    const url = `${URL_BASE}/marcacion-trabajador`;
    return this._httpClient.post(url, model);
  }
  saveAdmin(model: MarcacionAdminRegisterUpdate) {
    const url = `${URL_BASE}/admin`;
    return this._httpClient.post(url, model);
  }
  updateAdmin(id: number, model: MarcacionAdminRegisterUpdate) {
    const url = `${URL_BASE}/${id}/admin`;
    return this._httpClient.put(url, model);
  }
  delete(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.delete(url);
  }
}
