export class Tarea1 {
  idEquipoIntegrante?:number;
  fechaInicio?:Date;
  fechaFin?:Date;
  descripcion?:String;
}

export class Informe {
  id?:number
  idTarea?:number
  descripcion?:string
  avance?:number
  estado?:string
}

export class Archivo {
  idEvidencia?:number
  base64: any
  nombreReal: string
  ext: string
  tipo: string
}