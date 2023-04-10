import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ficha-unica-personal',
  templateUrl: './ficha-unica-personal.component.html',
  styleUrls: ['./ficha-unica-personal.component.scss']
})
export class FichaUnicaPersonalComponent implements OnInit {

  constructor( private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer, private _router: Router,
    private route: ActivatedRoute) {
    this.matIconRegistry.addSvgIcon("profesional",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/profesional.svg"));
   }

  ngOnInit(): void {
  }


  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }

}
