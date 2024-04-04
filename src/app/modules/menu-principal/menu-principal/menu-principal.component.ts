import { Component, OnInit } from '@angular/core';
import { ajax }from 'rxjs/ajax';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowSstComponent } from '../components/show-sst/show-sst.component';
import { RegisterDatosEncuestaComponent } from '../components/register-datos-encuesta/register-datos-encuesta.component';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { OnomasticosResponse } from '@data/models/menu-principal/menu-principal.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ShowPublicacionComponent } from '../components/show-publicacion/show-publicacion.component';
import { PublicacionResponse } from '@data/models/menu-principal/menu-publicacion.model';
import { AdmPublicaciones } from '../components/adm-publicaciones/adm-publicaciones.component';
import { AuthService, UsuarioService } from '@data/services';
import { ShowPaymentCalendarComponent } from '../components/show-payment-calendar/show-payment-calendar.component';
import { EncuestaSimpleComponent } from '../components/encuesta-simple/encuesta-simple.component';
import { ShowSistemasComponent } from '../components/show-sistemas/show-sistemas.component';
import { AppRoute } from '@data/constants';
import { Role } from '@data/enums';
import { RegisterInscripcionComponent } from '../components/inscripciones/register-inscripcion/register-inscripcion.component';
import { RegisterVoteInscripcionComponent } from '../components/inscripciones/register-vote-inscripcion/register-vote-inscripcion.component';
import {
  AdmCronogramaPagosComponent
} from '@modules/menu-principal/components/adm-cronograma-pagos/adm-cronograma-pagos.component';

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
  mostrarEleccion = false;
  numDocUsuario = '';

  idPublicacionCambiar = 100;

  onomasticos: OnomasticosResponse[] = [];
  today = new Date();
  interfazCelular: boolean;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;

  rol: number;
  identificador: number;
  fechas: fechas_Imp[] = [
    {descripcion:'No Hay Fecha',dia: new Date('12/21/2012 00:00:00')},
    {descripcion:'Día del Trabajo',dia: new Date('05/01/2024 00:00:00')},
    {descripcion:'Batalla de Arica y Día de la Bandera',dia: new Date('06/07/2024 00:00:00')},
    {descripcion:'Día de San Pedro y San Pablo',dia: new Date('06/29/2024 00:00:00')},
    {descripcion:'Día de la Fuerza Aérea del Perú',dia: new Date('07/23/2024 00:00:00')},
    {descripcion:'Día no laborable para el sector público',dia: new Date('07/26/2024 00:00:00')},
    {descripcion:'Día de la Independencia',dia: new Date('07/28/2024 00:00:00')},
    {descripcion:'Fiestas Patrias',dia: new Date('07/29/2024 00:00:00')},
    {descripcion:'Batalla de Junín',dia: new Date('08/06/2024 00:00:00')},   
    {descripcion:'Santa Rosa de Lima',dia: new Date('08/30/2024 00:00:00')},
    {descripcion:'Día no laborable para el sector público',dia: new Date('10/07/2024 00:00:00')},
    {descripcion:'Combate de Angamos',dia: new Date('10/08/2024 00:00:00')},
    {descripcion:'Día de Todos los Santos',dia: new Date('11/01/2024 00:00:00')},
    {descripcion:'Día no laborable para el sector público',dia: new Date('12/06/2024 00:00:00')},
    {descripcion:'Inmaculada Concepción',dia: new Date('12/08/2024 00:00:00')},
    {descripcion:'Batalla de Ayacucho',dia: new Date('12/09/2024 00:00:00')},
    {descripcion:'Día no laborable para el sector público',dia: new Date('12/23/2024 00:00:00')},
    {descripcion:'Día no laborable para el sector público',dia: new Date('12/24/2024 00:00:00')},
    {descripcion:'Día no laborable para el sector público',dia: new Date('12/25/2024 00:00:00')},
    {descripcion:'Navidad',dia: new Date('12/30/2024 00:00:00')},
    {descripcion:'Día no laborable para el sector público',dia: new Date('12/31/2024 00:00:00')},
    {descripcion:'Prueba 4',dia: new Date('01/01/2022 00:00:00')},
  ]

  publicacionAnclada: PublicacionResponse;
  publicaciones: PublicacionResponse[] = [];
  encuestaRespondida = false;
  encuestaNombre: string;

  showPublicaciones = true;
  showCumple = false;
  showCountdown = false;

  parametros = {
    mesConsulta: '',
    diaConsulta: '',
  }

  path = AppRoute.ADMINISTRAR_ROL_RED;
  pathRenueva = AppRoute.RENUEVA_ESSALUD;

  //roles
  rolCentral = Role.ADMIN_CENTRAL;
  rolRed = Role.ADMIN_SEDE;
  rolTemporal_3: any;
  rolTemporal_4: any;
  roles: any;

  constructor(private dialog: MatDialog,
              private _menuService:MenuPrincipalService,
              private responsive  : BreakpointObserver,
              private userService  : UsuarioService,
              private _authService: AuthService) { }

  ngOnInit(): void {
    this.userService.get(this._authService.getUserSession().id).subscribe(data=>{
      if(this._menuService.returnPadron(data.numeroDocumento)){
        this.mostrarEleccion = true;
      }
    })
    this.rol = this._authService.getRol();
    this.identificador = this.nearestDay(this.today);
    this.responsive.observe([
      Breakpoints.XSmall
      ])
      .subscribe(result => {
        this.interfazCelular = false;
        if (result.matches) {
          this.interfazCelular = true;
        }
      });
    
    this.actualizarPublicaciones();
    
    this.convertirDiaMes(this.today.getDate(), this.today.getMonth()+1);
    this.CargarOnomasticos();
    if(this.identificador != 0){
      this.getDateDiff(this.fechas[this.identificador].dia,this.today);// Provisional: para tener las fechas importantes
      setInterval(() => {  
      var Actualidad = new Date();
      this.getDateDiff(this.fechas[this.identificador].dia,Actualidad);
      }, 30000); // Mil es 1 seg
    }
    else{
      this.daysLeft= 0;
      this.hoursLeft = 0;
      this.minutesLeft = 0;
    }
    this.getRoles();

    // this._menuService.getEncuestaActiva().subscribe(data => {
    //   console.log(data);
    //   if (data == null){ this.encuestaRespondida= true }
    // else{ this.encuestaNombre = data.descripcion}});
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
      // case 2:
      //   const dialogRef2: MatDialogRef<RegisterDatosEncuestaComponent> = this.dialog.open(RegisterDatosEncuestaComponent, {
      //     disableClose: true,
      //     minWidth: '22em',
      //     maxWidth:'40em',
      //     maxHeight:'50em',
      //     autoFocus: false,
      //   });
      //   dialogRef2.afterClosed().subscribe(result => {
      //     this._menuService.getEncuestaActiva().subscribe(data => {if (data == null) this.encuestaRespondida= true });
      //   });
      //     break;
      case 3:
        const dialogRef3: MatDialogRef<AdmPublicaciones> = this.dialog.open(AdmPublicaciones, {
          disableClose: false,
          width:'70vw',
          maxHeight:'50em',
        });
        dialogRef3.afterClosed().subscribe(result => {
          this.actualizarPublicaciones()
        });
          break;
      case 4:
        const dialogRef4: MatDialogRef<ShowSistemasComponent> = this.dialog.open(ShowSistemasComponent, {
            disableClose: false,
            width: '70%',
            autoFocus: false,
          });
          break;
      case 5:
        const dialogRef5: MatDialogRef<AdmCronogramaPagosComponent> = this.dialog.open(AdmCronogramaPagosComponent, {
          disableClose: false,
          width: '70vw',
          maxHeight: '50em'
        });
        break;
    }
  }

  actualizarPublicaciones(){
    this._menuService.getPublicaciones().subscribe( (data) => {
      console.log(data)
      this.publicaciones = data;

      this.publicaciones.sort(({ votoActivo: stateA = false }, { votoActivo: stateB = false }) =>
      Number(stateB) - Number(stateA));

      this.publicacionAnclada = null;

      this.publicaciones.forEach((x)=>{
        if (x.idPublicacion == 56) {
          this.publicacionAnclada = x;
        }
      })
    }
    );
  }

  showEncuestaSimple(element){
    const dialogRef: MatDialogRef<EncuestaSimpleComponent> = this.dialog.open(EncuestaSimpleComponent, {
      disableClose: false,
      minWidth: '22em',
      maxWidth:'40em',
      autoFocus: false,
      data:{
        obj: element
      }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const dialogRef2: MatDialogRef<EncuestaSimpleComponent> = this.dialog.open(EncuestaSimpleComponent, {
            disableClose: false,
            minWidth: '22em',
            maxWidth:'40em',
            autoFocus: false,
            data:{
              obj: element
            }
            });
        }
      });
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
      if((diaDate.dia.getMonth() >= hoy.getMonth() && diaDate.dia.getDate() > hoy.getDate()
      && diaDate.dia.getFullYear() >= hoy.getFullYear()) || (diaDate.dia.getMonth() > hoy.getMonth() && diaDate.dia.getFullYear() >= hoy.getFullYear()) || (diaDate.dia.getFullYear() > hoy.getFullYear())){
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

  changeVisual(option: number){
    switch (option) {
      case 1:
        this.showPublicaciones = true;
        this.showCumple = false;
        this.showCountdown = false;
        break;
      case 2:
        this.showPublicaciones = false;
        this.showCumple = true;
        this.showCountdown = false;
        break;
      case 3:
        this.showPublicaciones = false;
        this.showCumple = false;
        this.showCountdown = true;
        break;
    }
  }

  getRoles() {
    let temporal = sessionStorage.getItem('_roles');
    this.roles = temporal ? `${temporal}` : '';
    this.roles = JSON.parse(temporal);
    if (this.roles.length == 1) {
      if (this.roles[0] === 'ROLE_3') {
        this.rolTemporal_3 = 3;
      }
      if (this.roles[0] === 'ROLE_4') {
        this.rolTemporal_4 = 4;
      }
    } else {
      if (this.roles[0] === 'ROLE_3') {
        this.rolTemporal_3 = 3;
      }
      if (this.roles[1] === 'ROLE_4') {
        this.rolTemporal_4 = 4;
      }
    }
  }

  showinscripcionView(publicacionData){
    if(publicacionData.votoActivo){
      const dialogRef: MatDialogRef<RegisterVoteInscripcionComponent> = this.dialog.open(RegisterVoteInscripcionComponent, {
        disableClose: false,
        minWidth: '22em',
        width: '1000px',
        maxWidth:'40em',
        autoFocus: false,
        data:{
          idInscripcion: publicacionData.idInscripcion
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const dialogRef2: MatDialogRef<RegisterVoteInscripcionComponent> = this.dialog.open(RegisterVoteInscripcionComponent, {
            disableClose: false,
            minWidth: '22em',
            width: '1000px',
            maxWidth:'40em',
            autoFocus: false,
            data:{
              idInscripcion: publicacionData.idInscripcion
            }
            });
        }
      });
    }
    else{
      const dialogRef: MatDialogRef<RegisterInscripcionComponent> = this.dialog.open(RegisterInscripcionComponent, {
        disableClose: false,
        // minWidth: '22em',
        maxWidth:'480px',
        autoFocus: false,
        data:{
          idInscripcion: publicacionData.idInscripcion,
          pubData: {
            imagenBase64: publicacionData.imagenBase64,
            titulo: publicacionData.titulo,
            urlRedireccion: publicacionData.urlRedireccion
          }
        }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            const dialogRef2: MatDialogRef<RegisterInscripcionComponent> = this.dialog.open(RegisterInscripcionComponent, {
              disableClose: false,
              // minWidth: '22em',
              maxWidth:'480px',
              autoFocus: false,
              data:{
                idInscripcion: publicacionData.idInscripcion,
                pubData: {
                  imagenBase64: publicacionData.imagenBase64,
                  titulo: publicacionData.titulo
                }
              }
              });
          }
        });
    }
  }

}
