import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';

const URL_BASE = `${environment.apiUrl}/encuestas-formularios`;

@Injectable({
  providedIn: 'root'
})
export class EncuestaFormularioService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  async getPreguntasByIdEncuesta(id: number) {
    const url = `${URL_BASE}/detalle/${id}/encuesta`;
    return await this._httpClient.get<any>(url).toPromise();
  }

}
