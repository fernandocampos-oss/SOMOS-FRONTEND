import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowSstComponent } from '../components/show-sst/show-sst.component';
import { RegisterDatosEncuestaComponent } from '../components/register-datos-encuesta/register-datos-encuesta.component';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { OnomasticosResponse } from '@data/models/menu-principal/menu-principal.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ShowPublicacionComponent } from '../components/show-publicacion/show-publicacion.component';
import { MenuPublicacion } from '@data/models/menu-principal/menu-publicacion.model';

interface fechas_Imp{ // Provisional: para tener las fechas importantes
  descripcion: string;
  dia: Date;
}

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss']
})
export class MenuPrincipalComponent implements OnInit {
  onomasticos: OnomasticosResponse[] = [];
  today = new Date();
  publicacionLong: number = 1;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;

  identificador: number;
  fechas: fechas_Imp[] = [
    {descripcion:'Prueba1',dia: new Date('12/25/2023 00:00:00')},
    {descripcion:'Prueba2',dia: new Date('11/25/2023 00:00:00')},
    {descripcion:'Prueba3',dia: new Date('10/24/2023 00:00:00')},
    {descripcion:'Prueba4',dia: new Date('07/17/2023 00:00:00')},
    {descripcion:'Día de la Madre',dia: new Date('05/14/2023 00:00:00')},
    {descripcion:'Prueba7',dia: new Date('03/01/2023 00:00:00')},
  ]

