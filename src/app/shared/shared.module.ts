import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@material';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CarouselComponent } from './carousel/carousel.component';
import { EnvironmentIndicatorComponent } from './environment-indicator/environment-indicator.component';
import { CrudComponent } from './crud/crud.component';
import { TableComponent } from './table/table.component';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';

const components = [
  ConfirmDialogComponent,
  CarouselComponent,
  EnvironmentIndicatorComponent,
  CrudComponent,
  NotificationDialogComponent,
  TableComponent,
];

@NgModule({
  declarations: components,
  imports: [CommonModule, MaterialModule],
  exports: components,
})
export class SharedModule {}
