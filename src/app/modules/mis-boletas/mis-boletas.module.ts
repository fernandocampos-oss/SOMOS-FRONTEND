import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisBoletasRoutingModule } from './mis-boletas-routing.module';
import { MisBoletasComponent } from './mis-boletas/mis-boletas.component';


@NgModule({
  declarations: [
    MisBoletasComponent
  ],
  imports: [
    CommonModule,
    MisBoletasRoutingModule
  ]
})
export class MisBoletasModule { }
