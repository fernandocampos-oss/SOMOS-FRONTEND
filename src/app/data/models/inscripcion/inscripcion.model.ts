export class InscripcionResponse {
  idInscripcion: number;
  descripcion: string;
  enviado: boolean
}

export class inscritosResponse {
  idUsuario: number;
  numeroDocumento: string;
  nombreCompleto: string;
  regimen: string;
  numeroCelular: string;
  correo: string;
  estadoActivo: boolean;
  fechaInscripcion: string;
  descripcion?: string;
  idLider?: number;
  rutaImagen?: string;
}

export class InscripcionRequest {
  idInscripcion: number;
  tipoInscripcion: number;
  inscritos?: number[];
  descripcion?: string;
  imagenBase64?: string;
}

export class VotacionInscripcionRequest {
  idInscripcion: number;
  idCandidato: number;
}

export class CreateInscripcionRequest {
  imagenActiva: boolean ;
  imagenDescripcion: string ;
  textoActivo: boolean ;
  textoDescripcion: string ;
  grupoActivo: boolean ;
  grupoLongitud: string ;
  esVotacion: boolean ;
  usuarios: number[] ;
}