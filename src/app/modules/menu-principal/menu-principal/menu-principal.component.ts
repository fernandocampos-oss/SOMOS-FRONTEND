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

interface publicacion{
  nombre: string;
  fechaPub: string;
  imgRuta: string;
  redireccion?: string;  
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
  ]

  publicaciones: publicacion[] = [
    {nombre: 'Campaña de salud integral', fechaPub: '26/04/2023 - 16:15', imgRuta: 'assets/images/diaTrabajo_2.jpg'},
    {nombre: 'Anuncio Actividades 27 de abril', fechaPub: '26/04/2023 - 13:31', imgRuta: 'assets/images/diaTrabajo_1.jpg'},
    {nombre: 'Visita Turística a Antioquía', fechaPub: '26/04/2023 - 10:55', imgRuta: 'assets/images/Turismo.jpg'},
    {nombre: 'Campaña por el Día de la Madre', fechaPub: '26/04/2023 - 10:42', imgRuta: 'assets/images/CampSolidaridad.jpg', redireccion: 'http://www.essalud.gob.pe/mailing/FORMATO_DE_DONACION_2023.docx'},
    {nombre: 'Feria Agropecuaria', fechaPub: '26/04/2023 - 08:39', imgRuta: 'assets/images/Agropecuaria.jpg'},
    {nombre: 'Día de la Secretaria', fechaPub: '26/04/2023 - 10:00', imgRuta: 'assets/images/DiaSecretaria.jpg'},
    {nombre: 'Aniversario Hospital II Tarapoto - San Martín', fechaPub: '25/04/2023 - 11:17', imgRuta: 'assets/images/Tarapoto.jpg'},
    {nombre: 'Aviso de Buenas prácticas estadísticas', fechaPub: '25/04/2023 - 10:12', imgRuta: 'assets/images/Aviso.jpg', redireccion: 'http://intranet.essalud/portal/GCPP/pdfs/R_GCPyP_002_GCPP_ESSALUD_2023.pdf'},
    {nombre: 'Cruzada Solidaria', fechaPub: '24/04/2023 - 16:56', imgRuta: 'assets/images/Cruzada.jpg'},
    {nombre: 'Aniversarios Establecimientos de Salud', fechaPub: '24/04/2023 - 15:33', imgRuta: 'assets/images/Aniversario27.jpg'},
    {nombre: 'Normativa de trabajo con integridad', fechaPub: '24/04/2023 - 14:31', imgRuta: 'assets/images/TrabajoIntegridad.jpg', redireccion: 'https://ww1.essalud.gob.pe/ofin/wp-content/uploads/2023/03/RESOLUCION-N%C2%B0423-GG-ESSALUD-202320230315_08214357.pdf'},
    {nombre: 'Talleres de Productividad', fechaPub: '15/04/2023 - 12:00', imgRuta: 'assets/images/Taller_de_productividad_1.jpg'},
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
