import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';

const URL_BASE = `${environment.apiUrl}/usuarios-redes`;

@Injectable({
  providedIn: 'root'
})
export class AsignacionRolSectorizacionService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  async getListPersonal() {
    const url = `${URL_BASE}/administradores-red`;
    return await this._httpClient.get<any[]>(url).toPromise();
  }

  async getListRed() {
    const url = `${URL_BASE}/redes`;
    return await this._httpClient.get<any[]>(url).toPromise();
  }

  async getListRolesAsignados() {
    const url = `${URL_BASE}`;
    return await this._httpClient.get<any[]>(url).toPromise();
  }

  async ejecutarProceso() {
    console.log(URL_BASE + "/proceso/ejecucion")
    return await this._httpClient.post(URL_BASE + "/proceso/ejecucion", '').toPromise();
  }

  async registrarAsignacion(dto: any) {
    const url = `${URL_BASE}`;
    return await this._httpClient.post(url, dto).toPromise();
  }

  async removerAsignacion(idUsuario: number, codRed: string) {
    const url = `${URL_BASE}/usuario/${idUsuario}/red/${codRed}`;
    console.log(url)
    return await this._httpClient.delete(url).toPromise();
  }

}
