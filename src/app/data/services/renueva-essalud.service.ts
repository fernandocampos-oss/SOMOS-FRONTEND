import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatosGrupo, DescripcionProyecto, Implementacion, InscripcionRenueva, miembroGrupo } from '@data/models/proyecto/proyecto.model';
import { environment } from '@env';
import { map } from 'rxjs/operators';

const URL_BASE = `${environment.apiUrl}/proyectos`;

@Injectable({
  providedIn: 'root'
})
export class RenuevaEssaludService {

  constructor(private _httpClient: HttpClient) { }

  getProyecto(){
    const url = `${URL_BASE}`;
    return this._httpClient.get<any>(url);
  }

  guardarDatosGrupos(model: DatosGrupo){
    const url = `${URL_BASE}`;
    return this._httpClient.post<any>(url,model);
  }

  guardarDatosProyecto(model: DescripcionProyecto){
    const url = `${URL_BASE}`;
    return this._httpClient.post<any>(url,model);
  }

  guardarImplementacion(model: Implementacion){
    const url = `${URL_BASE}`;
    return this._httpClient.post<any>(url,model);
  }
  
  saveProyecto(model: InscripcionRenueva){
    const url = `${URL_BASE}`;
    return this._httpClient.post<any>(url,model);
  }
  
  async getUsuariosMismaRed(){
    const url = `${URL_BASE}/usuarios-red`;
    return await this._httpClient.get<any[]>(url).pipe(
      map(message => message.sort((a1: miembroGrupo, a2: miembroGrupo) => a1.idUsuario - a2.idUsuario))
    ).toPromise();
  }
  
  getRenuevaReporteProyectos(){
    const url = `${URL_BASE}/bandeja`;
    return this._httpClient.get<any>(url);
  }
}
