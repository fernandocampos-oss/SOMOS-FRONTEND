import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisRequerimientosRoutingModule } from './mis-requerimientos-routing.module';
import { MisRequerimientosComponent } from './mis-requerimientos/mis-requerimientos.component';
import { MaterialModule } from '@material';
import { SharedModule } from '@shared/shared.module';
import { RequerimientoRegisterUpdateComponent } from './components/requerimiento-register-update/requerimiento-register-update.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import { VerTareaComponent } from './components/ver-tarea/ver-tarea.component';
import { EdicionEvidenciaComponent } from './components/ver-tarea/edicion-evidencia/edicion-evidencia.component';


@NgModule({
  declarations: [
    MisRequerimientosComponent,
    RequerimientoRegisterUpdateComponent,
    VerTareaComponent,
    EdicionEvidenciaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatGridListModule,
    MisRequerimientosRoutingModule,
    SharedModule
  ]
})
export class MisRequerimientosModule { }
