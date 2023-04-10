import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisVacacionesRoutingModule } from './mis-vacaciones-routing.module';
import { MisVacacionesComponent } from './mis-vacaciones/mis-vacaciones.component';


@NgModule({
  declarations: [
    MisVacacionesComponent
  ],
  imports: [
    CommonModule,
    MisVacacionesRoutingModule
  ]
})
export class MisVacacionesModule { }
