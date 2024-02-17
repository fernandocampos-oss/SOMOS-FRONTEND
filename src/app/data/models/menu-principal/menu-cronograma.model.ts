export class CronogramaPago {
    idCronogramaPago: number;
    idTipoContrato: number;
    descripcionPeriodo: string;
    fecha: Date;
    tipoPagoAsociados: number[];
}

export class TipoContrato {
    idTipoContrato: number;
    descripcion: string;
}