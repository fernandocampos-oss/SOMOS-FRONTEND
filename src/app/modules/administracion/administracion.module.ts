import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdministracionComponent } from './administracion/administracion.component';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  declarations: [
    AdministracionComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    MaterialModule,
    MatGridListModule,
  ]
})
export class AdministracionModule { }
