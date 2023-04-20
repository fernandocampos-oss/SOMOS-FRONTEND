import { Component, OnInit } from '@angular/core';
import { ShowBirthdayComponent } from '../components/show-birthday/show-birthday.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowSstComponent } from '../components/show-sst/show-sst.component';
import { RegisterDatosEncuestaComponent } from '../components/register-datos-encuesta/register-datos-encuesta.component';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { OnomasticosResponse } from '@data/models/menu-principal/menu-principal.model';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss']
})
export class MenuPrincipalComponent implements OnInit {

  onomasticos: OnomasticosResponse[] = [];
  today = new Date();
  nextDay = new Date('05/01/2023');
  dateD: Date;
  ocultar = true;
  diferencia: number;
  division: number;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;

  diaHoy = this.today.getDate();
  mesHoy = this.today.getMonth()+1;

  parametros = {
    mesConsulta: '',
    diaConsulta: '',
  }

  constructor(private dialog: MatDialog,
              private _menuService:MenuPrincipalService) { }

  ngOnInit(): void {
    this.convertirDiaMes(this.diaHoy, this.mesHoy);
    this.CargarOnomasticos();
  }

  open(cuadro: number) {
    switch (cuadro) {
      case 1: 
      const dialogRef: MatDialogRef<ShowBirthdayComponent> = this.dialog.open(ShowBirthdayComponent, {
        disableClose: false,
        minWidth: '25em',
        maxWidth: '50em',
        minHeight: '20em',
        maxHeight: '50em',
        autoFocus: false,
      });
  
      dialogRef.afterClosed().subscribe(result => { });
        break;
      case 2:
      const dialogRef2: MatDialogRef<ShowSstComponent> = this.dialog.open(ShowSstComponent, {
          disableClose: false,
          width: '80%',
          autoFocus: false,
        });
    
        dialogRef2.afterClosed().subscribe(result => { });
          break;
      case 3: 
      const dialogRef3: MatDialogRef<RegisterDatosEncuestaComponent> = this.dialog.open(RegisterDatosEncuestaComponent, {
        disableClose: true,
        minWidth: '22em',
        maxWidth:'40em',
        maxHeight:'50em',
        autoFocus: false,
      });
  
      dialogRef3.afterClosed().subscribe(result => { });
        break;
    }
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
        this.onomasticos = data;
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
  printwhatyousee(num: string){
    console.log(this.dateD);
    console.log(num);
  }
  // getDateDiff(startDate: Date, endDate: Date){
  //   const msInDay = 24 * 60 * 60 * 1000;
  //   const msInHours = 60 * 60 * 1000;
  //   const msInMinutes = 60 * 1000;//13 dias - 13 horas - 49 minutos
  //   this.diferencia = Math.abs(Number(endDate) - Number(startDate));
  //   this.division = (this.diferencia - msInDay)/ msInDay;
  //   this.daysLeft = Math.round(this.division);
  //   console.log(this.daysLeft);

  //   this.diferencia = Math.abs(this.diferencia - (this.daysLeft*msInDay));
  //   this.division = this.diferencia/msInHours;
  //   this.hoursLeft = Math.round(this.division);
  //   console.log(this.hoursLeft);

  //   this.diferencia = Math.abs(this.diferencia - (this.hoursLeft*msInHours));
  //   this.division = this.diferencia/msInMinutes;
  //   this.daysLeft = Math.round(this.division);
  //   console.log(this.daysLeft);
  //   // this.diferencia = this. diferencia - (this.daysLeft*msInDay);
  //   // this.division = (this.diferencia - msInHours)/ msInHours;
  //   // this.hoursLeft = Math.round(this.division);
  //   // console.log(this.hoursLeft);
  //   // //a partir de aqui todo bien
  //   // this.diferencia = this. diferencia - (this.hoursLeft*msInHours);
  //   // this.minutesLeft = Math.round((this.diferencia - msInMinutes)/ msInMinutes);
  //   // console.log(this.minutesLeft);
  // }
}
