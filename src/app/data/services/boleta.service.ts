import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { BoletaPago } from '@data/models/boleta/boleta-pago.model';

const URL_BASE = `${environment.apiUrl}/pagos`;

@Injectable({
  providedIn: 'root'
})
export class BoletaService {

  inscritosTemp = [{numDoc: '72437355'}, {numDoc: '07461911'}];

  constructor(private _httpClient: HttpClient) { }

  getBoletas(codPlanilla: string){
    const url = `http://10.0.28.15:5000/buscar_por_codigo?codigo=${codPlanilla}`;
    return this._httpClient.get(url);
  }

  addInscritosBoleta(numDocumento: string){
    this.inscritosTemp.push({numDoc: numDocumento});
  }

  getIfInscritosBoleta(){
    const url = `${URL_BASE}/verificar-terminos`;
    return this._httpClient.get<any>(url);
  }

  acceptTerminos(){
    const url = `${URL_BASE}/aceptar-terminos`;
    return this._httpClient.post(url,{});
  }

  deleteInscritosBoleta(numDocumento: string){
    this.inscritosTemp.splice(this.inscritosTemp.findIndex(x => x.numDoc === numDocumento),1);
  }

  buscarBoletaPago(anio: string, mes: string) {
    const url = `${URL_BASE}/busqueda/anio/${anio}/mes/${mes}`;
    return this._httpClient.get<BoletaPago>(url);
  }

}
