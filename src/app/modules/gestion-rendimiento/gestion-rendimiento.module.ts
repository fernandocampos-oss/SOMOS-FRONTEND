import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionRendimientoComponent } from './gestion-rendimiento/gestion-rendimiento.component';
import { GestionRendimientoRoutingModule } from './gestion-rendimiento-routing.module'
import { MaterialModule } from '@material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { IndicadoresPendientesJefeComponent } from './components/indicadores-pendientes-jefe/indicadores-pendientes-jefe.component';
import { RegistrarIndicadorJefeComponent } from './components/indicadores-pendientes-jefe/dialogs/registrar-indicador-jefe/registrar-indicador-jefe.component';
import { GestionarIndicadoresTrabajadorComponent } from './components/gestionar-indicadores-trabajador/gestionar-indicadores-trabajador.component';
import { ReadIndicadorTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/read-indicador-tarea/read-indicador-tarea.component';
import { EditTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/read-indicador-tarea/edit-tarea/edit-tarea.component';
import { AceptarRechazarTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/read-indicador-tarea/aceptar-rechazar-tarea/aceptar-rechazar-tarea.component';
import { NotificacionCorreoComponent } from './components/gestionar-indicadores-trabajador/dialogs/notificacion-correo/notificacion-correo.component';
import { AsignarIndicadorComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-indicador/asignar-indicador.component';
import { GrEquipoComponent } from './components/gestionar-indicadores-trabajador/dialogs/gr-equipo/gr-equipo.component';
import { AsignarPrioridadComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-prioridad/asignar-prioridad.component';
import { AsignarEvidenciaComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-evidencia/asignar-evidencia.component';
import { AlertaPesoComponent } from './components/gestionar-indicadores-trabajador/dialogs/alerta-peso/alerta-peso.component';
import { ReporteUsuarioGdrComponent } from './components/reporte-usuario-gdr/reporte-usuario-gdr.component';

@NgModule({
  declarations: [
    GestionRendimientoComponent,
    IndicadoresPendientesJefeComponent,
    RegistrarIndicadorJefeComponent,
    GestionarIndicadoresTrabajadorComponent,
    ReadIndicadorTareaComponent,
    EditTareaComponent,
    AceptarRechazarTareaComponent,
    NotificacionCorreoComponent,
    AsignarIndicadorComponent,
    GrEquipoComponent,
    AsignarPrioridadComponent,
    AsignarEvidenciaComponent,
    AlertaPesoComponent,
    ReporteUsuarioGdrComponent,
  ],
  imports: [
    CommonModule,
    GestionRendimientoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule,
    NgxExtendedPdfViewerModule,
    FormsModule,
  ]
})
export class GestionRendimientoModule { }
