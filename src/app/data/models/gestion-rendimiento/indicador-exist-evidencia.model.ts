import { IndicadorRequest } from "./gestion-rendimiento.model";

export class IndicadorExistRequestDto {
    indicador?: IndicadorRequest;
    listEvidencia?: EvidenciaExistRequestDto[];
}

export class EvidenciaExistRequestDto {
    descripcion?: string;
    plazo?: String;
}
