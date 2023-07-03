import { EstadoTarea } from "./estadoTarea";
import { Requerimiento } from "./requerimiento";

export class Tarea {
    idTarea: number;
    nombreTarea: string;
    plazo: String;
    estado: boolean;
    estadoTarea: EstadoTarea;
    porcentajeAvance: number;
    fechaCreacion: Date;
    // requerimientoPersonal: RequerimientoPersonal;
}