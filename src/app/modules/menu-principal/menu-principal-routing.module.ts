import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { AppRoute } from '@data/constants';
import { FormRenuevaEssaludComponent } from './components/form-renueva-essalud/form-renueva-essalud.component';

const routes: Routes = [
  {
    path: '',
    component: MenuPrincipalComponent,
  },
  {
    path: AppRoute.RENUEVA_ESSALUD,
    component: FormRenuevaEssaludComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuPrincipalRoutingModule { }
