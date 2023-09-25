export class AdministracionRedesResponse {    
    usuarios: UsuarioInformacionResponseDto[];
    redes: RedPersonal[];
}
export class UsuarioInformacionResponseDto {
    numeroDocumento: string;
    codigoPlanilla: string;
    nombres: string;
    apellidos: string;
    fechaCreacion: Date;
    regimen: string;
    cargo: string;
    codRed: string;
    descripcionRed: string;
    codUnidad: string;
    descripcionUnidad: string;
    sexo: string;
}
export class RedPersonal {
    codRed: string;
    descripcion: string;
}

export class RedesDatos{
    datosRedes: RedDato[];
    cuentaTotalUsuarios: number;
    cuentaAsistenciales: number;
    cuentaAdministrativos: number;
}

export class RedDato{
    codRed: string;
    descripcion: string;
    cantidad: number;
    personalAsistencial: number;
    personalAdministrativo: number;
}

export class RequestDatosUsuarios{
    codRed: string;
    cantidad: number;
}