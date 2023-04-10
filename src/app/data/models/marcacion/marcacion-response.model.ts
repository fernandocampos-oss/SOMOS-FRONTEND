import { TipoMarcacion } from '@data/enums/tipo-marcacion.enum';

export class MarcacionResponse {
  idMarcacion: number;
  latitud: string;
  longitud: string;
  idTipoMarcacion: TipoMarcacion;
  idUsuario: number;
  idSede: number;
  idZona: number;
}
