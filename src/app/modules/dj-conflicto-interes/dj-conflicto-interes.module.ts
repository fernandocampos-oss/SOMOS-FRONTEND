import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DjConflictoInteresComponent } from './dj-conflicto-interes.component';
import { DjConflictoInteresRoutingModule } from './dj-conflicto-interes-routing.module';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DjConflictoRegisterUpdateComponent } from './components/dialogs/dj-conflicto-register-update/dj-conflicto-register-update.component';

@NgModule({
  declarations: [
    DjConflictoInteresComponent,
    DjConflictoRegisterUpdateComponent
  ],
  imports: [
    CommonModule,
    DjConflictoInteresRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule,
    NgxExtendedPdfViewerModule
  ],
})
export class DjConflictoInteresModule { }
