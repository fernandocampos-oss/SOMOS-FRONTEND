import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisMarcacionesRoutingModule } from './mis-marcaciones-routing.module';
import { MisMarcacionesComponent } from './mis-marcaciones.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@material';

@NgModule({
  declarations: [MisMarcacionesComponent],
  imports: [CommonModule, MisMarcacionesRoutingModule, SharedModule,MaterialModule],
})
export class MisMarcacionesModule {}
