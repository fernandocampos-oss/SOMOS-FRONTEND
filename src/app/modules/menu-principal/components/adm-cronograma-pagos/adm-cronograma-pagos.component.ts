import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoletaService } from '@data/services/boleta.service';
import { BoletaTipo } from '@data/models/boleta/boleta-tipo.model';
import { CronogramaPago, TipoContrato } from '@data/models/menu-principal/menu-cronograma.model';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SnackbarService } from '@core/services';

@Component({
  selector: 'app-adm-cronograma-pagos',
  templateUrl: './adm-cronograma-pagos.component.html',
  styleUrls: ['./adm-cronograma-pagos.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', animate('1s')),
    ])
  ]
})
export class AdmCronogramaPagosComponent implements OnInit {

  dateFormList: FormGroup[] = [];
  currentYear: number;
  showContainer = true;

  paymentTypesList: BoletaTipo[] = [];
  contractTypesList: TipoContrato[] = [];
  paymentScheduleList: CronogramaPago[] = [];
  contractTypeId = 1;

  constructor(
    private fb: FormBuilder,
    private boletaService: BoletaService,
    private menuPrincipalService: MenuPrincipalService,
    private snackbar: SnackbarService
  ) {
    this.currentYear = new Date().getFullYear();
  }

  async ngOnInit() {
    this.loadPaymentTypes();
    await this.loadContractTypes();
    await this.loadPaymentSchedule();
    this.generateForm();
  }

  generateForm() {
    this.contractTypesList.forEach((t, i) => {
      this.dateFormList[i] = this.fb.group({});
      this.paymentScheduleList
        .filter(p => p.idTipoContrato === t.idTipoContrato)
        .forEach(c => {
          const formName = c.idCronogramaPago + 'Schedule';
          this.dateFormList[i].addControl(formName, this.fb.control(c.fecha, Validators.required));
          this.dateFormList[i].addControl(formName + 'PaymentTypes', this.fb.control(c.tipoPagoAsociados, Validators.required));
        });
    });
    console.log(this.dateFormList);
  }

  getPaymentScheduleFilteredList(i: number): CronogramaPago[] {
    return this.paymentScheduleList.filter(p => p.idTipoContrato === i + 1);
  }

  loadPaymentTypes() {
    this.boletaService.listarTipos().subscribe(data => {
      this.paymentTypesList = data;
    });
  }

  async loadContractTypes() {
    await this.menuPrincipalService.listarTiposContratos().then(data => {
      this.contractTypesList = data;
    });
  }

  async loadPaymentSchedule() {
    await this.menuPrincipalService.listarCronogramaPago().then(data => {
      this.paymentScheduleList = data;
    });
  }

  saveChanges() {
    if (this.dateFormList[this.contractTypeId - 1].valid) {
      const paymentScheduleUpdate: CronogramaPago[] = [];
      this.getPaymentScheduleFilteredList(this.contractTypeId - 1).forEach(c => {
        const formName = c.idCronogramaPago + 'Schedule';
        const monthDate: Date = this.dateFormList[this.contractTypeId - 1].get(formName).value;
        const associatedPaymentTypes = this.dateFormList[this.contractTypeId - 1].get(formName + 'PaymentTypes').value;
        const data: CronogramaPago = {
          idCronogramaPago: c.idCronogramaPago,
          idTipoContrato: c.idTipoContrato,
          descripcionPeriodo: c.descripcionPeriodo,
          fecha: monthDate,
          tipoPagoAsociados: associatedPaymentTypes,
          fechaMinima: c.fechaMinima,
          fechaMaxima: c.fechaMaxima
        };
        paymentScheduleUpdate.push(data);
      });
      console.log(paymentScheduleUpdate);
      this.menuPrincipalService.actualizarCronogramaPago(paymentScheduleUpdate).subscribe( c => {
        this.snackbar.success('Cronograma actualizado');
      });
    }
  }

  onToggleChange(event: MatButtonToggleChange): void {
    this.contractTypeId = event.value;
    this.showContainer = false;
    this.showContainer = true;
  }

}
