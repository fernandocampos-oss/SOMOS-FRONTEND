import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrarInscripcionRoutingModule } from './administrar-inscripcion-routing.module';
import { CoreModule } from '@core/core.module';
import { AdministrarInscripcionComponent } from './administrar-inscripcion/administrar-inscripcion.component';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  declarations: [
    AdministrarInscripcionComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdministrarInscripcionRoutingModule,
    CoreModule,
    MatGridListModule
  ]
})
export class AdministrarInscripcionModule { }
