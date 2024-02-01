import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisBoletasRoutingModule } from './mis-boletas-routing.module';
import { MisBoletasComponent } from './mis-boletas/mis-boletas.component';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { InscribirseBoletasComponent } from './components/inscribirse-boletas/inscribirse-boletas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { VerBoletaComponent } from './components/ver-boleta/ver-boleta.component';


@NgModule({
  declarations: [
    MisBoletasComponent,
    InscribirseBoletasComponent,
    VerBoletaComponent
  ],
  imports: [
    CommonModule,
    MisBoletasRoutingModule,
    MaterialModule,
    MatGridListModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule
  ]
})
export class MisBoletasModule { }
