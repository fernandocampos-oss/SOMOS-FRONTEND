import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfig } from '@core/configs';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-experiencia-register-update',
  templateUrl: './experiencia-register-update.component.html',
  styleUrls: ['./experiencia-register-update.component.scss']
})
export class ExperienciaRegisterUpdateComponent implements OnInit {

  startDate = new Date(new Date().getFullYear() - 30, 0, 1);
  maxFecha = AppConfig.MAX_FECHA_NACIMIENTO;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    
  ) { 
    this.matIconRegistry.addSvgIcon("cancel",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/cancel.svg"));
   }

  ngOnInit(): void {}
}
