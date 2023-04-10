import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PanelMarcacionComponent } from './panel-marcacion.component';

const routes: Routes = [
  {
    path: '',
    component: PanelMarcacionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelMarcacionRoutingModule {}
