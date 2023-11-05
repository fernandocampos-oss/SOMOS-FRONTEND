import { IndicadorUsuario, Actividad } from "./gestion-rendimiento.model";

export class TareaRequestDto {
    actividad?: Actividad;
    indicadorUsuario?: IndicadorUsuario;
    listTarea?: TareaResponse[];
}

export class TareaResponse {
    nombre?: string;
    plazo?: String;
    pesoFraccion?: number;
}

export class TareaRequest {
    idTarea?: number;
    nombre?: string;
    plazo?: String;
    indicadorUsuario?: IndicadorUsuario;
}