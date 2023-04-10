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
