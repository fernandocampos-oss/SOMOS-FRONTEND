import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisRequerimientosComponent } from './mis-requerimientos/mis-requerimientos.component';

const routes: Routes = [
  {
    path: '',
    component: MisRequerimientosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisRequerimientosRoutingModule { }
