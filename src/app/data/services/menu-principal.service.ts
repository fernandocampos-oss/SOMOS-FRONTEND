import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '@env';
import { OnomasticosRequest, OnomasticosResponse } from '@data/models/menu-principal/menu-principal.model';

const URL_BASE = `${environment.apiUrlMarcacion}`;

@Injectable({ providedIn: 'root' })
export class MenuPrincipalService {

  constructor(private _httpClient: HttpClient) { }

  searchOnomasticos(model: OnomasticosRequest){
    return this._httpClient.get<OnomasticosResponse[]>(`${URL_BASE}/onomasticos/mes/${model.mesConsulta}/dia/${model.diaConsulta}`);
  }
}
