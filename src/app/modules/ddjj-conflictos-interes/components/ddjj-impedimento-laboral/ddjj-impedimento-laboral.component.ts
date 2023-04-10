import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ddjj-impedimento-laboral',
  templateUrl: './ddjj-impedimento-laboral.component.html',
  styleUrls: ['./ddjj-impedimento-laboral.component.scss']
})
export class DdjjImpedimentoLaboralComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _router: Router,
    private route: ActivatedRoute
    
  ) {

    
    this.matIconRegistry.addSvgIcon("up",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/up.svg"));
   }

  ngOnInit(): void {
  }

  back(){
    this._router.navigate(['../'], { relativeTo: this.route });
  }

}
