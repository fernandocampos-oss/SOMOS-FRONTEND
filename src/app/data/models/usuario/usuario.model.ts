import { Role } from '@data/enums';

export class Usuario {
  idUsuario: number;
  numeroDocumento: string;
  codigoPlanilla: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  numeroCelular: string;
  correo: string;
  idSede: number;
  cargo: string;
  red: string;
  idZonaControl: number;
  idRol: Role;
}
