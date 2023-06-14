export interface Requerimiento{
    id: number;
    nombreRequerimiento: string;
    descripcion: string;
    medio: string;
    documentoIdentificador: string;
    gerenciaSolicitante: string;
    gerenciaReceptora: string;
    estado: string;
    motivo?: string;
    actividad?: string;
}

export interface Requerimiento_Integrante{
    idReq: number;
    idIntegrante: number;
    nombreTarea: string;
    plazo: string;
    estado: string; //PENDIENTE, FINALIZADO, RECHAZADO
    avance: number;
    tareas?: Informes[];
}

export interface Informes{
    //id: number;
    descripcionInforme: string;
    avanceRepresentado: number;
    fechaCreacion: string;
}

//Seguro son temporales
export interface Equipo{
    id: number;
    nombrePersona: string;
    cargo: string;
}