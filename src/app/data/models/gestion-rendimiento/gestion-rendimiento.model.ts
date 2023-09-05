export class RequerimientoResponse {
  nombre?: string;
  descripcion?: string;
  identificador?: string;
  motivo?: string;
  porcentajeAvance?: number;
  // estado?: boolean;
  tipoIngreso?: TipoIngreso;
}

export class RequerimientoRequest {
  idRequerimiento?: number;
  nombre?: string;
  descripcion?: string;
  identificador?: string;
  motivo?: string;
  porcentajeAvance?: number;
  // estado: boolean;
  tipoIngreso?: TipoIngreso;
  // poi?: Poi;
}

export class RequerimientoUsuario {
  idRequerimientoUsuario?: number;
}

export class EstadoRequerimiento {
  idEstadoRequerimiento?: number;
  codigo?: string;
  descripcion?: string;
  estado?: boolean;
}

export class Indicador {
  idIndicador?: number;
  descripcion?: string;
  estado?: boolean;
}

export class Poi {
  idPoi?: number;
  descripcion?: string;
  indicador?: Indicador;
  estado?: boolean;
}

export class UnidadOrganizativa {
  codUnidad?: string;
  descripcion?: string;
}

export class TipoIngreso {
  idTipoIngreso?: number;
  descripcion?: string;
  estado?: boolean;
}

export class Personal {
  idUsuario?: number;
  numeroDocumento?: number;
  nombres?: number;
  apellidos?: string;
}

//--------------------------

export class ArchivoNew {
  idArchivo: number;
  nombre: string;
  nombreRegistro: string;
  ruta: string;
  tipo: string;
  extension: string;
  estado: boolean;
}

// export class Evidencia {
//   idEvidencia: number;
//   descripcion: string;
//   avance: number;
//   estado: boolean;
//   tarea: Tarea;
// }

// export class EvidenciaArchivo {
//   idEvidenciaArchivo: number;
//   evidencia: Evidencia;
//   archivo: Archivo;
//   estado: boolean;
// }



// --------------------------

export class Tarea1 {
  idEquipoIntegrante?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  descripcion?: String;
}

export class Informe {
  id?: number
  idTarea?: number
  descripcion?: string
  avance?: number
  estado?: string
}

export class Archivo {
  idArchivo?: number
  base64: any
  nombreReal: string
  ext: string
  tipo: string
}

export interface Requerimiento1 {
  id: number;
  nombreRequerimiento: string;
  descripcion: string;
  medio: string;
  documentoIdentificador: string;
  gerenciaSolicitante: string;
  gerenciaReceptora: string;
  estado: string;
  motivo?: string;
  actividad?: string;
}

export interface Requerimiento_Integrante {
  idReq: number;
  idIntegrante: number;
  nombreTarea: string;
  plazo: string;
  estado: string; //PENDIENTE, FINALIZADO, RECHAZADO
  avance: number;
  tareas?: Informes[];
}

export interface Informes {
  //id: number;
  descripcionInforme: string;
  avanceRepresentado: number;
  fechaCreacion: string;
}

//Seguro son temporales
export interface Equipo {
  id: number;
  nombrePersona: string;
  cargo: string;
}