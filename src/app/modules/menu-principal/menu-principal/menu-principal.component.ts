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
import { AuthService } from '@data/services';
import { ShowPaymentCalendarComponent } from '../components/show-payment-calendar/show-payment-calendar.component';
import { EncuestaSimpleComponent } from '../components/encuesta-simple/encuesta-simple.component';

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
  interfazCelular: boolean;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;

  rol: number;
  identificador: number;
  fechas: fechas_Imp[] = [
    {descripcion:'No Hay Fecha',dia: new Date('12/21/2012 00:00:00')},
    {descripcion:'Prueba1',dia: new Date('12/25/2023 00:00:00')},
    {descripcion:'Prueba2',dia: new Date('11/25/2023 00:00:00')},
    {descripcion:'Día de la independencia',dia: new Date('07/28/2023 00:00:00')},
    {descripcion:'Día del Padre',dia: new Date('06/18/2023 00:00:00')},
    {descripcion:'Día de la Madre',dia: new Date('05/14/2023 00:00:00')},
    {descripcion:'Prueba7',dia: new Date('03/01/2023 00:00:00')},
  ]

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
  constructor(private dialog: MatDialog,
              private _menuService:MenuPrincipalService,
              private responsive  : BreakpointObserver,
              private _authService: AuthService) { }

  ngOnInit(): void {
    //this.obtenerFecha();
    this.rol = this._authService.getRol();
    this.identificador = this.nearestDay(this.today);
    this.responsive.observe([
      Breakpoints.XSmall
      ])
      .subscribe(result => {
        console.log(result);
        this.interfazCelular = true;
        if (result.matches) {
          this.interfazCelular = false;
        }
      });
    this._menuService.getPublicaciones()
    .subscribe( (data) => {
      console.log(data);
      this.publicaciones = data;
    }
    );
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
      case 3:
        const dialogRef3: MatDialogRef<AdmPublicaciones> = this.dialog.open(AdmPublicaciones, {
          disableClose: false,
          width:'70vw',
          maxHeight:'50em',
        });
        dialogRef3.afterClosed().subscribe(result => {
          this._menuService.getPublicaciones()
          .subscribe( (data) => {
            this.publicaciones = data;
          }
          );
        });
          break;
      case 4:
        const dialogRef4: MatDialogRef<ShowPaymentCalendarComponent> = this.dialog.open(ShowPaymentCalendarComponent, {
            disableClose: false,
            minWidth: '350px',
            maxWidth: '50%',
            autoFocus: false,
          });
          break;
    }
  }

  obtenerFecha(){
    var ahorasi
    var str = ajax.getJSON('http://worldtimeapi.org/api/timezone/America/Lima');
    fetch("http://worldtimeapi.org/api/timezone/America/Lima",{method: "GET",mode: "cors"})
    .then((resp) => resp.json())
    .then((resultado)=> {
      var fecha = resultado.datetime.toString().split('-')[1] + '-' + resultado.datetime.toString().split('-')[2].split('T')[0] + '-' + resultado.datetime.toString().split('-')[0]
      var hora = resultado.datetime.split('T')[1].split('.')[0];
      ahorasi = new Date(`${fecha}-${hora}`);
      this.identificador = this.nearestDay(ahorasi);
      }
    );
  }

  showEncuestaSimple(element){
    const dialogRef: MatDialogRef<EncuestaSimpleComponent> = this.dialog.open(EncuestaSimpleComponent, {
      disableClose: true,
      minWidth: '22em',
      maxWidth:'40em',
      autoFocus: false,
      data:{
        obj: element
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
      && diaDate.dia.getFullYear() >= hoy.getFullYear()) || (diaDate.dia.getMonth() > hoy.getMonth() && diaDate.dia.getFullYear() >= hoy.getFullYear())){
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
}
