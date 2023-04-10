import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarcacionTrabajadorComponent } from './marcacion-trabajador.component';

const routes: Routes = [
  {
    path: '',
    component: MarcacionTrabajadorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarcacionTrabajadorRoutingModule {}
