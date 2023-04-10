import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-datos-personales-update',
  templateUrl: './datos-personales-update.component.html',
  styleUrls: ['./datos-personales-update.component.scss']
})
export class DatosPersonalesUpdateComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    
  ) {

    
    this.matIconRegistry.addSvgIcon("cancel",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/cancel.svg"));
   }

  ngOnInit(): void {
  }



}
