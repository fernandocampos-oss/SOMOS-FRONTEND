export class IndicadorResponse {
  idIndicador?: number;
  nombre?: string;
  descripcion?: string;
  motivo?: string;
  valorMeta?: number;
  tipoIngreso?: TipoIngreso;
  esJefe?: boolean;
  tipoValorMeta?: TipoValorMeta;
}

export class IndicadorRequest {
  // idIndicador?: number;
  nombre?: string;
  descripcion?: string;
  tipoIngreso?: TipoIngreso;
  tipoValorMeta?: TipoValorMeta
  valorMeta?: number;
}
export class TipoIngreso {
  idTipoIngreso?: number;
  codigo?: string;
  descripcion?: string;
  estado?: boolean;
}
export class TipoValorMeta {
  idTipoValorMeta?: number;
  codigo?: string;
  descripcion?: string;
  estado?: boolean;
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

export class Poi {
  idPoi?: number;
  descripcion?: string;
  estado?: boolean;
}

export class UnidadOrganizativa {
  codUnidad?: string;
  descripcion?: string;
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

export class EquipoRequest {
  jefe?: Jefe;
  integrante?: Integrante;
}
export class Jefe {
  idVotante?: number;
}
export class Integrante {
  idVotante?: number;
}
