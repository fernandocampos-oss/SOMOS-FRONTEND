export interface Requerimiento{
    id: number;
    nombreRequerimiento: string;
    descripcion: string;
    tipoRequerimiento: string;
    gerenciaSolicitante: string;
    gerenciaReceptora: string;
    estado: string;
    motivo?: string;
    actividad?: string;
    tareas?: Tarea[];
}

export interface RequerimientoAsignado{
    id: number;
    actividad: string;
    tareas: Tarea[];
}

export interface Tarea{
    //id: number;
    nombreTarea: string;
    plazo: string;
    idPersonaAsignada?: string; //para almacenar el nombre ya q no hay id esta como string
}