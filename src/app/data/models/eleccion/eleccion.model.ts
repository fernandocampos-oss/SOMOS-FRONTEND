export class EleccionRequest {
  idEleccion: number;
  idCandidato?: number;
  idSegmento: number
}

export class EleccionActivaResponse {
  idEleccion: number;
  descripcion: string;
  idSegmento: number;
  candidatos: CandidatosResponse[]
}

export class CandidatosResponse {
  idCandidato: number;
  idUsuario: number;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  idSegmento: number
}