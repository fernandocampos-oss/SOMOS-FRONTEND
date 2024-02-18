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

  currentYear: number;
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
  }

}