  // diasElegidos = new Array;
  publicaciones: MenuPublicacion[] = [
    {nom_largo:'Simulacro Nacional Multipeligro - 31 de mayo ' ,nom_corto: 'Simulacro Nacional Multipeligro - 31 de mayo ', fechaPub: '16/05/2023 - 11:53', imgRuta: 'assets/images/p_Simulacro.jpg'},
    {nom_largo:'Biblioteca en 1 minuto-Medicina de urgencias' ,nom_corto: 'Biblioteca en 1 minuto-Medicina de urgencias', fechaPub: '16/05/2023 - 10:54', imgRuta: 'assets/images/p_BiblioMed.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/07_MEDICINA_DE_URGENCIAS_page_0001.pdf'},
    {nom_largo:'Reuniones para brigadistas - Simulacro Nacional Multipeligro 2023' ,nom_corto: 'Reuniones para brigadistas', fechaPub: '16/05/2023 - 10:07', imgRuta: 'assets/images/p_Brigadistas.jpg'},
    {nom_largo:'Campaña de Solidaridad por el Día de la Madre - ¡Gracias por tu apoyo!' ,nom_corto: '¡Gracias por tu apoyo!', fechaPub: '15/05/2023 - 16:37', imgRuta: 'assets/images/p_Grac.jpg'},
    {nom_largo:'Curso sincrónico virtual - Atención Básica de Desastres' ,nom_corto: 'Curso sincrónico virtual - Atención Básica de Desastres', fechaPub: '15/05/2023 - 15:45', imgRuta: 'assets/images/p_CursoDesastres.jpg', redireccion: 'https://forms.gle/527FeQhAuxz8PvaQA'},
    {nom_largo:'Capacitaciones virtuales de Seguridad y Salud en el Trabajo' ,nom_corto: 'Capacitaciones virtuales de Seguridad y Salud en el Trabajo', fechaPub: '15/05/2023 - 14:21', imgRuta: 'assets/images/p_SST.jpg', redireccion: 'https://capacitacion.essalud.gob.pe/login/index.php'},
    {nom_largo:'Concurso de fotografía "El control está en tus manos ¡Mídete la presión arterial!"' ,nom_corto: '¡Mídete la presión arterial!', fechaPub: '12/05/2023 - 14:52', imgRuta: 'assets/images/p_ConFoto.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/concurso_de_fotografia_2023.pdf'},
    {nom_largo:'Curso sincrónico virtual - Manejo de la Vía Aérea Básica' ,nom_corto: 'Curso sincrónico virtual - Manejo de la Vía Aérea Básica', fechaPub: '12/05/2023 - 12:13', imgRuta: 'assets/images/p_CursoVia.jpg', redireccion: 'https://forms.gle/4FCR5mUvFvi9fqMf9'},
    
    {nom_largo:'Curso sincrónico virtual - Soporte Básico del Trauma' ,nom_corto: 'Curso sincrónico virtual - Soporte Básico del Trauma', fechaPub: '11/05/2023 - 15:15', imgRuta: 'assets/images/p_SoporteBas.jpg', redireccion: 'https://forms.gle/PZ3ZKa818CE3mykF6'},
    {nom_largo:'Día de la Madre - Invitación "Agasajo para mamá"' ,nom_corto: 'Día de la Madre - Invitación "Agasajo para mamá"', fechaPub: '10/05/2023 - 16:58', imgRuta: 'assets/images/p_Agasajo.jpg'},
    {nom_largo:'Biblioteca en 1 minuto-Fisiopatología pulmonar' ,nom_corto: 'Biblioteca en 1 minuto-Fisiopatología pulmonar', fechaPub: '10/05/2023 - 11:53', imgRuta: 'assets/images/p_BiblioFisio.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/22_FISIOPATOLOGIA_PULMONAR_page_0001.pdf'},
    {nom_largo:'Difusión selectiva de información especializada sobre urología' ,nom_corto: 'Difusión de información sobre Urología', fechaPub: '10/05/2023 - 09:38', imgRuta: 'assets/images/p_Difusion.jpg', redireccion: 'https://mailchi.mp/173fdd40215e/dsi-biblioteca-central-de-essalud-n-6'},
    {nom_largo:'COMUNICADO: Disposiciones sobre la compensación de la licencia con goce de haber compensable otorgada durante la emergencia sanitaria' ,nom_corto: 'Disposiciones sobre la compensación de la licencia con goce de haber', fechaPub: '10/05/2023 - 08:14', imgRuta: 'assets/images/p_Comunicado.jpg'},
    {nom_largo:'Conferencia: Gobierno de datos en salud' ,nom_corto: 'Conferencia: Gobierno de datos en salud', fechaPub: '09/05/2023 - 17:06', imgRuta: 'assets/images/p_Conferencia.jpg', redireccion: 'https://us02web.zoom.us/j/83572252189?pwd=L01mUHFLS0Y0VUxlYitJWmlnR0dtQT09'},
    {nom_largo:'EsSalud es Sano: ¡Cuidado! Enfermedades cardiovasculares son la mayor causa de muerte en el mundo' ,nom_corto: 'Cuidado con las enfermedades cardiovasculares', fechaPub: '09/05/2023 - 10:08', imgRuta: 'assets/images/p_EnfCardio.jpg', redireccion: 'https://www.youtube.com/@EsSaludPeruOficial/featured'},
    {nom_largo:'EsSalud TV - ¡Envía tu foto por el Día de la Madre!' ,nom_corto: 'EsSalud TV - ¡Envía tu foto por el Día de la Madre!', fechaPub: '09/05/2023 - 09:10', imgRuta: 'assets/images/p_FotoDiaMadr.jpg'},
    {nom_largo:'Reporte de noticias EsSalud - 5, 6 y 7 de mayo' ,nom_corto: 'Reporte de noticias EsSalud - 5, 6 y 7 de mayo', fechaPub: '08/05/2023 - 10:37', imgRuta: 'assets/images/p_Reporte2.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/reporte_de_noticias_05052023.pdf'},
    {nom_largo:'Curso sincrónico virtual: Manejo de Víctimas Múltiples' ,nom_corto: 'Curso sincrónico virtual: Manejo de Víctimas Múltiples', fechaPub: '04/05/2023 - 15:56', imgRuta: 'assets/images/p_ManejoVictimas.jpg', redireccion: 'https://forms.gle/mWHe78x8VjtnJChP8'},
    {nom_largo:'Campaña de Solidaridad por el Día de la Madre - ¡Puedes sumarte hasta el 12 de mayo!' ,nom_corto: '¡Súmate a la Campaña de Solidaridad!', fechaPub: '04/05/2023 - 12:52', imgRuta: 'assets/images/p_CampaniaSolidaridad2.jpg'},
    {nom_largo:'Reporte de noticias EsSalud - 2 de mayo' ,nom_corto: 'Reporte de noticias EsSalud - 2 de mayo', fechaPub: '04/05/2023 - 08:50', imgRuta: 'assets/images/p_Reporte.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/reporte_de_noticias_02052023.pdf'},
    {nom_largo:'Día de la Madre - ¡Inscríbete al spa para mamá! ' ,nom_corto: 'Día de la Madre - ¡Inscríbete al spa para mamá!', fechaPub: '03/05/2023 - 15:13', imgRuta: 'assets/images/p_Spa.jpg'},
    {nom_largo:'Programa de Telecapacitaciones Centro Nacional de Telemedicina - CENATE' ,nom_corto: 'Programa de Telecapacitaciones', fechaPub: '03/05/2023 - 14:31', imgRuta: 'assets/images/p_Telecapacitaciones.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/programacion_telecapacitaciones_2_y_3_mayo_2023.pdf'},
    {nom_largo:'Biblioteca en 1 minuto - Vigilancia epidemiológica en tiempos de COVID-19' ,nom_corto: 'Biblioteca en 1 minuto', fechaPub: '03/05/2023 - 12:53', imgRuta: 'assets/images/p_Biblioteca.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/33_VIGILANCIA_EPIDEMIOLOGICA_page_0001.pdf'},
    {nom_largo:'Programa del Día Mundial de la Higiene de Manos' ,nom_corto: 'Programa del Día Mundial de la Higiene de Manos', fechaPub: '03/05/2023 - 10:36', imgRuta: 'assets/images/p_diaHigiene.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/programa_dia_mundial_de_higiene_de_manos_2023.pdf'},
    {nom_largo:'EsSalud es Sano: ¿Tienes artritis? Conoce los alimentos que debes añadir a tu dieta' ,nom_corto: '¿Tienes artritis?', fechaPub: '02/05/2023 - 10:18', imgRuta: 'assets/images/p_artritis.jpg', redireccion: 'https://www.youtube.com/@EsSaludPeruOficial/featured'},
    {nom_largo:'Programa de asesoría personalizada: análisis estadístico 2023' ,nom_corto: 'Asesoría personalizada: Análisis estadístico', fechaPub: '02/05/2023 - 09:23', imgRuta: 'assets/images/p_programaAsesoria.jpg', redireccion: 'https://redcap.link/mentoriaanalisisbasededatos'},
    {nom_largo:'Programa de formación científica - Análisis de datos 2023' ,nom_corto: 'Formación científica: Análisis de datos', fechaPub: '02/05/2023 - 08:54', imgRuta: 'assets/images/p_programaFormacion.jpg', redireccion: 'https://redcap.link/PFCanalisisdedatos2023'},
    {nom_largo:'¡Feliz Día del Trabajo! - Saludo del Presidente Ejecutivo' ,nom_corto: 'Saludo del Presidente Ejecutivo', fechaPub: '27/04/2023 - 17:25', imgRuta: 'assets/images/p_mensaje.jpg', redireccion: 'https://portal.essalud.gob.pe/index.php/dia-internacional-del-trabajo-2023/'},
    {nom_largo:'Capacitaciones presenciales - Escuela de Emergencia' ,nom_corto: 'Cronograma capacitaciones mayo 2023', fechaPub: '27/04/2023 - 14:27', imgRuta: 'assets/images/p_Cronograma.jpg'},
    {nom_largo:'Campaña integral de salud por el Día del Trabajo' ,nom_corto: 'Campaña de salud integral', fechaPub: '26/04/2023 - 16:15', imgRuta: 'assets/images/p_diaTrabajo_2.jpg'},
    {nom_largo:'Invitación - Día del Trabajo en EsSalud' ,nom_corto: 'Anuncio Actividades 27 de abril', fechaPub: '26/04/2023 - 13:31', imgRuta: 'assets/images/p_diaTrabajo_1.jpg'},
    {nom_largo:'Turismo y Diversión - Full Day Antioquía' ,nom_corto: 'Visita Turística a Antioquía', fechaPub: '26/04/2023 - 10:55', imgRuta: 'assets/images/p_Turismo.jpg'},
    {nom_largo:'Campaña de solidaridad por el Día de la Madre' ,nom_corto: 'Campaña por el Día de la Madre', fechaPub: '26/04/2023 - 10:42', imgRuta: 'assets/images/p_CampSolidaridad.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/FORMATO_DE_DONACION_2023.docx'},
    {nom_largo:'Feria Agropecuaria - 26 de abril' ,nom_corto: 'Feria Agropecuaria', fechaPub: '26/04/2023 - 08:39', imgRuta: 'assets/images/p_Agropecuaria.jpg'},
    {nom_largo:'Día de la Secretaria' ,nom_corto: 'Día de la Secretaria', fechaPub: '26/04/2023 - 10:00', imgRuta: 'assets/images/p_DiaSecretaria.jpg'},
    {nom_largo:'Feliz Aniversario al Hospital II Tarapoto San Martin- Red Asistencial Tarapoto' ,nom_corto: 'Aniversario Hospital II Tarapoto - San Martín', fechaPub: '25/04/2023 - 11:17', imgRuta: 'assets/images/p_Tarapoto.jpg'},
    {nom_largo:'Aprobación del Código Buenas Prácticas Estadísticas - Gerencia Central de Planeamiento y Presupuesto' ,nom_corto: 'Aviso de Buenas prácticas estadísticas', fechaPub: '25/04/2023 - 10:12', imgRuta: 'assets/images/p_Aviso.jpg', redireccion: 'http://intranet.essalud/portal/GCPP/pdfs/R_GCPyP_002_GCPP_ESSALUD_2023.pdf'},
    {nom_largo:'Cruzada solidaria' ,nom_corto: 'Cruzada Solidaria', fechaPub: '24/04/2023 - 16:56', imgRuta: 'assets/images/p_Cruzada.jpg'},
    {nom_largo:'Aniversarios Establecimientos de Salud' ,nom_corto: 'Aniversarios Establecimientos de Salud', fechaPub: '24/04/2023 - 15:33', imgRuta: 'assets/images/p_Aniversario27.jpg'},
    {nom_largo:'Yo Trabajo con Integridad: reconocimiento público al personal de EsSalud' ,nom_corto: 'Normativa de trabajo con integridad', fechaPub: '24/04/2023 - 14:31', imgRuta: 'assets/images/p_TrabajoIntegridad.jpg', redireccion: 'https://ww1.essalud.gob.pe/ofin/wp-content/uploads/2023/03/RESOLUCION-N%C2%B0423-GG-ESSALUD-202320230315_08214357.pdf'},
    {nom_largo:'Talleres de Productividad' ,nom_corto: 'Talleres de Productividad', fechaPub: '15/04/2023 - 12:00', imgRuta: 'assets/images/p_Taller_de_productividad_1.jpg'},
  ]

