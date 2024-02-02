import { IndicadoresTrabajadorComponent } from './indicadores-trabajador/indicadores-trabajador.component';
import { IndicadoresTrabajadorRoutingModule } from './indicadores-trabajador-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from '@shared/shared.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { RegistrarSustentoComponent } from './components/registrar-sustento/registrar-sustento.component';
import { VerPdfSustentoComponent } from './components/ver-pdf-sustento/ver-pdf-sustento.component';

@NgModule({
  declarations: [
    IndicadoresTrabajadorComponent,
    RegistrarSustentoComponent,
    VerPdfSustentoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatGridListModule,
    IndicadoresTrabajadorRoutingModule,
    SharedModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
  ]
})
export class IndicadoresTrabajadorModule { }
