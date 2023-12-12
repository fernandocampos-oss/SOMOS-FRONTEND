import { IndicadorResponse } from "./gestion-rendimiento.model";

export class IndicadorExistRequestDto {
    indicador?: IndicadorResponse;
    listEvidencia?: EvidenciaExistRequestDto[];
}

export class EvidenciaExistRequestDto {
    descripcion?: string;
    plazo?: String;
}
