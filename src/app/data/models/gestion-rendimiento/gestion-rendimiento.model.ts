export class IndicadorRequest {
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

//eliminar
export class IndicadorUsuario {
  idIndicadorUsuario?: number;
  pesoTotal?: number;
}

export class Indicador{
  idIndicador?: number;
  // pesoTotal?: number;
}

export class EstadoIndicador {
  idEstadoIndicador?: number;
  codigo?: string;
  descripcion?: string;
  estado?: boolean;
}

export class Actividad {
  idActividad?: number;
  codigo?: string;
  descripcion?: string;
  estado?: boolean;
}

// export class Personal {
//   idUsuario?: number;
//   numeroDocumento?: number;
//   nombres?: number;
//   apellidos?: string;
// }

export class EvidenciaRequestDto {
  idTarea?: number;
  evidenciaDescripcion?: string;
  extension?: string;
  fileBase64?: string;
}

export class EvidenciaResponseDto {
  evidenciaDescripcion?: string;
  evidenciaFechaRegistro?: string;
  fileBase64?: string;
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

export class PrioridadDto {
  actividad?: Actividad;
  listIdIndicador?: number[];
}

