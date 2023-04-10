import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarcacionTrabajadorRoutingModule } from './marcacion-trabajador-routing.module';
import { MarcacionTrabajadorComponent } from './marcacion-trabajador.component';
import { MaterialModule } from '@material';
import { ReactiveFormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  declarations: [MarcacionTrabajadorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MarcacionTrabajadorRoutingModule,
    MaterialModule,
    ZXingScannerModule,
  ],
})
export class MarcacionTrabajadorModule {}
