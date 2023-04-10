import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@env';
import { Ubigeo, Param } from '@data/models';

const URL_BASE = `${environment.apiUrl}/ubigeo`;

@Injectable({ providedIn: 'root' })
export class UbigeoService {
  constructor(private _httpClient: HttpClient) {}

  getDepartamentos() {
    const url = `${URL_BASE}/departamentos`;
    return this._httpClient.get<Param[]>(url);
  }
  getProvincias(codigoDepartamento: string) {
    const url = `${URL_BASE}/provincias`;
    const params = new HttpParams().set(
      'codigoDepartamento',
      codigoDepartamento
    );
    return this._httpClient.get<Param[]>(url, { params });
  }
  getDistritos(codigoDepartamento: string, codigoProvincia: string) {
    const url = `${URL_BASE}/distritos`;
    const params = new HttpParams()
      .set('codigoDepartamento', codigoDepartamento)
      .set('codigoProvincia', codigoProvincia);
    return this._httpClient.get<Param[]>(url, { params });
  }

  getUbigeo(codigo: string) {
    const url = `${URL_BASE}/${codigo}`;
    return this._httpClient.get<Ubigeo>(url);
  }
}
