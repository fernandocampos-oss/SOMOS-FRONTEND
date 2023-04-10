import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@env';
import {
  ZonaRegisterUpdate,
  Zona,
  ZonaSearchRequest,
  ZonaSearchResponse,
} from '@data/models';

const URL_BASE = `${environment.apiUrl}/zonas`;

@Injectable({ providedIn: 'root' })
export class ZonaService {
  constructor(private _httpClient: HttpClient) {}

  search(request: Partial<ZonaSearchRequest> = {}) {
    const params = new HttpParams().set('idSede', request?.idSede || '');
    return this._httpClient.get<ZonaSearchResponse[]>(URL_BASE, { params });
  }

  get(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.get<Zona>(url);
  }
  save(model: ZonaRegisterUpdate) {
    return this._httpClient.post<number>(URL_BASE, model);
  }
  update(id: number, model: ZonaRegisterUpdate) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.put(url, model);
  }
  delete(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.delete(url);
  }
}
