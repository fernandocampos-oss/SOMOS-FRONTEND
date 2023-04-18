import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuPrincipalRoutingModule } from './menu-principal-routing.module';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { MaterialModule } from '@material';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from '@shared/shared.module';
import { ShowBirthdayComponent } from './components/show-birthday/show-birthday.component';
import { ShowSstComponent } from './components/show-sst/show-sst.component';
import { RegisterDatosEncuestaComponent } from './components/register-datos-encuesta/register-datos-encuesta.component';
import { RegisterRespuestasEncuestaComponent } from './components/register-respuestas-encuesta/register-respuestas-encuesta.component';


@NgModule({
  declarations: [
    MenuPrincipalComponent,
    ShowBirthdayComponent,
    ShowSstComponent,
    RegisterDatosEncuestaComponent,
    RegisterRespuestasEncuestaComponent
  ],
  imports: [
    CommonModule,
    MenuPrincipalRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule
  ]
})
export class MenuPrincipalModule { }
