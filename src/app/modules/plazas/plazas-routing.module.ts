import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlazasComponent } from '@modules/plazas/plazas/plazas.component';

const routes: Routes = [
  {
    path: '',
    component: PlazasComponent,
    data: {
      title: 'Plazas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlazasRoutingModule { }
