import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowSstComponent } from '../components/show-sst/show-sst.component';
import { interval, Subscription } from 'rxjs';
import { RegisterDatosEncuestaComponent } from '../components/register-datos-encuesta/register-datos-encuesta.component';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { OnomasticosResponse } from '@data/models/menu-principal/menu-principal.model';

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
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  identificador= 0;

  fechas: fechas_Imp[] = [
    {descripcion:'Día del Trabajador',dia: new Date('05/01/2023')},
    {descripcion:'Día del Trabajador',dia: new Date('05/06/2023')},
    {descripcion:'Día del Trabajador2',dia: new Date('05/26/2023')},
  ]
  diaHoy = this.today.getDate();
  mesHoy = this.today.getMonth()+1;

  parametros = {
    mesConsulta: '',
    diaConsulta: '',
  }
  subscription: Subscription;
  constructor(private dialog: MatDialog,
              private _menuService:MenuPrincipalService,) { }

  ngOnInit(): void {
    this.convertirDiaMes(this.diaHoy, this.mesHoy);
    this.getDateDiff(this.fechas[this.identificador].dia,this.today);// Provisional: para tener las fechas importantes
    this.CargarOnomasticos();
  }

  open(cuadro: number) {
    switch (cuadro) {
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
  
      dialogRef3.afterClosed();
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
    
    console.log("Dias:",this.daysLeft,"Horas:",this.hoursLeft,"Minutos:",this.minutesLeft);
  }
}
