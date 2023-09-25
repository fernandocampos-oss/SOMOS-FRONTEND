import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisMarcacionesComponent } from './mis-marcaciones.component';

const routes: Routes = [
  {
    path: '',
    component: MisMarcacionesComponent,
    data: {
      title: 'Mis Marcaciones'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisMarcacionesRoutingModule {}
