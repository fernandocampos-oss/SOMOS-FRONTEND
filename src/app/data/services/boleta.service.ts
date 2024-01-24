import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { BoletaPago } from '@data/models/boleta/boleta-pago.model';
import { BoletaHistorial } from '@data/models/boleta/boleta-historial.model';

const URL_BASE = `${environment.apiUrl}/pagos`;

@Injectable({
  providedIn: 'root'
})
export class BoletaService {

  constructor(private _httpClient: HttpClient) { }

  getIfInscritosBoleta(){
    const url = `${URL_BASE}/verificar-terminos`;
    return this._httpClient.get<any>(url);
  }

  acceptTerminos(){
    const url = `${URL_BASE}/aceptar-terminos`;
    return this._httpClient.post(url,{});
  }

  buscarBoletaPago(anio: string, mes: string) {
    const url = `${URL_BASE}/busqueda/anio/${anio}/mes/${mes}`;
    return this._httpClient.get<BoletaPago>(url);
  }

  listarHistorial() {
    const url = `${URL_BASE}/historial/actividades`;
    return this._httpClient.get<BoletaHistorial[]>(url);
  }

}
