import { TipoValorMeta } from "./gestion-rendimiento.model";
import { ActividadRequest } from "./indicador-dto.model";

export class PrioridadExistRequestDto {
    prioridad?: PrioridadExistDto;
    votante?: VotanteExistDto;
    indicador?: IndicadorExistDto;
    listEvidencia?: EvidenciaExistDto[];
}

export class PrioridadExistDto {
    idPrioridad?: number;
}

export class VotanteExistDto{
    idVotante?: number;
}

export class IndicadorExistDto {
    descripcion?: string;
    // detalle?: string;
    peso?: number;
    tipoValorMeta?: TipoValorMeta
    valorMeta?: number;
    /* Modificación Prioridad - Inicio */
    flDesPrioridad?: string;
    desPrioridad?: string;
    /* Modificación Prioridad - Fin */
}

export class EvidenciaExistDto {
    descripcion?: string;
    plazo?: String;
}

export class UpdatePrioridadDto { 
    actividad?: ActividadRequest
    fechaAsignacion?: String;
    prioridadNombre?: string;
}