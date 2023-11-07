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
import { UserTaskComponent } from './components/mi-equipo/dialogs/user-task/user-task.component';
import { UserAddTaskComponent } from './components/mi-equipo/dialogs/user-add-task/user-add-task.component';
import { UserDownloadTaskComponent } from './components/mi-equipo/dialogs/user-download-task/user-download-task.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { UserDownloadFileComponent } from './components/mi-equipo/dialogs/user-download-file/user-download-file.component';
import { UserEditComponent } from './components/mi-equipo/dialogs/user-edit/user-edit.component';
import { TaskRejectComponent } from './components/mi-equipo/dialogs/task-reject/task-reject.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EditUserSelectedComponent } from './components/mi-equipo/dialogs/edit-user-selected/edit-user-selected.component';
import { DeleteDialogComponent } from './components/mi-equipo/dialogs/delete-dialog/delete-dialog.component';
import { IndicadoresPendientesJefeComponent } from './components/indicadores-pendientes-jefe/indicadores-pendientes-jefe.component';
import { RegistrarIndicadorJefeComponent } from './components/indicadores-pendientes-jefe/dialogs/registrar-indicador-jefe/registrar-indicador-jefe.component';
import { IndicadoresFinalizadosJefeComponent } from './components/indicadores-finalizados-jefe/indicadores-finalizados-jefe.component';
import { GestionarIndicadoresTrabajadorComponent } from './components/gestionar-indicadores-trabajador/gestionar-indicadores-trabajador.component';
import { AsignarTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-tarea/asignar-tarea.component';
import { ConfirmarTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-tarea/dialog/confirmar-tarea/confirmar-tarea.component';
import { ReadIndicadorTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/read-indicador-tarea/read-indicador-tarea.component';
import { EditTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/read-indicador-tarea/edit-tarea/edit-tarea.component';
import { AceptarRechazarTareaComponent } from './components/gestionar-indicadores-trabajador/dialogs/read-indicador-tarea/aceptar-rechazar-tarea/aceptar-rechazar-tarea.component';
import { AsignarComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar/asignar.component';

@NgModule({
  declarations: [
    GestionRendimientoComponent,
    MiEquipoComponent,
    UserAddDeleteComponent,
    UserTaskComponent,
    UserAddTaskComponent,
    UserDownloadTaskComponent,
    UserDownloadFileComponent,
    UserEditComponent,
    TaskRejectComponent,
    EditUserSelectedComponent,
    DeleteDialogComponent,
    IndicadoresPendientesJefeComponent,
    RegistrarIndicadorJefeComponent,
    IndicadoresFinalizadosJefeComponent,
    GestionarIndicadoresTrabajadorComponent,
    AsignarTareaComponent,
    ConfirmarTareaComponent,
    ReadIndicadorTareaComponent,
    EditTareaComponent,
    AceptarRechazarTareaComponent,
    AsignarComponent
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
