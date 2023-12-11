export class RequestUsuarioUpdateData {
  correo: string;
  numeroCelular: string;
  imagenPerfilBase64: string;
  imagenFirmaBase64: string;
}

export class RequestConfirmCorreo {
  token: string;
  nuevoCorreo: string;
}