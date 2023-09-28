import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrarInscripcionComponent } from './administrar-inscripcion/administrar-inscripcion.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrarInscripcionComponent,
    data: {
      title: 'Administrar Campañas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrarInscripcionRoutingModule { }
