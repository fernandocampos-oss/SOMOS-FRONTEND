import { IndicadorUsuario, Actividad, Indicador } from "./gestion-rendimiento.model";

export class TareaRequestDto {
    actividad?: Actividad;
    indicador?: Indicador;
    listTarea?: TareaResponse[];
}

export class TareaResponse {
    nombre?: string;
    plazo?: String;
}

export class TareaRequest {
    idTarea?: number;
    nombre?: string;
    plazo?: String;
    indicadorUsuario?: IndicadorUsuario;
}