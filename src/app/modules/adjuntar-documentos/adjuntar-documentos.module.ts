import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdjuntarDocumentosRoutingModule } from './adjuntar-documentos-routing.module';
import { AdjuntarDocumentosComponent } from './adjuntar-documentos.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@material';
import { IngresoCapacitacionComponent } from './dialogs/ingreso-capacitacion/ingreso-capacitacion.component';
import { CarreraAdministrativaComponent } from './dialogs/carrera-administrativa/carrera-administrativa.component';
import { ComportamientoGeneralComponent } from './dialogs/comportamiento-general/comportamiento-general.component';
import { AusenciasComponent } from './dialogs/ausencias/ausencias.component';
import { RemuneracionesBonificacionesBeneficiosComponent } from './dialogs/remuneraciones-bonificaciones-beneficios/remuneraciones-bonificaciones-beneficios.component';
import { TerminoCarreraComponent } from './dialogs/termino-carrera/termino-carrera.component';


@NgModule({
  declarations: [
    AdjuntarDocumentosComponent,
    IngresoCapacitacionComponent,
    CarreraAdministrativaComponent,
    ComportamientoGeneralComponent,
    AusenciasComponent,
    RemuneracionesBonificacionesBeneficiosComponent,
    TerminoCarreraComponent
  ],
  imports: [
    CommonModule,
    AdjuntarDocumentosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule,
    NgxExtendedPdfViewerModule
  ]
})
export class AdjuntarDocumentosModule { }
