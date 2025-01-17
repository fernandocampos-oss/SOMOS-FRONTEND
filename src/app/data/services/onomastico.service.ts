import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '@data/models';
import { environment } from '@env';

const URL_BASE = `${environment.apiUrl}/onomasticos`;

@Injectable({
  providedIn: 'root'
})
export class OnomasticoService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  findUsuarioByNumDocAndEstado(numeroDocumento: string) {
    const url = `${URL_BASE}/find/usuario/num-doc/${numeroDocumento}`;
    return this._httpClient.get<Usuario>(url);
  }

}
