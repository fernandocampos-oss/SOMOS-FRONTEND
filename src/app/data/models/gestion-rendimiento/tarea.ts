import { Requerimiento } from "./requerimiento";

export class Tarea {
    idTarea: number;
    nombreTarea: string;
    plazo: String;
    estado: boolean;
    estadoAvance: String;
    porcentajeAvance: number;
    fechaCreacion: Date;
    // requerimientoPersonal: RequerimientoPersonal;
}