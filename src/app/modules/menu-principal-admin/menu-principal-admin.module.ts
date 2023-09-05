import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuPrincipalAdminRoutingModule } from './menu-principal-admin-routing.module';
import { MenuPrincipalAdminComponent } from './menu-principal-admin/menu-principal-admin.component';


@NgModule({
  declarations: [
    MenuPrincipalAdminComponent
  ],
  imports: [
    CommonModule,
    MenuPrincipalAdminRoutingModule
  ]
})
export class MenuPrincipalAdminModule { }
