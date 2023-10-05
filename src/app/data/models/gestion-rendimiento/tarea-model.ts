import { Poi, RequerimientoUsuario } from "./gestion-rendimiento.model";

export class TareaDTO {
    poi?: Poi;
    requerimientoUsuario?: RequerimientoUsuario;
    listTarea?: TareaResponse[];
}

export class TareaResponse {
    nombreTarea?: string;
    plazo?: String;
    porcentajeInicial?: number;
}

export class TareaRequest {
    idTarea?: number;
    nombreTarea?: string;
    plazo?: String;
    requerimientoUsuario?: RequerimientoUsuario;
}