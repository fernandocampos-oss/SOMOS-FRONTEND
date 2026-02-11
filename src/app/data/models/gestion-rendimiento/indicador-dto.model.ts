import { TipoValorMeta } from "./gestion-rendimiento.model";

export class PrioridadRequestDto {
    actividad?: ActividadRequest;
    votante?: VotanteRequest;
    indicador?: IndicadorRequest;
    listEvidencia?: EvidenciaRequest[];
    prioridadNombre?: string;
    sentidoIndicador?: string;
    fechaPlazoFinal?: string; // Fecha de plazo final para la evidencia final
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
    tipoValorMeta?: TipoValorMeta
    valorMeta?: number;
    peso?: number;
    /* Modificación Prioridad - Inicio */
    flDesPrioridad?: string;
    desPrioridad?: string;
    /* Modificación Prioridad - Fin */
  }

  export class EvidenciaRequest {
    descripcion?: string;
    plazo?: String;
  }
  