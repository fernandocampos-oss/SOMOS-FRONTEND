import { TipoValorMeta } from "./gestion-rendimiento.model";

export class PrioridadRequestDto {
    actividad?: ActividadRequest;
    votante?: VotanteRequest;
    indicador?: IndicadorRequest;
    listEvidencia?: EvidenciaRequest[];
  }

  export class ActividadRequest {
    idActividad?: number;
    codigo?: string;
    descripcion?: string;
    estado?: boolean;
  }

  export class VotanteRequest {
    idVotante?: number;
  }

  export class IndicadorRequest {
    descripcion?: string;
    detalle?: string;
    peso?: number;
    tipoValorMeta?: TipoValorMeta
    valorMeta?: number;
  }

  export class EvidenciaRequest {
    descripcion?: string;
    plazo?: String;
  }
  