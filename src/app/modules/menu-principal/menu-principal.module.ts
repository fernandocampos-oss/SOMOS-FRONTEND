import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuPrincipalRoutingModule } from './menu-principal-routing.module';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { MaterialModule } from '@material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from '@shared/shared.module';
import { ShowSstComponent } from './components/show-sst/show-sst.component';
import { RegisterDatosEncuestaComponent } from './components/register-datos-encuesta/register-datos-encuesta.component';
import { ShowPublicacionComponent } from './components/show-publicacion/show-publicacion.component';
import { ConfirmRegisterEncuestaComponent } from './components/register-datos-encuesta/dialogs/confirm-register-encuesta/confirm-register-encuesta.component';
import { AdmPublicaciones } from './components/adm-publicaciones/adm-publicaciones.component';
import { ShowPaymentCalendarComponent } from './components/show-payment-calendar/show-payment-calendar.component';
import { EncuestaSimpleComponent } from './components/encuesta-simple/encuesta-simple.component';
import { ConfirmEncuestaSimpleComponent } from './components/encuesta-simple/confirm-encuesta-simple/confirm-encuesta-simple.component';
import { DialogTempComponent } from './components/encuesta-simple/dialog-temp/dialog-temp.component';
import { ShowSistemasComponent } from './components/show-sistemas/show-sistemas.component';
import { CrearPublicacionComponent } from './components/adm-publicaciones/crear-publicacion/crear-publicacion.component';
import { EditarPublicacionComponent } from './components/adm-publicaciones/editar-publicacion/editar-publicacion.component';
import { FormRenuevaEssaludComponent } from './components/form-renueva-essalud/form-renueva-essalud.component';
import { DatosIntegranteComponent } from './components/form-renueva-essalud/datos-integrante/datos-integrante.component';
import { ConfirmInscripcionComponent } from './components/form-renueva-essalud/confirm-inscripcion/confirm-inscripcion.component';
import { RegisterInscripcionComponent } from './components/inscripciones/register-inscripcion/register-inscripcion.component';
import { RegisterVoteInscripcionComponent } from './components/inscripciones/register-vote-inscripcion/register-vote-inscripcion.component';
import { AdmCronogramaPagosComponent } from './components/adm-cronograma-pagos/adm-cronograma-pagos.component';
import { ShowPausaActivaComponent } from './components/show-pausa-activa/show-pausa-activa.component';
import { EncuestaFormularioComponent } from './components/encuesta-formulario/encuesta-formulario.component';
import { PanelInformativoComponent } from './components/panel-informativo/panel-informativo.component';


@NgModule({
  declarations: [
    MenuPrincipalComponent,
    ShowSstComponent,
    RegisterDatosEncuestaComponent,
    ShowPublicacionComponent,
    ConfirmRegisterEncuestaComponent,
    AdmPublicaciones,
    ShowPaymentCalendarComponent,
    EncuestaSimpleComponent,
    ConfirmEncuestaSimpleComponent,
    DialogTempComponent,
    ShowSistemasComponent,
    CrearPublicacionComponent,
    EditarPublicacionComponent,
    FormRenuevaEssaludComponent,
    DatosIntegranteComponent,
    ConfirmInscripcionComponent,
    RegisterInscripcionComponent,
    RegisterVoteInscripcionComponent,
    AdmCronogramaPagosComponent,
    ShowPausaActivaComponent,
    EncuestaFormularioComponent,
    PanelInformativoComponent,

  ],
  imports: [
    CommonModule,
    MenuPrincipalRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule
  ]
})
export class MenuPrincipalModule { }
