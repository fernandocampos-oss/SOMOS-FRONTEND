import { Tarea } from "./tarea";
import { Poi } from "./poi";
import { EstadoRequerimiento } from "./estadoRequerimiento";

export class Requerimiento {
    idRequerimiento: number;
    nombreRequerimiento: string;
    descripcion: string;
    tipoRequerimiento: string;
    gerenciaSolicitante: string;
    gerenciaReceptor: string;
    motivo: string;
    estadoRequerimiento: EstadoRequerimiento;
    poi: Poi;
    tarea: Tarea[];
}

