import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuPrincipalRoutingModule } from './menu-principal-routing.module';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { MaterialModule } from '@material';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from '@shared/shared.module';
import { ShowSstComponent } from './components/show-sst/show-sst.component';
import { RegisterDatosEncuestaComponent } from './components/register-datos-encuesta/register-datos-encuesta.component';
import { ShowPublicacionComponent } from './components/show-publicacion/show-publicacion.component';
import { ConfirmRegisterEncuestaComponent } from './components/register-datos-encuesta/dialogs/confirm-register-encuesta/confirm-register-encuesta.component';
import { AddUpdatePublicacionComponent } from './components/add-update-publicacion/add-update-publicacion.component';


@NgModule({
  declarations: [
    MenuPrincipalComponent,
    ShowSstComponent,
    RegisterDatosEncuestaComponent,
    ShowPublicacionComponent,
    ConfirmRegisterEncuestaComponent,
    AddUpdatePublicacionComponent
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
