import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DdjjConflictosComponent } from './components/ddjj-conflictos/ddjj-conflictos.component';
import { DdjjImpedimentoLaboralComponent } from './components/ddjj-impedimento-laboral/ddjj-impedimento-laboral.component';
import { DdjjNoParentescoComponent } from './components/ddjj-no-parentesco/ddjj-no-parentesco.component';
import { DdjjConflictosInteresComponent } from './ddjj-conflictos-interes.component';

const routes: Routes = [
  {
    path: '',
    component: DdjjConflictosInteresComponent,
  },
  {
    path: 'conflicto',
    component: DdjjConflictosComponent,
  },
  {
    path: 'impedimento',
    component: DdjjImpedimentoLaboralComponent,
  },
  {
    path: 'no-parentesco',
    component: DdjjNoParentescoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DdjjConflictosInteresRoutingModule { }
