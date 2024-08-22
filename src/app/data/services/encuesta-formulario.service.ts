import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';

const URL_BASE = `${environment.apiUrl}/formularios-encuestas`;

@Injectable({
  providedIn: 'root'
})
export class EncuestaFormularioService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  async listEncuestaByUsuarioCreacion() {
    const url = `${URL_BASE}/listar`;
    return await this._httpClient.get<any>(url).toPromise();
  }

  async getPreguntasByIdEncuesta(id: number) {
    const url = `${URL_BASE}/detalle/${id}/encuesta`;
    return await this._httpClient.get<any>(url).toPromise();
  }

  registrarRespuestas(dto: any) {
    const url = `${URL_BASE}/registrar-respuestas`;
    return this._httpClient.post(url, dto);
  }

  async evaluarEncuestaFinalizado(id: number) {
    const url = `${URL_BASE}/evaluar/${id}/finalizado`;
    return await this._httpClient.get<any>(url).toPromise();
  }

}