  encuestaRespondida = false;
  encuestaNombre: string;

  diaHoy = this.today.getDate();
  mesHoy = this.today.getMonth()+1;

  newdata: any;
  parametros = {
    mesConsulta: '',
    diaConsulta: '',
  }
  constructor(private dialog: MatDialog,
              private _menuService:MenuPrincipalService,
              private responsive  : BreakpointObserver) { }

  ngOnInit(): void {
    this.identificador = this.nearestDay(this.today);
    this.responsive.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.XSmall,   
      Breakpoints.Small,   
      Breakpoints.TabletLandscape,
      ])
      .subscribe(result => {
        this.publicacionLong = 1; 
        if (result.matches) {
          this.publicacionLong = 2;
        }
      });
    
    this.convertirDiaMes(this.diaHoy, this.mesHoy);
    this.CargarOnomasticos();
    if((this.fechas[this.identificador].dia.getMonth() >= this.today.getMonth() && this.fechas[this.identificador].dia.getDate() > this.today.getDate() 
     && this.fechas[this.identificador].dia.getFullYear() >= this.today.getFullYear() )){
      this.getDateDiff(this.fechas[this.identificador].dia,this.today);// Provisional: para tener las fechas importantes
      setInterval(() => {  
       var Actualidad;
       this._menuService.getDiaAhora().then(async (data: any) => {
        Actualidad = new Date(data.datetime);
        this.getDateDiff(this.fechas[this.identificador].dia,Actualidad);
       }) ;
      }, 30000); // Mil es 1 seg
    }
    else{
      this.daysLeft= 0;
      this.hoursLeft = 0;
      this.minutesLeft = 0;
    }

    this._menuService.getEncuestaActiva().subscribe(data => {if (data == null){ this.encuestaRespondida= true }
    else{ this.encuestaNombre = data.descripcion}});
  }

  open(cuadro: number){
    switch (cuadro) {
      case 1:
      const dialogRef: MatDialogRef<ShowSstComponent> = this.dialog.open(ShowSstComponent, {
          disableClose: false,
          width: '80%',
          autoFocus: false,
        });
          break;
      case 2:
        const dialogRef2: MatDialogRef<RegisterDatosEncuestaComponent> = this.dialog.open(RegisterDatosEncuestaComponent, {
          disableClose: true,
          minWidth: '22em',
          maxWidth:'40em',
          maxHeight:'50em',
          autoFocus: false,
        });
        dialogRef2.afterClosed().subscribe(result => {
          this._menuService.getEncuestaActiva().subscribe(data => {if (data == null) this.encuestaRespondida= true });
        });
          break;
    }
  }

  showPublicacion(publicacionData){
    const dialogRef: MatDialogRef<ShowPublicacionComponent> = this.dialog.open(ShowPublicacionComponent, {
      disableClose: false,
      width: '728px',
      minHeight: '20%',
      maxHeight: '780px',
      autoFocus: false,
      data: {
        obj : publicacionData
      }
    });
  }

  nearestDay(hoy: Date){
    const target = hoy.getTime();
    var nearest = Infinity;
    var winner = -1;
    this.fechas.forEach(function(diaDate, index){
      if(diaDate.dia.getMonth() >= hoy.getMonth() && diaDate.dia.getDate() > hoy.getDate()
      && diaDate.dia.getFullYear() >= hoy.getFullYear()){
        var diaD:number;
        if (diaDate.dia instanceof Date) {
          diaD = diaDate.dia.getTime();   
        }
        var distance = Math.abs(diaD - target);
        if ( distance < nearest && distance>= 0){
          nearest = distance;
          winner = index;
        }
      }
    });
    if(winner == -1)
      winner = 0;
    return winner;
  }
  convertirDiaMes(dia: number, mes: number){
    if (dia >= 10) {
      this.parametros.diaConsulta = dia.toString();
    }
    else{
      this.parametros.diaConsulta = `0${dia.toString()}`;
    }

    if (mes >= 10) {
      this.parametros.mesConsulta = mes.toString();
    }
    else{
      this.parametros.mesConsulta = `0${mes.toString()}`;
    }
  }

  CargarOnomasticos(){
    this._menuService.searchOnomasticos(this.parametros).subscribe(data=>{
      if (data.length > 0) {
        this.onomasticos = data.sort((a,b) => a.nombres.localeCompare(b.nombres));
      } else {
        this.onomasticos=null;
      }
    });
  }

  ActualizarOnomasticos(fecha: string){
    this.parametros.diaConsulta = `${fecha[0]}${fecha[1]}`;
    this.parametros.mesConsulta = `${fecha[3]}${fecha[4]}`;
    this.CargarOnomasticos();
  }

  getDateDiff(endDate: Date, startDate: Date){
    var delta = Math.abs(Number(endDate) - Number(startDate)) / 1000;

    // calculate (and subtract) whole days
    this.daysLeft = Math.floor(delta / 86400);
    delta -= this.daysLeft * 86400;

    // calculate (and subtract) whole hours
    this.hoursLeft = Math.floor(delta / 3600) % 24;
    delta -= this.hoursLeft * 3600;

    // calculate (and subtract) whole minutes
    this.minutesLeft = Math.floor(delta / 60) % 60;
    delta -= this.minutesLeft * 60;
  }

}
