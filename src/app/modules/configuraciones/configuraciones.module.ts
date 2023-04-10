import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionesRoutingModule } from './configuraciones-routing.module';
import { MaterialModule } from '@material';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { ConfiguracionesComponent } from './configuraciones.component';

@NgModule({
  declarations: [ConfiguracionesComponent],
  imports: [
    CommonModule,
    ConfiguracionesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
})
export class ConfiguracionesModule {}
