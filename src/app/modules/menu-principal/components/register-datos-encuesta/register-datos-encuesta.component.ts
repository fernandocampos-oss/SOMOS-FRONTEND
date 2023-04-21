import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, NotificationService } from '@core/services';
import { constants } from 'buffer';

interface sede_Demo{
  descripcion: string;
}
interface grupoPers_Demo{
  descripcion: string;
}
interface areaPers_Demo{
  descripcion: string;
}
interface tiempoServicio_Demo{
  descripcion: string;
}
interface questions{
  id: number;
  num: number;
  descripcion: string;
}
@Component({
  selector: 'app-register-datos-encuesta',
  templateUrl: './register-datos-encuesta.component.html',
  styleUrls: ['./register-datos-encuesta.component.scss']
})
export class RegisterDatosEncuestaComponent implements OnInit {

  form: FormGroup;
  ansValue: number;
  answers(){
    return this._fb.group({valor: this.ansValue,})
  }
  selectedIndex=0;
  sedes: sede_Demo[] = [
    {descripcion:'Central'},
    {descripcion:'INCOR'},
    {descripcion:'Salud Renal'},
  ]
  gruposPers: grupoPers_Demo[] = [
    {descripcion:'D.L 276'},
    {descripcion:'D.L 728'},
    {descripcion:'D.L 1057'},
  ]
  areasP: areaPers_Demo[] = [
    {descripcion:'Auxiliar'},
    {descripcion:'Ejecutivo'},
    {descripcion:'Profesional'},
    {descripcion:'Técnico'},
    {descripcion:'Residente'},
  ]
  tiemposServ: tiempoServicio_Demo[] = [
    {descripcion:'Menor a 06 meses'},
    {descripcion:'De 06 meses a 1 año'},
    {descripcion:'De 1 año 1 día hasta 5 años'},
    {descripcion:'De 5 años 1 día hasta 10 años'},
    {descripcion:'De 10 años 1 día hasta 15 años'},
    {descripcion:'De 15 años 1 día a más'},
  ]
  preguntas: questions[] = [
    {id: 1, num: 1, descripcion:'ESSALUD me ofrece capacitación y entrenamiento con el objetivo de promover mi desarrollo profesional.'},
    {id: 2, num: 2, descripcion:'Los cursos de capacitación que he seguido me han permitido  realizar mi trabajo de manera efectiva.'},
    {id: 3, num: 3, descripcion:'Los planes de capacitación se aplican a todos los niveles de la institución.'},
    {id: 4, num: 4, descripcion:'La institución me brinda desafíos y experiencias para promover mi desarrollo.'},
    {id: 5, num: 5, descripcion:'Tengo oportunidad de aplicar mis conocimientos y habilidades en la institución.'},
    {id: 6, num: 6, descripcion:'Mis funciones son desafiantes lo que resulta agradable para mi crecimiento profesional.'},
    {id: 7, num: 7, descripcion:'ESSALUD reconoce y valora el buen desempeño laboral.'},
    {id: 8, num: 8, descripcion:'Considero que mis labores en ESSALUD son reconocidas y consideradas por mis superiores'},
    {id: 9, num: 9, descripcion:'Mi jefe inmediato muestra aprecio y reconocimiento por el buen trabajo y el esfuerzo extra que realizo.'},
    {id: 10, num: 10, descripcion:'La empresa brinda las mismas oportunidades de desarrollo a todos sus trabajadores.'},
    {id: 11, num: 11, descripcion:'Los colaboradores sienten que son tratados de manera justa y equitativa.'},
    {id: 12, num: 12, descripcion:'Si considero que se me ha tratado injustamente o se ha cometido algún error, sé que tendré la oportunidad de ser escuchado.'},
    {id: 13, num: 13, descripcion:'En mi trabajo por lo general se atiende con empatía, calidad y calidez a los asegurados. Sin importar su condición socioeconómica, de raza, credo o afinidad ideológica.'},
    {id: 14, num: 14, descripcion:'La gestión de mi entidad está comprometida en mejorar la cobertura y calidad de los servicios otorgados al asegurado.'},
    {id: 15, num: 15, descripcion:'En esta institución nos distinguimos por brindar un excelente trato a nuestro asegurado.'},
    {id: 16, num: 16, descripcion:'El servicio al asegurado es un valor importante para esta institucion '},
    {id: 17, num: 17, descripcion:'Los colaboradores demuestran con sus acciones su vocación de servicio.'},
    {id: 18, num: 18, descripcion:'En esta institución nos caracterizamos por brindar atención oportuna a nuestros asegurados con calidez y eficacia.'},
    {id: 19, num: 19, descripcion:'En esta institución se trabaja de manera colaborativa en las tareas encomendadas.'},
    {id: 20, num: 20, descripcion:'Los colaboradores de otras áreas de trabajo nos brindan información veraz y oportuna para la mejora del servicio u oficina.'},
    {id: 21, num: 21, descripcion:'En mi área de trabajo laboramos tomando en cuenta las opiniones de todos.'},
    {id: 22, num: 22, descripcion:'Los lideres conducen la institución de manera ética y honesta'},
    {id: 23, num: 23, descripcion:'Los líderes son  abiertos y honestos en sus comunicaciones.'},
    {id: 24, num: 24, descripcion:'Los lideres  tienen la capacidad de poder llevar la institución a un buen desarrollo y crecimiento.'},
    {id: 25, num: 25, descripcion:'Me siento motivado por mi jefe de trabajo para realizar las tareas que se me asignan.'},
    {id: 26, num: 26, descripcion:'Mi jefe demuestra tener conocimientos y habilidades para gestionar el área o servicio de manera eficiente.'},
    {id: 27, num: 27, descripcion:'Mi jefe inmediato toma en cuenta nuestros aportes e ideas'},
    {id: 28, num: 28, descripcion:'Existe interés de parte de mi jefe por el cumplimiento de las metas y objetivos propuestos.'},
    {id: 29, num: 29, descripcion:'Mi jefe cuenta con las destrezas necesarias para interactuar y relacionarse apropiadamente con otras personas.'},
    {id: 30, num: 30, descripcion:'Mi jefe tiene una visión clara a dónde va la organización y que hacer para lograrlo.'},
    {id: 31, num: 31, descripcion:'Mi jefe inmediato me mantiene informado acerca de cosas y cambios importantes.'},
    {id: 32, num: 32, descripcion:'Puedo realizar una pregunta razonable a mi jefe inmediato y recibir una respuesta directa'},
    {id: 33, num: 33, descripcion:'Los jefes comunican claramente qué se espera de nuestro trabajo.'},
    {id: 34, num: 34, descripcion:'En nuestro medio, ESSALUD es reconocida como una de las mejores instituciones en salud.'},
    {id: 35, num: 35, descripcion:'Siento orgullo de ser  parte de Essalud.'},
    {id: 36, num: 36, descripcion:'Recomendaria esta intitución a mis amigos y colegas como un buen lugar para trabajar.'},
    {id: 37, num: 37, descripcion:'En general hay mucho compañerismo en mi servicio o área de trabajo'},
    {id: 38, num: 38, descripcion:'Creo que mis compañeros y yo estamos unidos y nos llevamos bien.'},
    {id: 39, num: 39, descripcion:'Mis compañeros me ayudaron y apoyaron los primeros dias cuando me incorporé a la institución.'},
    {id: 40, num: 40, descripcion:'ESSALUD se interesa por el bienestar físico, emocional y psicológico de los trabajadores poniendo en practica actividades saludables.'},
    {id: 41, num: 41, descripcion:'Essalud cuida la salud de sus trabajadores propiciando actividades como campañas preventivas-promocionales de la salud y charlas educativas.'},
    {id: 42, num: 42, descripcion:'Este es un lugar fisica y emocionalmente seguro donde trabajar.'},
    {id: 43, num: 43, descripcion:'Los trabajadores cuentan con las herramientas, equipos y recursos necesarios para realizar sus labores.'},
    {id: 44, num: 44, descripcion:'En terminos generales, este en un buen lugar para trabajar'},   
  ]
  constructor(private _notification   : NotificationService,
              private _fb             : FormBuilder,
              private _dialogService  : DialogService,) { }

