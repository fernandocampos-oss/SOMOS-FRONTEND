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
  fechaInscripcion: string
}

export class InscripcionRequest {
  idInscripcion: number;
  tipoInscripcion: number;
  inscritos?: number[];
  descripcion?: string;
  imagenBase64?: string;
}