import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisRequerimientosRoutingModule } from './mis-requerimientos-routing.module';
import { MisRequerimientosComponent } from './mis-requerimientos/mis-requerimientos.component';
import { MaterialModule } from '@material';
import { SharedModule } from '@shared/shared.module';
import { RequerimientoRegisterUpdateComponent } from './components/requerimiento-register-update/requerimiento-register-update.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MisRequerimientosComponent,
    RequerimientoRegisterUpdateComponent
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
