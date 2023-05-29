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
    estadoRequerimeinto: EstadoRequerimiento;
    poi: Poi;
    tarea: Tarea[];
}

