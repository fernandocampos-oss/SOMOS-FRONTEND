import { TipoMarcacion } from '@data/enums/tipo-marcacion.enum';

export class MarcacionSearchRequest {
  usuario: string;
  fechaInicioMarcacion: Date;
  fechaFinMarcacion: Date;
  idTipoMarcacion: TipoMarcacion;
}

export class MarcacionSearchResponse {
  idMarcacion: number;
  usuario: string;
  fechaMarcacion: Date;
  tipoMarcacion: string;
  sede: string;
  zona: string;
}

export class MarcacionesRequest{
  desde: string;
  hasta: string;
  codigo: string;
}
export interface MarcacionesResponse{
  codplanilla: string;
  nombrepersonal: string;
  dni: string;
  fecha: string;
  hora: string;
  terminalmarca: string;
  descripcion: string;
  lectora: string;
  sede: string;  
}