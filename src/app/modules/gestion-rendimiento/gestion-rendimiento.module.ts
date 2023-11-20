import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionRendimientoComponent } from './gestion-rendimiento/gestion-rendimiento.component';
import { GestionRendimientoRoutingModule } from './gestion-rendimiento-routing.module'
import { MaterialModule } from '@material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { MiEquipoComponent } from './components/mi-equipo/mi-equipo.component';
import { UserAddDeleteComponent } from './components/mi-equipo/dialogs/user-add-delete/user-add-delete.component';
import { UserAddTaskComponent } from './components/mi-equipo/dialogs/user-add-task/user-add-task.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { UserEditComponent } from './components/mi-equipo/dialogs/user-edit/user-edit.component';
import { TaskRejectComponent } from './components/mi-equipo/dialogs/task-reject/task-reject.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EditUserSelectedComponent } from './components/mi-equipo/dialogs/edit-user-selected/edit-user-selected.component';
import { IndicadoresPendientesJefeComponent } from './components/indicadores-pendientes-jefe/indicadores-pendientes-jefe.component';
import { RegistrarIndicadorJefeComponent } from './components/indicadores-pendientes-jefe/dialogs/registrar-indicador-jefe/registrar-indicador-jefe.component';
import { IndicadoresFinalizadosJefeComponent } from './components/indicadores-finalizados-jefe/indicadores-finalizados-jefe.component';
import { GestionarIndicadoresTrabajadorComponent } from './components/gestionar-indicadores-trabajador/gestionar-indicadores-trabajador.component';
import { AsignarTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-tarea/asignar-tarea.component';
import { ReadIndicadorTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/read-indicador-tarea/read-indicador-tarea.component';
import { EditTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/read-indicador-tarea/edit-tarea/edit-tarea.component';
import { AceptarRechazarTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/read-indicador-tarea/aceptar-rechazar-tarea/aceptar-rechazar-tarea.component';
import { AddPesoComponent } from './components/gestionar-indicadores-trabajador/dialogs/add-peso/add-peso.component';
import { RegistrarPrioridadComponent } from './components/gestionar-indicadores-trabajador/dialogs/registrar-prioridad/registrar-prioridad.component';
import { NotificacionCorreoComponent } from './components/gestionar-indicadores-trabajador/dialogs/notificacion-correo/notificacion-correo.component';
import { AsignarIndicadorComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-indicador/asignar-indicador.component';

@NgModule({
  declarations: [
    GestionRendimientoComponent,
    MiEquipoComponent,
    UserAddDeleteComponent,
    UserAddTaskComponent,
    UserEditComponent,
    TaskRejectComponent,
    EditUserSelectedComponent,
    IndicadoresPendientesJefeComponent,
    RegistrarIndicadorJefeComponent,
    IndicadoresFinalizadosJefeComponent,
    GestionarIndicadoresTrabajadorComponent,
    AsignarTareaComponent,
    ReadIndicadorTareaComponent,
    EditTareaComponent,
    AceptarRechazarTareaComponent,
    AddPesoComponent,
    RegistrarPrioridadComponent,
    NotificacionCorreoComponent,
    AsignarIndicadorComponent,
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
