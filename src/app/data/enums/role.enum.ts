export enum Role {
  TRABAJADOR = 1,
  CONTROL_ACCESO = 2,
  ADMIN_SEDE = 3,
  ADMIN_CENTRAL = 4,
}

export enum SegmentoVotante {
  DIRECTIVO = 1,
  OPERADOR = 2,
  EJECUTOR = 3,
  MANDO_MEDIO = 4,
  //este rol no se guarda en base de datos, se evalua al momento de cargar los accesos dependiendo 
  //si tiene asignado un equipo como evaluador
  EVALUADOR = 5, 
}