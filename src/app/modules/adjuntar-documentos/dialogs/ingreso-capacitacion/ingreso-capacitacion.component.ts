import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-ingreso-capacitacion',
  templateUrl: './ingreso-capacitacion.component.html',
  styleUrls: ['./ingreso-capacitacion.component.scss']
})
export class IngresoCapacitacionComponent implements OnInit ,OnDestroy{

  constructor(
    //x@Inject(MAT_DIALOG_DATA)
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { 
    this.matIconRegistry.addSvgIcon("pdf",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/pdf.svg"));
 

  }
  
  ngOnInit(): void {
    untilDestroyed(this)
  }


  ngOnDestroy() {
    untilDestroyed(this)
  }


  save(){
    
  }

}
