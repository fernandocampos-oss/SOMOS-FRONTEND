import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IndicadoresTrabajadorComponent } from './indicadores-trabajador/indicadores-trabajador.component';

const routes: Routes = [
  {
    path: '',
    component: IndicadoresTrabajadorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicadoresTrabajadorRoutingModule { }
