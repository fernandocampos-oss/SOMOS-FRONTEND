import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@env';
import { UsuarioNombres, Usuario, UsuarioRegisterUpdate } from '@data/models';
import { UsuarioPassword } from '@data/models/usuario/usuario-password.model';

const URL_BASE = `${environment.apiUrl}/usuarios`;

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private _httpClient: HttpClient) {}

  updatePassword(id: number, model: UsuarioPassword){
    const url = `${URL_BASE}/${id}/cambiar-clave`;
    return this._httpClient.put(url,model);
  }

  search() {
    const url = `${URL_BASE}`;
    return this._httpClient.get<Usuario[]>(url);
  }
  get(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.get<Usuario>(url);
  }
  getNombres(mostrarTodos: boolean) {
    const url = `${URL_BASE}/nombres`;
    const params = new HttpParams().set('mostrarTodos', mostrarTodos);
    return this._httpClient.get<UsuarioNombres[]>(url, { params });
  }
  save(model: UsuarioRegisterUpdate) {
    const url = `${URL_BASE}`;
    return this._httpClient.post(url, model);
  }
  update(id: number, model: UsuarioRegisterUpdate) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.put(url, model);
  }
  delete(id: number) {
    const url = `${URL_BASE}/${id}`;
    return this._httpClient.delete(url);
  }
}
