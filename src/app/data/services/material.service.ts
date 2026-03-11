import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { MaestroMaterial } from '@data/models/material/maestro-material.model';
import { StockMaterial } from '@data/models/material/stock-material.model';

const URL_BASE = `${environment.apiUrl}/materiales`;

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private _httpClient: HttpClient) { }

  buscarMaestroMaterial(codigoMaterial: string) {
    const url = `${URL_BASE}/maestro?codigoMaterial=${codigoMaterial}`;
    return this._httpClient.get<MaestroMaterial[]>(url);
  }

  buscarStockMaterial(codigoMaterial: string, codigoRed: string) {
    const url = `${URL_BASE}/stock?codigoMaterial=${codigoMaterial}&codigoRed=${codigoRed}`;
    return this._httpClient.get<StockMaterial[]>(url);
  }

}
