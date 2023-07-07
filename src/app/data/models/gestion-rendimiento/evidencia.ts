import { Tarea } from "./tarea";

export class Evidencia {
    idEvidencia: number;
    descripcion: string;
    avance: number;
    estado: boolean;
    tarea: Tarea;
}