import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarcacionComponent } from './marcacion.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: MarcacionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class MarcacionRoutingModule {}
