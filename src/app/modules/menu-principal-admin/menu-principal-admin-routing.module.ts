import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPrincipalAdminComponent } from './menu-principal-admin/menu-principal-admin.component';

const routes: Routes = [
  {
    path: '',
    component: MenuPrincipalAdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuPrincipalAdminRoutingModule { }
