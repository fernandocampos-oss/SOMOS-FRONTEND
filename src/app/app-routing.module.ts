import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NoAuthGuard } from '@core/guards/no-auth.guard';
import { AppRoute } from '@data/constants/app-route.constant';
import { AuthGuard } from './core/guards/auth.guard';
import { ShowPausaActivaComponent } from '@modules/menu-principal/components/show-pausa-activa/show-pausa-activa.component';

export const ROUTES: Routes = [
  {
    path: AppRoute.AUTH,
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule),
    canActivate: [AuthGuard],
  },
  { path: 'show-pausa-activa', component: ShowPausaActivaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
})
export class AppRoutingModule {}
