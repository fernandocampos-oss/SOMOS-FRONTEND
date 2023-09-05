import { Component, OnInit } from '@angular/core';

interface Calendario{
  diaRec: string;
  fecRec: string;
  diaPago: string;
  fecPago: string;
}

@Component({
  selector: 'app-show-payment-calendar',
  templateUrl: './show-payment-calendar.component.html',
  styleUrls: ['./show-payment-calendar.component.scss']
})
export class ShowPaymentCalendarComponent implements OnInit {
  data: Calendario[] = [
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
  ];

  tipoContrato: string ='Selecciona una opción';

  periodosPago: string[] = ['Enero','Escolaridad - Febrero','Febrero','Marzo','Abril','Mayo','Junio','Gratificación - Julio','Julio','Agosto',
                            'Setiembre','Octubre','Noviembre','Gratificación - Diciembre','Diciembre'];

  pagosPensionistas: Calendario[] = [
    {diaRec:'Jueves',fecRec:'05/01',diaPago:'Viernes',fecPago:'20/01'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'Jueves',fecRec:'02/02',diaPago:'Viernes',fecPago:'17/02'},
    {diaRec:'Jueves',fecRec:'02/03',diaPago:'Viernes',fecPago:'17/03'},
    {diaRec:'Martes',fecRec:'04/04',diaPago:'Miercoles',fecPago:'19/04'},
    {diaRec:'Jueves',fecRec:'04/05',diaPago:'Viernes',fecPago:'19/05'},
    {diaRec:'Jueves',fecRec:'01/06',diaPago:'Viernes',fecPago:'16/06'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'Martes',fecRec:'04/07',diaPago:'Miercoles',fecPago:'19/07'},
    {diaRec:'Jueves',fecRec:'03/08',diaPago:'Viernes',fecPago:'18/08'},
    {diaRec:'Martes',fecRec:'05/09',diaPago:'Miercoles',fecPago:'20/09'},
    {diaRec:'Jueves',fecRec:'05/10',diaPago:'Viernes',fecPago:'20/10'},
    {diaRec:'Jueves',fecRec:'02/11',diaPago:'Viernes',fecPago:'17/11'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'Martes',fecRec:'04/12',diaPago:'Miercoles',fecPago:'20/12'},
  ];
  pagos728: Calendario[] = [
    {diaRec:'Lunes',fecRec:'09/01',diaPago:'Lunes',fecPago:'23/01'},
    {diaRec:'Viernes',fecRec:'03/02',diaPago:'Miercoles',fecPago:'15/02'},
    {diaRec:'Jueves',fecRec:'09/02',diaPago:'Jueves',fecPago:'23/02'},
    {diaRec:'Jueves',fecRec:'09/03',diaPago:'Jueves',fecPago:'23/03'},
    {diaRec:'Miercoles',fecRec:'05/04',diaPago:'Viernes',fecPago:'21/04'},
    {diaRec:'Martes',fecRec:'09/05',diaPago:'Martes',fecPago:'23/05'},
    {diaRec:'Viernes',fecRec:'09/06',diaPago:'Viernes',fecPago:'23/06'},
    {diaRec:'Miercoles',fecRec:'05/07',diaPago:'Viernes',fecPago:'14/07'},
    {diaRec:'Viernes',fecRec:'07/07',diaPago:'Viernes',fecPago:'21/07'},
    {diaRec:'Miercoles',fecRec:'09/08',diaPago:'Miercoles',fecPago:'23/08'},
    {diaRec:'Viernes',fecRec:'08/09',diaPago:'Viernes',fecPago:'22/09'},
    {diaRec:'Lunes',fecRec:'09/10',diaPago:'Lunes',fecPago:'23/10'},
    {diaRec:'Jueves',fecRec:'09/11',diaPago:'Jueves',fecPago:'23/11'},
    {diaRec:'Miercoles',fecRec:'05/12',diaPago:'Jueves',fecPago:'14/12'},
    {diaRec:'Jueves',fecRec:'07/12',diaPago:'Jueves',fecPago:'21/12'},
  ];
  pagosCas: Calendario[] = [
    {diaRec:'Lunes',fecRec:'09/01',diaPago:'Lunes',fecPago:'23/01'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'Jueves',fecRec:'09/02',diaPago:'Jueves',fecPago:'23/02'},
    {diaRec:'Jueves',fecRec:'09/03',diaPago:'Jueves',fecPago:'23/03'},
    {diaRec:'Miercoles',fecRec:'05/04',diaPago:'Viernes',fecPago:'21/04'},
    {diaRec:'Martes',fecRec:'09/05',diaPago:'Martes',fecPago:'23/05'},
    {diaRec:'Viernes',fecRec:'09/06',diaPago:'Viernes',fecPago:'23/06'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'Viernes',fecRec:'07/07',diaPago:'Viernes',fecPago:'21/07'},
    {diaRec:'Miercoles',fecRec:'09/08',diaPago:'Miercoles',fecPago:'23/08'},
    {diaRec:'Viernes',fecRec:'08/09',diaPago:'Viernes',fecPago:'22/09'},
    {diaRec:'Lunes',fecRec:'09/10',diaPago:'Lunes',fecPago:'23/10'},
    {diaRec:'Jueves',fecRec:'09/11',diaPago:'Jueves',fecPago:'23/11'},
    {diaRec:'-',fecRec:'-',diaPago:'-',fecPago:'-'},
    {diaRec:'Jueves',fecRec:'07/12',diaPago:'Jueves',fecPago:'21/12'},
  ];

  constructor() { }

  ngOnInit(): void {
    this.onValChange(2);
  }
  onValChange(value) {
    if (value == 1) {
      this.tipoContrato = 'Pensionistas D.L 20530';
      this.data = this.pagosPensionistas;
    }
    else if(value == 2){
      this.tipoContrato = 'D.LEG 276 - D.LEG 278';
      this.data = this.pagos728;
    }
    else if(value == 3){
      this.tipoContrato = 'D.LEG 1057 - CAS Regular';
      this.data = this.pagosCas;    
    }
  }
}
