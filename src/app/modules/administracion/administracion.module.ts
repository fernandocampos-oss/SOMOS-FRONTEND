import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdministracionComponent } from './administracion/administracion.component';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdministrarUsuariosComponent } from './administrar-usuarios/administrar-usuarios.component';
import { AdministrarInscripcionComponent } from './administrar-inscripcion/administrar-inscripcion.component';
import { VistaUsuariosComponent } from './administrar-usuarios/components/vista-usuarios/vista-usuarios.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    AdministracionComponent,
    VistaUsuariosComponent,
    AdministrarUsuariosComponent,
    AdministrarInscripcionComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    MaterialModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    SharedModule
  ],
  providers:[
    TitleCasePipe 
  ]
})
export class AdministracionModule { }
