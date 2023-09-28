import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisBoletasRoutingModule } from './mis-boletas-routing.module';
import { MisBoletasComponent } from './mis-boletas/mis-boletas.component';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { InscribirseBoletasComponent } from './components/inscribirse-boletas/inscribirse-boletas.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MisBoletasComponent,
    InscribirseBoletasComponent
  ],
  imports: [
    CommonModule,
    MisBoletasRoutingModule,
    MaterialModule,
    MatGridListModule,
    ReactiveFormsModule
  ]
})
export class MisBoletasModule { }
