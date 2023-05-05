import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '@env';
import { OnomasticosRequest, OnomasticosResponse } from '@data/models/menu-principal/menu-principal.model';
import { MenuEncuestaShow, encuestaRespuesta } from '@data/models/menu-principal/menu-encuesta.model';

const URL_BASE = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class MenuPrincipalService {

  constructor(private _httpClient: HttpClient) { }

  getDiaAhora(): any{
    return fetch("http://worldtimeapi.org/api/timezone/America/Lima",{method: "GET",mode: "cors"}).then((resp) => resp.json());
  }

  sendEncuesta(idEncuesta: number, model: encuestaRespuesta){
    const url = `${URL_BASE}/encuestas/${idEncuesta}/guardar-respuesta`;
    return this._httpClient.post(url,model);
  }

  getEncuestaActiva(){
    const url = `${URL_BASE}/encuestas/encuesta-activa`;
    return this._httpClient.get<MenuEncuestaShow>(url);
  }

  searchOnomasticos(model: OnomasticosRequest){
    return this._httpClient.get<OnomasticosResponse[]>(`${URL_BASE}/onomasticos/mes/${model.mesConsulta}/dia/${model.diaConsulta}`);
  }
}
