export class EncuestaRequest {
    idEncuesta?: number;
    idUsuarioCreacion?: number;
    idUsuarioContesta?: number;
    listPregunta?: PreguntaRequest[];

    fechaRespuesta?: Date;
    finalizado?: boolean;
}

export class PreguntaRequest {
    idPregunta?: number;
    denominacion?: string;
    satisfecho?: boolean;
    porMejorar?: boolean;
    insatisfecho?: boolean;
}

