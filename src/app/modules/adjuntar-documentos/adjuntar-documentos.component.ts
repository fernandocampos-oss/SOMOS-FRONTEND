import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ComponentType } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { AusenciasComponent } from './dialogs/ausencias/ausencias.component';
import { CarreraAdministrativaComponent } from './dialogs/carrera-administrativa/carrera-administrativa.component';
import { ComportamientoGeneralComponent } from './dialogs/comportamiento-general/comportamiento-general.component';
import { IngresoCapacitacionComponent } from './dialogs/ingreso-capacitacion/ingreso-capacitacion.component';
import { RemuneracionesBonificacionesBeneficiosComponent } from './dialogs/remuneraciones-bonificaciones-beneficios/remuneraciones-bonificaciones-beneficios.component';
import { TerminoCarreraComponent } from './dialogs/termino-carrera/termino-carrera.component';

@Component({
  selector: 'app-adjuntar-documentos',
  templateUrl: './adjuntar-documentos.component.html',
  styleUrls: ['./adjuntar-documentos.component.scss']
})
export class AdjuntarDocumentosComponent implements OnInit {

  constructor(private _router: Router,
    private route: ActivatedRoute, private _matDialog: MatDialog) { }

  ngOnInit(): void {
  }


  open(type: number){

   switch(type){

    case 1: this.onFormIngreso() ;break;
    case 2: this.onFormCarreraAdministrativa() ;break;
    case 3: this.onFormComportamientoGeneral() ;break;
    case 4: this.onFormAusencias() ;break;
    case 5: this.onFormRemuneraciones() ;break;
    case 6: this.onFormTerminoCarrera() ;break;
   }

  }


  onFormIngreso() {
    this._openDialog(
      IngresoCapacitacionComponent,
      null,
      null
    );
  }

  onFormCarreraAdministrativa() {
    this._openDialog(
      CarreraAdministrativaComponent,
      null,
      null
    );
  }

  onFormComportamientoGeneral() {
    this._openDialog(
      ComportamientoGeneralComponent,
      null,
      null
    );
  }

  onFormAusencias() {
    this._openDialog(
      AusenciasComponent,
      null,
      null
    );
  }

  onFormRemuneraciones() {
    this._openDialog(
      RemuneracionesBonificacionesBeneficiosComponent,
      null,
      null
    );
  }

  onFormTerminoCarrera() {
    this._openDialog(
      TerminoCarreraComponent,
      null,
      null
    );
  }

  private _openDialog<T>(
    dialog: ComponentType<T>,
    data: any,
    callback: () => void
  ) {
    this._matDialog
      .open(dialog, { data, disableClose: true ,maxWidth: 950,maxHeight: '90vh'})
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((isSuccess) => isSuccess)
      )
      .subscribe(() => callback.call(this));
  }

  back(){
    this._router.navigate(['../'], { relativeTo: this.route });
  }
}
