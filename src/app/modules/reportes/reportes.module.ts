import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { CoreModule } from '@angular/flex-layout';
import { SharedModule } from '@shared/shared.module';
import { ReportesComponent } from './reportes/reportes.component';
import { ReporteRequerimientosComponent } from './components/reporte-requerimientos/reporte-requerimientos.component';



@NgModule({
  declarations: [
    ReportesComponent,
    ReporteRequerimientosComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule,
    FormsModule
  ]
})
export class ReportesModule { }
