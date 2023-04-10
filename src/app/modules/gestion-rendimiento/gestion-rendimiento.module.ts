import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionRendimientoComponent } from './gestion-rendimiento/gestion-rendimiento.component';
import { GestionRendimientoRoutingModule } from './gestion-rendimiento-routing.module'
import { MaterialModule } from '@material';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { MisTareasComponent } from './components/mis-tareas/mis-tareas.component';
import { MiEquipoComponent } from './components/mi-equipo/mi-equipo.component';
import { UserAddDeleteComponent } from './components/mi-equipo/dialogs/user-add-delete/user-add-delete.component';
import { UserTaskComponent } from './components/mi-equipo/dialogs/user-task/user-task.component';
import { UserAddTaskComponent } from './components/mi-equipo/dialogs/user-add-task/user-add-task.component';
import { UserDownloadTaskComponent } from './components/mi-equipo/dialogs/user-download-task/user-download-task.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReportTaskComponent } from './components/mis-tareas/dialogs/report-task/report-task.component';
import { UserDownloadFileComponent } from './components/mi-equipo/dialogs/user-download-file/user-download-file.component';
import { UserEditComponent } from './components/mi-equipo/dialogs/user-edit/user-edit.component';
import { TaskRejectComponent } from './components/mi-equipo/dialogs/task-reject/task-reject.component';
import { PdfComponent } from './components/mi-equipo/dialogs/pdf/pdf.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MisRequerimientosComponent } from './components/mis-requerimientos/mis-requerimientos.component';
import { ReadRequirementComponent } from './components/mis-requerimientos/dialogs/read-requirement/read-requirement.component';
import { ConfirmAcceptComponent } from './components/mis-requerimientos/dialogs/confirm-accept/confirm-accept.component';
import { DissaproveRequirementComponent } from './components/mis-requerimientos/dialogs/dissaprove-requirement/dissaprove-requirement.component';
import { MoveRequirementComponent } from './components/mis-requerimientos/dialogs/move-requirement/move-requirement.component';

@NgModule({
  declarations: [
    GestionRendimientoComponent,
    MisTareasComponent,
    MiEquipoComponent,
    UserAddDeleteComponent,
    UserTaskComponent,
    UserAddTaskComponent,
    UserDownloadTaskComponent,
    ReportTaskComponent,
    UserDownloadFileComponent,
    UserEditComponent,
    TaskRejectComponent,
    PdfComponent,
    MisRequerimientosComponent,
    ReadRequirementComponent,
    ConfirmAcceptComponent,
    DissaproveRequirementComponent,
    MoveRequirementComponent
  ],
  imports: [
    CommonModule,
    GestionRendimientoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule,
    NgxExtendedPdfViewerModule
  ]
})
export class GestionRendimientoModule { }
