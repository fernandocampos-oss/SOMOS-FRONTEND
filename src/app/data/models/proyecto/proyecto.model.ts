export interface InscripcionRenueva{
  idProyecto?: number,
  enviado?: boolean,
  grupo?: DatosGrupo,
  descripcion?: DescripcionProyecto,
  implementacion?: Implementacion
}

export interface DatosGrupo{
  idProyectoGrupo?: number,
  nombre?: string,
  sede?: string,
  jefe?: string,
  categoria?: string,
  imagenBase64?: string,
  miembros?: miembroGrupo[]
}

export interface miembroGrupo{
  idProyectoMiembro?: number,
  idUsuario?: number,
  numeroDocumento?: string,
  codigoPlanilla?: string,
  cargo?: string,
  nombres?: string,
  apellidos?: string,
  fechaNacimiento?: Date,
  numeroCelular?: string,
  correo?: string,
  red?: string
}

export interface DescripcionProyecto{
  idProyectoDescripcion?: number,
  fecha?: string,
  motivo?: string,
  descripcion?: string,
  contexto?: string,
  innovacion?: string,
  indicador?: string
}

export interface Implementacion{
  idProyectoImplementacion?: number,
  resultado?: string,
  sostenible?: string,
  sostenibleFundamento?: string,
  replicable?: string,
  replicableFundamento?: string,
  tecnologia?: string,
  tecnologiaFundamento?: string,
  beneficio?: string,
  archivoBase64?: string,
  enfoques?: Array<string>
}