import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdministrarRolRedComponent } from './administrar-rol-red/administrar-rol-red.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrarRolRedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrarRolRedRoutingModule { }
