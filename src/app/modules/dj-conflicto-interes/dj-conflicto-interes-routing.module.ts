import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DjConflictoInteresComponent } from './dj-conflicto-interes.component';


const routes: Routes = [
  {
    path: '',
    component: DjConflictoInteresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DjConflictoInteresRoutingModule { }
