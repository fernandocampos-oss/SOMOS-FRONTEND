import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoute } from '@data/constants/app-route.constant';
import { LoginComponent } from './login/login.component';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthComponent } from './auth.component';
import { ConfirmarCambioClaveComponent } from './confirmar-cambio-clave/confirmar-cambio-clave.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: AppRoute.LOGIN,
        component: LoginComponent,
      },
      {
        path: AppRoute.LOGIN_ADMIN,
        component: LoginAdminComponent,
      },
      {
        path: AppRoute.CAMBIAR_CLAVE,
        component: CambiarClaveComponent,
      },
      {
        path: AppRoute.CONFIRMAR_CAMBIO_CLAVE,
        component: ConfirmarCambioClaveComponent,
      },
      {
        path: AppRoute.REGISTRO,
        component: RegistroComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class AuthRoutingModule {}
