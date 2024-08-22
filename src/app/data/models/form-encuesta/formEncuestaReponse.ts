export class EncuestaRequest {
    idEncuesta?: number;
    idUsuarioCreacion?: number;
    idUsuarioContesta?: number;
    listPregunta?: FormPreguntaRequest[];
}
export class FormPreguntaRequest {
    idFormPregunta?: number;
    denominacion?: string;
    respuesta?: string;
    formEncuesta?: string;
}