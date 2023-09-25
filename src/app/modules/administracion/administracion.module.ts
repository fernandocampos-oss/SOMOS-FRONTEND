import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdministracionComponent } from './administracion/administracion.component';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { VistaUsuariosComponent } from './administracion/components/vista-usuarios/vista-usuarios.component';


@NgModule({
  declarations: [
    AdministracionComponent,
    VistaUsuariosComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    MaterialModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  providers:[
    TitleCasePipe 
  ]
})
export class AdministracionModule { }
