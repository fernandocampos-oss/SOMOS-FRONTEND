import { TipoValorMeta } from "./gestion-rendimiento.model";

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
    detalle?: string;
    peso?: number;
    tipoValorMeta?: TipoValorMeta
    valorMeta?: number;
}

export class EvidenciaExistDto {
    descripcion?: string;
    plazo?: String;
}