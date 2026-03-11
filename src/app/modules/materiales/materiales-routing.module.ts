import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialesComponent } from '@modules/materiales/materiales/materiales.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialesComponent,
    data: {
      title: 'Materiales'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }
