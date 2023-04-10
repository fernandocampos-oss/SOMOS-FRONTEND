import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { DjConflictoRegister } from '../models/dj-conflicto/dj-conflicto-register.model';
import { Observable } from 'rxjs';
import { DjConflicto } from '../models/dj-conflicto/dj-conflicto.model';

const URL_BASE = `${environment.apiUrl}/dj`;

@Injectable({
  providedIn: 'root',
})
export class DjConflictoService {
  constructor(private _httpClient: HttpClient) {}

  getAll() {
    return this._httpClient.get<DjConflicto[]>(URL_BASE);
  }

  getById(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.get<DjConflicto>(url);
  }

  getbyCodigoPlanilla(codigo: String) {
    const url = `${URL_BASE}/codigo-planilla/${codigo}`;
    return this._httpClient.get<DjConflicto[]>(url);
  }

  register(model: DjConflictoRegister) : Observable<any> {
    const url = `${URL_BASE}/conflicto-interes`;
    return this._httpClient.post(url, model);
  }
}