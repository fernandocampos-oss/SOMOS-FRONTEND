import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisBoletasComponent } from './mis-boletas/mis-boletas.component';

const routes: Routes = [
  {
    path: '',
    component: MisBoletasComponent,
    data: {
      title: 'Mis Boletas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisBoletasRoutingModule { }
