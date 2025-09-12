import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Plaza } from '@data/models/plaza/plaza.model';

const URL_BASE = `${environment.apiUrl}/plazas`;

@Injectable({
  providedIn: 'root'
})
export class PlazaService {

  constructor(private _httpClient: HttpClient) { }

  buscarPlaza(plaza: string, nombre: string) {
    const url = `${URL_BASE}/busqueda?plaza=${plaza}&nombre=${nombre}`;
    return this._httpClient.get<Plaza>(url);
  }

}