  ngOnInit(): void {
    this._createForm();
    this.form.value.frmRespuestas = 1;
  }
  
  onTabChanged(event){
    if(event.index==1 && !this.form.valid){
      this.selectedIndex=0;
      this._notification.error("Se deben ingresar los datos para continuar");
    }
  }
  

  private _createForm() {
    this.form = this._fb.group({
      frmSede             : [null,[Validators.required]],
      frmGrupoPersonal    : [null,[Validators.required]],
      frmAreaPersonal     : [null,[Validators.required]],
      frmTiempoServicio   : [null,[Validators.required]],
      frmRespuestas       : this._fb.array([this.answers()]),
    });
  }
  
  next(){
    this.selectedIndex=1;
  }
  sendInfo(){
    const title = `Encuesta enviada satisfactoriamente`;
    const message = `¡Gracias por responder la encuesta!`;
    this._dialogService.success(message,title);
  }
  getfrmRespuestas(index) {
    return this.form.controls["frmRespuestas"] as FormArray;
  }

  changeSelection(index: number,valor: number){
    this.form.value.frmRespuestas[index] = valor;
  }

  validarEncuesta(): boolean{
    if (this.form.value.frmRespuestas.length == 44 ) {
      if (this.form.value.frmRespuestas.includes(undefined)) {
        return false;        
      }
      else{
        return true;
      }
    }
    else{
      return false;
    }
  }
}
