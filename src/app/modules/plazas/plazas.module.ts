import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlazasRoutingModule } from './plazas-routing.module';
import { PlazasComponent } from './plazas/plazas.component';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    PlazasComponent
  ],
  imports: [
    CommonModule,
    PlazasRoutingModule,
    MaterialModule,
    MatGridListModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class PlazasModule { }
