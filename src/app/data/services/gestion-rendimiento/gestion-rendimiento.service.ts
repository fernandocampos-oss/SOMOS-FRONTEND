import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { ActividadResponse, EmailNotificacionRequestDto, EquipoRequest, EvidenciaResponseDto, EvidenciaSustentoRequestDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { IndicadorExistRequestDto } from '@data/models/gestion-rendimiento/indicador-exist-evidencia.model';
import { PrioridadExistRequestDto } from '@data/models/gestion-rendimiento/prioridad-exist-indicador.model';

const URL_BASE = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class GestionRendimientoService {

  constructor(
    private http: HttpClient
  ) { }

  async listarActividades() {
    const url = `${URL_BASE}/prioridades/listar/actividades`;
    console.log(url);
    return await this.http.get<ActividadResponse[]>(url).toPromise();
  }

  async listarPrioridadesPrincipal() {
    const url = `${URL_BASE}/prioridades/listar-principal`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async generarExcelDirectivo() {
    const url = `${URL_BASE}/prioridades/excel/directivo`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async sendCorreoNotificacion(dto: EmailNotificacionRequestDto) {
    const url = `${URL_BASE}/prioridades/correo-notificar`;
    console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async listarIndicadorPendiente() {
    const url = `${URL_BASE}/indicadores/listar/pendientes`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarTipoValorMeta() {
    const url = `${URL_BASE}/indicadores/listar/tipoValorMeta`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async registrarIndicador(indicadorRequest: any) {
    const url = `${URL_BASE}/indicadores/registrar`;
    console.log(url, indicadorRequest);
    return await this.http.post(url, indicadorRequest).toPromise();
  }

  async updateIndicador(idIndicador: number, model: any) {
    const url = `${URL_BASE}/indicadores/modificar/indicador/${idIndicador}`;
    console.log(url, model);
    return await this.http.put(url, model).toPromise();
  }

  async sumaTotalPesoAllIndicadorByTrabajador(idVotante: number) {
    const url = `${URL_BASE}/indicadores/peso-total/${idVotante}`;
    console.log(url);
    return await this.http.get<number>(url).toPromise();
  }
  
  async generarExcelTrabajador() {
    const url = `${URL_BASE}/indicadores/excel/trabajador`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }
  
  async listarIntegrantesPorLider() {
    const url = `${URL_BASE}/equipos/listar`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async listarVotantes() {
    const url = `${URL_BASE}/equipos/listar/votantes`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async eliminarTrabajador(idEquipo: number) {
    const url = `${URL_BASE}/equipos/eliminar?idEquipo=${idEquipo}`;
    console.log(url);
    return await this.http.get(url).toPromise();
  }

  async registrarTrabajador(equipoRequest: EquipoRequest) {
    const url = `${URL_BASE}/equipos/registrar`;
    console.log(url, equipoRequest);
    return await this.http.post(url, equipoRequest).toPromise();
  }

  async getVotanteByIdUsuario() {
    const url = `${URL_BASE}/equipos/obtener/votante/segmento`;
    console.log(url);
    return await this.http.get<Object>(url).toPromise();
  }

  async registrarEvidenciaExistIndicador(dto: IndicadorExistRequestDto) {
    const url = `${URL_BASE}/evidencias/registrar/exist-indicador`;
    console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async registrarIndicadorExistPrioridad(dto: PrioridadExistRequestDto) {
    const url = `${URL_BASE}/evidencias/registrar/exist-prioridad`;
    console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async crearSustentoEvidencia(dto: EvidenciaSustentoRequestDto) {
    const url = `${URL_BASE}/evidencias/registrar/sustento`;
    console.log(url, dto);
    return await this.http.post(url, dto).toPromise();
  }

  async getEvidenciasByIndicador(idIndicador: number,) {
    const url = `${URL_BASE}/evidencias/listar/indicador/${idIndicador}`;
    console.log(url);
    return await this.http.get<Object[]>(url).toPromise();
  }

  async modificarTareaAdministrador(nombre: string, plazo: String, idTarea: number) {
    const url = `${URL_BASE}/evidencias/modificar?nombre=${nombre}&plazo=${plazo}&idTarea=${idTarea}`;
    console.log(url);
    return await this.http.get<any[]>(url).toPromise();
  }

  async getSustentoByEvidencia(idEvidencia: number) {
    const url = `${URL_BASE}/evidencias/obtener/evidencia/${idEvidencia}`;
    console.log(url);
    return await this.http.get<EvidenciaResponseDto>(url).toPromise();
  }

  // aprobarTarea(estado: number, idIndicadorUsuario: number) {
  //   const url = `${URL_BASE}/indicadores-usuarios/aprobar?estado=${estado}&idIndicadorUsuario=${idIndicadorUsuario}`;
  //   console.log(url);
  //   return this.http.get<any[]>(url);
  // }

  // rechazarTarear(estado: number, motivo: string, idIndicadorUsuario: number) {
  //   const url = `${URL_BASE}/indicadores-usuarios/rechazar?estado=${estado}&motivo=${motivo}&idRequerimientoUsuario=${idRequerimientoUsuario}`;
  //   console.log(url);
  //   return this.http.get<any[]>(url);
  // }

}
