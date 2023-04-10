import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-comportamiento-general',
  templateUrl: './comportamiento-general.component.html',
  styleUrls: ['./comportamiento-general.component.scss']
})
export class ComportamientoGeneralComponent implements OnInit {

  constructor(
    //x@Inject(MAT_DIALOG_DATA)
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { 
    this.matIconRegistry.addSvgIcon("pdf",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/pdf.svg"));
 

  }

  ngOnInit(): void {
  }

}
