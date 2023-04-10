import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FichaUnicaEmpleadoComponent } from './components/ficha-unica-empleado/ficha-unica-empleado.component';
import { FichaUnicaPersonalComponent } from './components/ficha-unica-personal/ficha-unica-personal.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';

const routes: Routes = [  
{
  path: '',
  component: DatosPersonalesComponent,
},
// Ruta original{
//   path: '',
//   component: DatosPersonalesComponent,
// },
{
  path: 'ficha-unica-personal',
  component: FichaUnicaPersonalComponent,
},
{
  path: 'ficha-unica-empleado',
  component: FichaUnicaEmpleadoComponent,
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosPersonalesRoutingModule { }
