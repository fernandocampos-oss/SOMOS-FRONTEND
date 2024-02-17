export class CronogramaPago {
    idCronogramaPago: number;
    idTipoContrato: number;
    descripcionPeriodo: string;
    fecha: Date;
    tipoPagoAsociados: number[];
    fechaMinima: Date;
    fechaMaxima: Date;
}

export class TipoContrato {
    idTipoContrato: number;
    descripcion: string;
}