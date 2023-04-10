import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelMarcacionRoutingModule } from './panel-marcacion-routing.module';
import { PanelMarcacionComponent } from './panel-marcacion.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MaterialModule } from '@material';

@NgModule({
  declarations: [PanelMarcacionComponent],
  imports: [CommonModule, PanelMarcacionRoutingModule, QRCodeModule,MaterialModule],
})
export class PanelMarcacionModule {}
