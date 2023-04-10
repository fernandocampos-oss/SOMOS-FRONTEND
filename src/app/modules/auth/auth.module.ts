import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@material';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthComponent } from './auth.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ConfirmTokenDialog } from './registro/dialogs/confirm-token/confirm-token.dialog';
import { ConfirmarCambioClaveComponent } from './confirmar-cambio-clave/confirmar-cambio-clave.component';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  declarations: [
    LoginComponent,
    CambiarClaveComponent,
    RegistroComponent,
    AuthComponent,
    ConfirmTokenDialog,
    ConfirmarCambioClaveComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    AuthRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    FlexLayoutModule
  ],
})
export class AuthModule {}
