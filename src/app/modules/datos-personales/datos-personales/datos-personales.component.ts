import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit {

constructor( private _router: Router,
  private route: ActivatedRoute){

}

  ngOnInit(): void {
  }


  open(cuadro: number) {
    switch (cuadro) {
      case 1: //this._router.navigate(['../conflicto']);
        this._router.navigate(['ficha-unica-personal'], { relativeTo: this.route });
        break;
      case 2:
        this._router.navigate(['ddjj-conflicto-interes'], { relativeTo: this.route });
        break;
      case 3: this._router.navigate(['adjuntar-documentos'], { relativeTo: this.route });
        break;
      case 4: this._router.navigate(['ficha-unica-empleado'], { relativeTo: this.route });
        break;
      case 5: this._router.navigate(['../dj-conflicto-interes'], { relativeTo: this.route });
        break;  
    }
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
}
