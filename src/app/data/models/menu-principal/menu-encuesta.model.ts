export interface MenuEncuestaShow {
    idEncuesta: number;
    descripcion: string;
    preguntas: preguntas[];
    datosDemograficos: datosDemograficos[];
}
export interface preguntas {
    idPregunta: number;
    descripcion: string;
    alternativas: alternativas[];
}
export interface alternativas {
    idAlternativa: number;
    descripcion: string;
    valor: number;
}

export interface datosDemograficos{
    areasPersonales: areasPersonales[];
    gruposPersonales: gruposPersonales[];
    sedes: sedes[];
    tiemposDeServicios: tiemposDeServicios[];
}

export interface areasPersonales {
    idAreaPersonal: number;
    descripcion: string;
}
export interface gruposPersonales {
    idGrupoPersonal: number;
    descripcion: string;
}
export interface sedes {
    idSede: number;
    descripcion: string;
}
export interface tiemposDeServicios {
    idTiempoServicio: number;
    descripcion: string;
}

export interface encuestaRespuesta{
    idSede: number;
    idGrupoPersonal: number;
    idAreaPersonal: number;
    idTiempoServicio: number;
    respuestas: respuestaUnitaria[];
}

export interface respuestaUnitaria{
    idPregunta: number;
    idAlternativa: number;
}