export class RequerimientoResponse {
  idRequerimiento?: number;
  nombre?: string;
  descripcion?: string;
  motivo?: string;
  valorMeta?: number;
  tipoIngreso?: TipoIngreso;
  esJefe?: boolean;
  tipoValorMeta?: TipoValorMeta;
}

export class RequerimientoRequest {
  idRequerimiento?: number;
  nombre?: string;
  descripcion?: string;
  motivo?: string;
  valorMeta?: number;
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

export class TipoValorMeta {
  idTipoValorMeta?: number;
  codigo?: number;
  descripcion?: string;
  estado?: boolean;
}

export class Poi {
  idPoi?: number;
  descripcion?: string;
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
