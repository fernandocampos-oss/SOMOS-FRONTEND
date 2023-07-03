import { EstadoPersonal } from './estadoPersonal';
import { Cargo } from "./cargo";
import { Dependencia } from "./dependencia";

export class Personal {
    idPersonal: number;
    numeroDni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    cargo: Cargo;
    dependencia: Dependencia;
    // estado: string;
    motivoEliminado: string;
    estadoPersonal: EstadoPersonal;
}