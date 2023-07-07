import { Archivo } from "./Archivo";
import { Evidencia } from "./evidencia";

export class EvidenciaArchivo {
    idEvidenciaArchivo: number;
    evidencia: Evidencia;
    archivo: Archivo;
    estado: boolean;
}