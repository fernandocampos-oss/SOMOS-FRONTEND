import { Component, OnInit } from '@angular/core';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { CronogramaPago, TipoContrato } from '@data/models/menu-principal/menu-cronograma.model';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { AuthService, UsuarioService } from '@data/services';

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
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
    {fecPago:'-'},
  ];

  tipoContrato: string ='Selecciona una opción';

  periodosPago: string[] = [
    'Uniformes - Enero',
    'Enero',
    'Escolaridad - Febrero',
    'Febrero',
    'Marzo',
    'Abril',
    'CTS - Mayo',
    'Mayo',
    'Junio',
    'Gratificación - Julio',
    'Julio',
    'Agosto',
    'Setiembre',
    'Octubre',
    'CTS - Noviembre',
    'Noviembre',
    'Gratificación - Diciembre',
    'Diciembre'
  ];

  pagosPensionistas: Calendario[] = [
    {fecPago:'-'},
    {fecPago:'2026-01-21'},
    {fecPago:'-'},
    {fecPago:'2026-02-20'},
    {fecPago:'2026-03-20'},
    {fecPago:'2026-04-21'},
    {fecPago:'-'},
    {fecPago:'2026-05-20'},
    {fecPago:'2026-06-22'},
    {fecPago:'-'},
    {fecPago:'2026-07-21'},
    {fecPago:'2026-08-20'},
    {fecPago:'2026-09-21'},
    {fecPago:'2026-10-20'},
    {fecPago:'-'},
    {fecPago:'2026-11-19'},
    {fecPago:'-'},
    {fecPago:'2026-12-18'},
  ];
  pagos276: Calendario[] = [
    {fecPago:'2026-01-15'},
    {fecPago:'2026-01-23'},
    {fecPago:'2026-02-13'},
    {fecPago:'2026-02-23'},
    {fecPago:'2026-03-23'},
    {fecPago:'2026-04-23'},
    {fecPago:'-'},
    {fecPago:'2026-05-22'},
    {fecPago:'2026-06-23'},
    {fecPago:'2026-07-15'},
    {fecPago:'2026-07-22'},
    {fecPago:'2026-08-21'},
    {fecPago:'2026-09-23'},
    {fecPago:'2026-10-22'},
    {fecPago:'-'},
    {fecPago:'2026-11-23'},
    {fecPago:'2026-12-15'},
    {fecPago:'2026-12-23'},
  ];
  pagos728: Calendario[] = [
    {fecPago:'2026-01-15'},
    {fecPago:'2026-01-23'},
    {fecPago:'2026-02-13'},
    {fecPago:'2026-02-23'},
    {fecPago:'2026-03-23'},
    {fecPago:'2026-04-23'},
    {fecPago:'2026-05-15'},
    {fecPago:'2026-05-22'},
    {fecPago:'2026-06-23'},
    {fecPago:'2026-07-15'},
    {fecPago:'2026-07-22'},
    {fecPago:'2026-08-21'},
    {fecPago:'2026-09-23'},
    {fecPago:'2026-10-22'},
    {fecPago:'2026-11-13'},
    {fecPago:'2026-11-23'},
    {fecPago:'2026-12-15'},
    {fecPago:'2026-12-23'},
  ];
  pagosCas: Calendario[] = [
    {fecPago:'2026-01-15'},
    {fecPago:'2026-01-23'},
    {fecPago:'-'},
    {fecPago:'2026-02-23'},
    {fecPago:'2026-03-23'},
    {fecPago:'2026-04-23'},
    {fecPago:'-'},
    {fecPago:'2026-05-22'},
    {fecPago:'2026-06-23'},
    {fecPago:'-'},
    {fecPago:'2026-07-22'},
    {fecPago:'2026-08-21'},
    {fecPago:'2026-09-23'},
    {fecPago:'2026-10-22'},
    {fecPago:'-'},
    {fecPago:'2026-11-23'},
    {fecPago:'-'},
    {fecPago:'2026-12-23'},
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
      this.tipoContrato = 'D.LEG 276';
      this.data = this.pagos276;
    }
    else if(value == 3){
      this.tipoContrato = 'D.LEG 276 - D.LEG 278';
      this.data = this.pagos728;
    }
    else if(value == 4){
      this.tipoContrato = 'D.LEG 1057 - CAS Regular';
      this.data = this.pagosCas;
    }
  }

  /*currentYear: number;
  contractTypesList: TipoContrato[] = [];
  paymentScheduleList: CronogramaPago[] = [];
  paymentScheduleFilteredList: CronogramaPago[] = [];
  contractTypeId = 1;

  constructor(
    private menuPrincipalService: MenuPrincipalService,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    this.currentYear = new Date().getFullYear();
  }

  async ngOnInit() {
    await this.loadContractTypes();
    await this.loadPaymentSchedule();
  }

  async loadContractTypes() {
    await this.menuPrincipalService.listarTiposContratos().then(data => {
      this.contractTypesList = data;
      this.findContractTypeUserByRegimen();
    });
  }

  async loadPaymentSchedule() {
    await this.menuPrincipalService.listarCronogramaPago().then(data => {
      this.paymentScheduleList = data;
      this.paymentScheduleFilteredList = this.paymentScheduleList.filter(p => p.idTipoContrato === this.contractTypeId);
    });
  }

  findContractTypeUserByRegimen() {
    this.usuarioService.find(this.authService.getUserSession().id).subscribe(data => {
      this.findContractTypeIdByRegimen(data.regimen);
    });
  }

  findContractTypeIdByRegimen(regimen: string) {
    if (regimen) {
      let regimenFound = false;
      this.contractTypesList.filter(c => c.codigo).forEach(c => {
        c.codigo.split(',').forEach(cod => {
          if (regimen.toUpperCase().includes(cod.toUpperCase())) {
            this.contractTypeId = c.idTipoContrato;
            regimenFound = true;
          }
        });
        if (regimenFound) {
          return;
        }
      });
    }
  }

  onToggleChange(event: MatButtonToggleChange): void {
    this.contractTypeId = event.value;
    this.paymentScheduleFilteredList = this.paymentScheduleList.filter(p => p.idTipoContrato === this.contractTypeId);
  }*/

}
