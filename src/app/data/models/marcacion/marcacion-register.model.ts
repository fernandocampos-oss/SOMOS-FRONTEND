import { TipoMarcacion } from '@data/enums/tipo-marcacion.enum';

class MarcacionBase {
  latitud: string;
  longitud: string;
  idTipoMarcacion: TipoMarcacion;
}


export class MarcacionRegister extends MarcacionBase {
  token: string;
}

export class MarcacionAdminRegisterUpdate extends MarcacionBase {
  idUsuario: number;
  fechaMarcacion: Date;
}

export class MarcacionTrabajadorRegister extends MarcacionBase {
  token: string;
  numeroDocumento: string;
}
