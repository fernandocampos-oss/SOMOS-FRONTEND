export class RequerimientoResponse {
  nombre?: string;
  descripcion?: string;
  identificador?: string;
  motivo?: string;
  porcentajeAvance?: number;
  tipoIngreso?: TipoIngreso;
}

export class RequerimientoRequest {
  idRequerimiento?: number;
  nombre?: string;
  descripcion?: string;
  identificador?: string;
  motivo?: string;
  porcentajeAvance?: number;
  tipoIngreso?: TipoIngreso;
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

export class EvidenciaRequest {
  descripcion?: string;
  porcentajeAvance?: number;
  tarea?: Tarea;
  imagenBase64?: string;

  nombreImagen?: string;
  sizeImagen?: number;
  tipoImagen: string;
  extension?: string;
  idRequerimiento?: number;
}

export class EvidenciaResponseDTO {
  idEvidencia?: number;
  descripcion?: string;
  porcentajeAvance?: number;
  fechaCreacion?: string;
  // estado: boolean;
  imagenBase64?: string;
  extension?: string;
  nombreImagen?: string;
}

export class Tarea {
  idTarea?: number;
}

// No activos--------------------------

export class ArchivoNew {
  idArchivo: number;
  nombre: string;
  nombreRegistro: string;
  ruta: string;
  tipo: string;
  extension: string;
  estado: boolean;
}

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
  estado: string;
  avance: number;
  tareas?: Informes[];
}

export interface Informes {
  descripcionInforme: string;
  avanceRepresentado: number;
  fechaCreacion: string;
}

export interface Equipo {
  id: number;
  nombrePersona: string;
  cargo: string;
}