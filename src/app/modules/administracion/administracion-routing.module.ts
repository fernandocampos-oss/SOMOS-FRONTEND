import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionComponent } from './administracion/administracion.component';
import { AppRoute } from '@data/constants';
import { AdministrarUsuariosComponent } from './administrar-usuarios/administrar-usuarios.component';
import { AdministrarInscripcionComponent } from './administrar-inscripcion/administrar-inscripcion.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AdministracionComponent,
  //   data: {
  //     title: 'Administrar Plataforma'
  //   }
  // },
  {
    path: AppRoute.ADMINISTRAR_USUARIOS,
    component: AdministrarUsuariosComponent,
    data: {
      title: 'Administrar Usuarios Plataforma'
    }
  },
  {
    path: AppRoute.ADMINISTRAR_INSCRIPCIONES,
    component: AdministrarInscripcionComponent,
    data: {
      title: 'Administrar Campañas'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
