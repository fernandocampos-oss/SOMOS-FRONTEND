import { Component, OnInit } from '@angular/core';

interface Calendario{
  fecPago: string;
}

@Component({
  selector: 'app-show-payment-calendar',
  templateUrl: './show-payment-calendar.component.html',
  styleUrls: ['./show-payment-calendar.component.scss']
})
export class ShowPaymentCalendarComponent implements OnInit {
  data: Calendario[] = [
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
  ];

  tipoContrato: string ='Selecciona una opción';

  periodosPago: string[] = ['Enero','Escolaridad - Febrero','Febrero','Marzo','Abril','Mayo','Junio','Gratificación - Julio','Julio','Agosto',
                            'Setiembre','Octubre','Noviembre','Gratificación - Diciembre','Diciembre'];

  pagosPensionistas: Calendario[] = [
    {fecPago:'2024-01-19'},
    {fecPago:'-'},
    {fecPago:'2024-02-19'},
    {fecPago:'2024-03-18'},
    {fecPago:'2024-04-19'},
    {fecPago:'2024-05-20'},
    {fecPago:'2024-06-19'},
    {fecPago:'-'},
    {fecPago:'2024-07-19'},
    {fecPago:'2024-08-19'},
    {fecPago:'2024-09-20'},
    {fecPago:'2024-10-18'},
    {fecPago:'2024-11-20'},
    {fecPago:'-'},
    {fecPago:'2024-12-20'},
  ];
  pagos728: Calendario[] = [
    {fecPago:'2024-01-24'},
    {fecPago:'2024-02-15'},
    {fecPago:'2024-02-23'},
    {fecPago:'2024-03-25'},
    {fecPago:'2024-04-24'},
    {fecPago:'2024-05-24'},
    {fecPago:'2024-06-24'},
    {fecPago:'2024-07-15'},
    {fecPago:'2024-07-24'},
    {fecPago:'2024-08-23'},
    {fecPago:'2024-09-24'},
    {fecPago:'2024-10-25'},
    {fecPago:'2024-11-25'},
    {fecPago:'2024-12-13'},
    {fecPago:'2024-12-23'},
  ];
  pagosCas: Calendario[] = [
    {fecPago:'2024-01-24'},
    {fecPago:'-'},
    {fecPago:'2024-02-23'},
    {fecPago:'2024-03-25'},
    {fecPago:'2024-04-24'},
    {fecPago:'2024-05-24'},
    {fecPago:'2024-06-24'},
    {fecPago:'-'},
    {fecPago:'2024-07-24'},
    {fecPago:'2024-08-23'},
    {fecPago:'2024-09-24'},
    {fecPago:'2024-10-25'},
    {fecPago:'2024-11-25'},
    {fecPago:'-'},
    {fecPago:'2024-12-23'},
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
