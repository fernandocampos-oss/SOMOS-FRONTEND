import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@env';
import { Programacion } from '../models/programacion/programacion.model';
import { ProgramacionRegisterUpdate } from '../models/programacion/programacion-register-update.model';

const URL_BASE = `${environment.apiUrl}/programaciones`;

@Injectable({ providedIn: 'root' })
export class ProgramacionService {
  constructor(private _httpClient: HttpClient) {}

  search() {
    return this._httpClient.get<Programacion[]>(URL_BASE);
  }

  get(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.get<Programacion>(url);
  }
  getActual() {
    const url = `${URL_BASE}/actual`;
    return this._httpClient.get<Programacion>(url);
  }
  save(model: ProgramacionRegisterUpdate) {
    return this._httpClient.post<number>(URL_BASE, model);
  }
  update(id: number, model: ProgramacionRegisterUpdate) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.put(url, model);
  }
  delete(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.delete(url);
  }
  descargarQrActual(id: number) {
    const url = `${URL_BASE}/${id}/descargar-qr-actual`;
    return this._httpClient.get(url, { responseType: 'blob' });
  }
}
