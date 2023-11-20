import { IndicadoresTrabajadorComponent } from './indicadores-trabajador/indicadores-trabajador.component';
import { IndicadoresTrabajadorRoutingModule } from './indicadores-trabajador-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from '@shared/shared.module';
import { RegistrarEvidenciaTrabajadorComponent } from './components/modal-tarea/registrar-evidencia-trabajador/registrar-evidencia-trabajador.component';
import { ModalTareaComponent } from './components/modal-tarea/modal-tarea.component';
import { VerEvidenciaImagenComponent } from './components/modal-tarea/ver-evidencia-imagen/ver-evidencia-imagen.component';
import { VerEvidenciaPdfComponent } from './components/modal-tarea/ver-evidencia-pdf/ver-evidencia-pdf.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [
    IndicadoresTrabajadorComponent,
    RegistrarEvidenciaTrabajadorComponent,
    ModalTareaComponent,
    VerEvidenciaImagenComponent,
    VerEvidenciaPdfComponent
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
