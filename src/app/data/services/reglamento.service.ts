import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reglamento } from '@data/models/reglamento/reglamento.model';
import { environment } from '@env';

const URL_BASE = `${environment.apiUrl}/reglamentos`;

@Injectable({
  providedIn: 'root'
})
export class ReglamentoService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  getAll() {
    return this._httpClient.get<Reglamento[]>(URL_BASE);
  }

  save(model: Reglamento) {
    return this._httpClient.post<number>(URL_BASE, model);
  }

   getReglamentoBySemestre(numDoc: string, semestre: number, anio: number) {
    const url = `${URL_BASE}/consulta/${numDoc}/${semestre}/${anio}`;
    return this._httpClient.get<Reglamento[]>(url);
  }

}

