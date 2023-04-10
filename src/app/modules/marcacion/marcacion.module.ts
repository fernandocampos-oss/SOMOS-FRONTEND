import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { MarcacionComponent } from './marcacion.component';
import { MarcacionRoutingModule } from './marcacion-routing.module';
import { MaterialModule } from '@material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MarcacionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MarcacionRoutingModule,
    MaterialModule,
    ZXingScannerModule,
  ],
})
export class MarcacionModule {}
