import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisMarcacionesRoutingModule } from './mis-marcaciones-routing.module';
import { MisMarcacionesComponent } from './mis-marcaciones.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [MisMarcacionesComponent],
  imports: [CommonModule, MisMarcacionesRoutingModule, SharedModule,MaterialModule, MatDatepickerModule, ReactiveFormsModule, MatGridListModule],
})
export class MisMarcacionesModule {}
