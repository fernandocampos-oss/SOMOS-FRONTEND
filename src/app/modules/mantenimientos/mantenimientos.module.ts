import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@material';
import { SharedModule } from '@shared/shared.module';
import { MantenimientosRoutingModule } from './mantenimientos-routing.module';
import { MantenimientosComponent } from './mantenimientos.component';
import { ProgramacionRegisterUpdateDialog } from '../configuraciones/dialogs/programacion-register-update/programacion-register-update.dialog';
import { SedeRegisterUpdateDialog } from './dialogs/sede-register-update/sede-register-update.dialog';
import { ZonaRegisterUpdateDialog } from './dialogs/zona-register-update/zona-register-update.dialog';
import { CoreModule } from '@core/core.module';
import { MarcacionRegisterUpdateDialog } from '../configuraciones/dialogs/marcacion-register-update/marcacion-register-update.dialog';
import { UsuarioRegisterUpdateDialog } from './dialogs/usuario-register-update/usuario-register-update.dialog';

@NgModule({
  declarations: [
    MantenimientosComponent,
    ProgramacionRegisterUpdateDialog,
    SedeRegisterUpdateDialog,
    ZonaRegisterUpdateDialog,
    MarcacionRegisterUpdateDialog,
    UsuarioRegisterUpdateDialog,
  ],
  imports: [
    CommonModule,
    MantenimientosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
})
export class MantenimientosModule {}
