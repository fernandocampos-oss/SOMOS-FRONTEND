import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@env';
import { Sede } from '../models/sede/sede.model';
import { SedeRegisterUpdate } from '../models/sede/sede-register-update.model';

const URL_BASE = `${environment.apiUrl}/sedes`;

@Injectable({ providedIn: 'root' })
export class SedeService {
  constructor(private _httpClient: HttpClient) {}

  search() {
    return this._httpClient.get<Sede[]>(URL_BASE);
  }

  get(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.get<Sede>(url);
  }
  save(model: SedeRegisterUpdate) {
    return this._httpClient.post<number>(URL_BASE, model);
  }
  update(id: number, model: SedeRegisterUpdate) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.put(url, model);
  }
  delete(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.delete(url);
  }
}
