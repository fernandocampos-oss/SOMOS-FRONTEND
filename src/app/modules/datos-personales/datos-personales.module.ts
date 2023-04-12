import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatosPersonalesRoutingModule } from './datos-personales-routing.module';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import { DatosAcademicosComponent } from './components/datos-academicos/datos-academicos.component';
import { DatosFamiliaresComponent } from './components/datos-familiares/datos-familiares.component';
import { DatosPersonalesTabComponent } from './components/datos-personales-tab/datos-personales-tab.component';
import { MaterialModule } from '@material';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DatosPersonalesUpdateComponent } from './components/dialogs/datos-personales-update/datos-personales-update.component';
import { FichaUnicaPersonalComponent } from './components/ficha-unica-personal/ficha-unica-personal.component';
import { FichaUnicaEmpleadoComponent } from './components/ficha-unica-empleado/ficha-unica-empleado.component';
import { HijosRegisterUpdateComponent } from './components/dialogs/hijos-register-update copy/hijos-register-update.component';
import { EducacionRegisterUpdateComponent } from './components/dialogs/educacion-register-update/educacion-register-update.component';
import { IdiomaRegisterUpdateComponent } from './components/dialogs/idioma-register-update/idioma-register-update.component';
import { ExperienciaRegisterUpdateComponent } from './components/dialogs/experiencia-register-update/experiencia-register-update.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    DatosPersonalesComponent,
    DatosAcademicosComponent,
    DatosFamiliaresComponent,
    DatosPersonalesTabComponent,
    DatosPersonalesUpdateComponent,
    FichaUnicaPersonalComponent,
    FichaUnicaEmpleadoComponent,
    HijosRegisterUpdateComponent,
    EducacionRegisterUpdateComponent,
    IdiomaRegisterUpdateComponent,
    ExperienciaRegisterUpdateComponent
  ],
  imports: [
    CommonModule,
    DatosPersonalesRoutingModule,
    MaterialModule,
    MatIconModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule,
    NgxExtendedPdfViewerModule
  ]
})
export class DatosPersonalesModule { }
