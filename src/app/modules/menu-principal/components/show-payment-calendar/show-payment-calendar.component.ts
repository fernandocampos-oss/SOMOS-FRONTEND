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
    {fecPago:'2024-01-23'},
    {fecPago:'2024-02-15'},
    {fecPago:'2024-02-23'},
    {fecPago:'2024-03-22'},
    {fecPago:'2024-04-23'},
    {fecPago:'2024-05-23'},
    {fecPago:'2024-06-21'},
    {fecPago:'2024-07-15'},
    {fecPago:'2024-07-22'},
    {fecPago:'2024-08-23'},
    {fecPago:'2024-09-23'},
    {fecPago:'2024-10-23'},
    {fecPago:'2024-11-22'},
    {fecPago:'2024-12-13'},
    {fecPago:'2024-12-23'},
  ];
  pagosCas: Calendario[] = [
    {fecPago:'2024-01-23'},
    {fecPago:'-'},
    {fecPago:'2024-02-23'},
    {fecPago:'2024-03-22'},
    {fecPago:'2024-04-23'},
    {fecPago:'2024-05-23'},
    {fecPago:'2024-06-21'},
    {fecPago:'-'},
    {fecPago:'2024-07-22'},
    {fecPago:'2024-08-23'},
    {fecPago:'2024-09-23'},
    {fecPago:'2024-10-23'},
    {fecPago:'2024-11-22'},
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
