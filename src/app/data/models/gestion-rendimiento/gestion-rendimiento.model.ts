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

export class ActividadResponse {
  idActividad?: number;
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

export class IndicadorRequest {
  idIndicador?: number;
  descripcion?: string;
  detalle?: string;
}

export class EvidenciaSustentoRequestDto {
  idEvidencia?: number;
  sustentoDescripcion?: string;
  extension?: string;
  fileBase64?: string;
}

export class EvidenciaResponseDto {
  evidenciaDescripcion?: string;
  evidenciaFechaRegistro?: string;
  fileBase64?: string;
  extension?: string;
}



export class TareaRequestDto {
  // actividad?: ActividadRequest;
  // indicador?: IndicadorRequest;
  // listTarea?: TareaRequest[];
}


export class EvidenciaResponse {
  idTarea?: number;
  nombre?: string;
  plazo?: String;
  // indicadorUsuario?: IndicadorUsuario;
}