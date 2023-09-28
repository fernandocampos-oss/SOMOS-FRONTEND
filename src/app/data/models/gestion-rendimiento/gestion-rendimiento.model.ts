export class RequerimientoResponse {
  idRequerimiento?: number;
  nombre?: string;
  descripcion?: string;
  identificador?: string;
  motivo?: string;
  porcentajeAvance?: number;
  tipoIngreso?: TipoIngreso;
  esJefe?: boolean;
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
  imagenBase64?: string;
  extension?: string;
  nombreImagen?: string;
}

export class Tarea {
  idTarea?: number;
}

export class LiderEquipoRequest {
  lider?: Lider;
  integrante?: Integrante;
}

export class Lider {
  idUsuario?: number;
}

export class Integrante {
  idUsuario?: number;
}

// export class ArchivoNew {
//   idArchivo: number;
//   nombre: string;
//   nombreRegistro: string;
//   ruta: string;
//   tipo: string;
//   extension: string;
//   estado: boolean;
// }