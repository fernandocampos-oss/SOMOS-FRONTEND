import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@env';
import { KeyParam } from '@data/enums/key-param.enum';
import { Param } from '@data/models';

const URL_BASE = `${environment.apiUrl}/parametros`;
const SEPARATOR = ',';
const KEY = 'keys';
@Injectable({ providedIn: 'root' })
export class ParamService {
  constructor(private _httpClient: HttpClient) {}

  getParams(...filters: KeyParam[]) {
    const params = new HttpParams().set(KEY, filters.join(SEPARATOR));
    return this._httpClient.get<any>(URL_BASE, { params });
  }

  getRoles() {
    const url = `${URL_BASE}/roles`;
    return this._httpClient.get<Param[]>(url);
  }
}
