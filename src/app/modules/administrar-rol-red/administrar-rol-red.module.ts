import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrarRolRedComponent } from './administrar-rol-red/administrar-rol-red.component';
import { AdministrarRolRedRoutingModule } from './administrar-rol-red-routing.module';
import { MaterialModule } from '@material';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmarDialogoComponent } from './administrar-rol-red/confirmar-dialogo/confirmar-dialogo.component';
import { EditarRedComponent } from './components/editar-red/editar-red.component';



@NgModule({
  declarations: [
    AdministrarRolRedComponent,
    ConfirmarDialogoComponent,
    EditarRedComponent
  ],
  imports: [
    CommonModule,
    AdministrarRolRedRoutingModule,
    MaterialModule,
    MatGridListModule,
    NgxChartsModule,
    ReactiveFormsModule, 
    FormsModule,
  ]
})
export class AdministrarRolRedModule { }
