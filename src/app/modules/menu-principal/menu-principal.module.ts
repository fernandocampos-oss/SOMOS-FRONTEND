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
import { AdmPublicaciones } from './components/adm-publicaciones/adm-publicaciones.component';
import { AddUpdatePublicacionComponent } from './components/adm-publicaciones/add-update-publicacion/add-update-publicacion.component';
import { ShowPaymentCalendarComponent } from './components/show-payment-calendar/show-payment-calendar.component';
import { EncuestaSimpleComponent } from './components/encuesta-simple/encuesta-simple.component';
import { ConfirmEncuestaSimpleComponent } from './components/encuesta-simple/confirm-encuesta-simple/confirm-encuesta-simple.component';


@NgModule({
  declarations: [
    MenuPrincipalComponent,
    ShowSstComponent,
    RegisterDatosEncuestaComponent,
    ShowPublicacionComponent,
    ConfirmRegisterEncuestaComponent,
    AdmPublicaciones,
    AddUpdatePublicacionComponent,
    ShowPaymentCalendarComponent,
    EncuestaSimpleComponent,
    ConfirmEncuestaSimpleComponent
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
