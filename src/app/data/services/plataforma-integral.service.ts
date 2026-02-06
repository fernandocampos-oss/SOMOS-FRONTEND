import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';

export interface PersonalTokenResponse {
  token: string;
  urlPlataforma: string;
  expiresIn: number;
}

export interface PersonalLogeoResponse {
  success: boolean;
  mensaje: string;
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string;
  fechaNacimiento: string;
  numeroCelular: string;
  sexo: string;
  codigoPlanilla: string;
  cargo: string;
  regimen: string;
  fechaIngreso: string;
  dependencia: string;
  lugarLabora: string;
  numeroPlaza: string;
  nivelCargo: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlataformaIntegralService {

  private readonly URL = `${environment.apiUrl}/personal`;

  constructor(private http: HttpClient) { }

  generarToken(): Observable<PersonalTokenResponse> {
    return this.http.get<PersonalTokenResponse>(`${this.URL}/generar-token`);
  }

}
