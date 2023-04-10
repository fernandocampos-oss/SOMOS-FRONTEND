export interface UsuarioRegisterRequest {
  numeroDocumento: string;
  codigoPlanilla: string;
  fechaNacimiento: Date;
  numeroCelular: string;
  correo: string;
  password: string;
}

export interface UsuarioRegisterResponse {
  token: string;
  idUsuario: number;
}
