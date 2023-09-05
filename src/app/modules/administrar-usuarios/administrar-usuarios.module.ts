import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrarUsuariosRoutingModule } from './administrar-usuarios-routing.module';
import { AdministrarUsuariosComponent } from './administrar-usuarios/administrar-usuarios.component';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    AdministrarUsuariosComponent
  ],
  imports: [
    CommonModule,
    AdministrarUsuariosRoutingModule,
    MaterialModule,
    MatGridListModule,
    NgxChartsModule
  ]
})
export class AdministrarUsuariosModule { }
