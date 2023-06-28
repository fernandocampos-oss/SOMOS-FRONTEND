import { Tarea } from "./tarea";
import { Poi } from "./poi";
import { EstadoRequerimiento } from "./estadoRequerimiento";
import { Dependencia } from "./dependencia";
import { TipoIngreso } from "./tipoIngreso";

export class Requerimiento {
    idRequerimiento: number;
    nombre: string;
    descripcion: string;
    identificador: string;
    motivo: string;
    porcentajeAvance: number;
    estado: boolean;
    areaSolicitante: Dependencia;
    areaReceptor: Dependencia;
    tipoIngreso: TipoIngreso;
    estadoRequerimiento: EstadoRequerimiento;
    poi: Poi;
    // tarea: Tarea[];
}

