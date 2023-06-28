import { Tarea } from './tarea';
import { Personal } from "./personal";
import { Requerimiento } from "./requerimiento";

export class TareaValidacionDTO {
    personal: Personal;
    listTarea: Tarea[];
}
