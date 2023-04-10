import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfig } from '@core/configs';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-idioma-register-update',
  templateUrl: './idioma-register-update.component.html',
  styleUrls: ['./idioma-register-update.component.scss']
})
export class IdiomaRegisterUpdateComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    
  ) { 
    this.matIconRegistry.addSvgIcon("cancel",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/cancel.svg"));
   }

  ngOnInit(): void {}
}
