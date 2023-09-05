import { Usuario } from "../usuario/usuario.model";
import { Poi, RequerimientoUsuario } from "./gestion-rendimiento.model";

export class TareaDTO {
    poi?: Poi;
    requerimientoUsuario?: RequerimientoUsuario;
    listTarea?: TareaResponse[];
}

export class TareaResponse {
    nombreTarea?: string;
    plazo?: String;
    // estado?: boolean;
    // estadoTarea?: EstadoTarea;
    porcentajeAvance?: number;
    // fechaCreacion?: Date;
}

export class TareaRequest {
    idTarea?: number;
    nombreTarea?: string;
    plazo?: String;
    // estado?: boolean;
    // estadoTarea?: EstadoTarea;
    porcentajeAvance?: number;
    // fechaCreacion?: Date;
    requerimientoUsuario?: RequerimientoUsuario;
}

// export class EstadoTarea {
//     idEstadoTarea?: number;
//     descripcion?: string;
//     estado?: boolean;
// }
