import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@material';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CarouselComponent } from './carousel/carousel.component';
import { EnvironmentIndicatorComponent } from './environment-indicator/environment-indicator.component';
import { CrudComponent } from './crud/crud.component';
import { TableComponent } from './table/table.component';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';
import { ImageOptionsComponent } from './image-options/image-options.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ConfirmarPanelComponent } from './confirmar-panel/confirmar-panel.component';
import { OnomasticoDialogComponent } from './onomastico-dialog/onomastico-dialog.component';

const components = [
  ConfirmDialogComponent,
  CarouselComponent,
  EnvironmentIndicatorComponent,
  CrudComponent,
  NotificationDialogComponent,
  TableComponent,
  ImageOptionsComponent,
  ConfirmarPanelComponent,
  OnomasticoDialogComponent
];

@NgModule({
  declarations: components,
  imports: [CommonModule, MaterialModule, MatGridListModule],
  exports: components,
})
export class SharedModule {}
