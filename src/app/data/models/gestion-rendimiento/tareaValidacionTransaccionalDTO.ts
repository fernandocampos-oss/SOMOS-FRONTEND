import { Requerimiento } from "./requerimiento";
import { RequerimientoPersonal } from "./requerimientoPersonal";
import { TareaValidacionDTO } from "./tareaValidacionDTO";

export class TareaValidacionTransaccionalDTO {
    requerimiento: Requerimiento;
    listTareaDTO: TareaValidacionDTO[];
}
