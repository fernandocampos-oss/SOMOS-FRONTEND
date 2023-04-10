import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ausencias',
  templateUrl: './ausencias.component.html',
  styleUrls: ['./ausencias.component.scss']
})
export class AusenciasComponent implements OnInit {

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
