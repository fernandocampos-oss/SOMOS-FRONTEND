import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionRendimientoComponent } from './gestion-rendimiento/gestion-rendimiento.component';

const routes: Routes = [
  {
    path: '',
    component: GestionRendimientoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionRendimientoRoutingModule {}
