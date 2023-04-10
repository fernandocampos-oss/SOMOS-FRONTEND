import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DdjjConflictosInteresRoutingModule } from './ddjj-conflictos-interes-routing.module';
import { DdjjConflictosInteresComponent } from './ddjj-conflictos-interes.component';
import { MaterialModule } from '@material';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@angular/flex-layout';
import { SharedModule } from '@shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DdjjConflictosComponent } from './components/ddjj-conflictos/ddjj-conflictos.component';
import { DdjjImpedimentoLaboralComponent } from './components/ddjj-impedimento-laboral/ddjj-impedimento-laboral.component';
import { DdjjNoParentescoComponent } from './components/ddjj-no-parentesco/ddjj-no-parentesco.component';
import { NotificationParentescoComponent } from './components/dialogs/notification-parentesco/notification-parentesco.component';


@NgModule({
  declarations: [
    DdjjConflictosInteresComponent,
    DdjjConflictosComponent,
    DdjjImpedimentoLaboralComponent,
    DdjjNoParentescoComponent,
    NotificationParentescoComponent
  ],
  imports: [
    CommonModule,
    DdjjConflictosInteresRoutingModule,

    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule,
    NgxExtendedPdfViewerModule
  ]
})
export class DdjjConflictosInteresModule { }
