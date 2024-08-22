export class RegistrarRespuestaRequestDto {
    idFormEncuesta?: number;
    denominacion?: string;
  
    listPregunta?: FormPreguntaResponse[];
}

export class FormPreguntaResponse {
    idFormPregunta?: number;
    denominacion?: string;
    respuesta?: string;
    satisfecho?: string;
    porMejorar?: string;
    insatisfecho?: string;
}

