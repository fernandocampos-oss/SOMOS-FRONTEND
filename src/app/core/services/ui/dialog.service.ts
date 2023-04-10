import { Injectable } from '@angular/core';

import {
  ConfirmDialogComponent,
  ConfirmDialog,
} from '@shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationType } from '@data/enums/notification-type.enum';
import { AppConfig } from '@core/configs';
import {
  NotificationDialog,
  NotificationDialogComponent,
} from '@shared/notification-dialog/notification-dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private _dialog: MatDialog) {}

  openConfirm(message: string, title: string = AppConfig.NAME) {
    const data: ConfirmDialog = {
      title,
      message,
      type: NotificationType.ERROR,
    };
    const config: MatDialogConfig = { data };
    return this._dialog.open(ConfirmDialogComponent, config).afterClosed();
  }

  success(message: string, title: string = AppConfig.NAME) {
    const config: MatDialogConfig = this._buildConfig(
      message,
      title,
      NotificationType.SUCCESS
    );
    return this._dialog.open(NotificationDialogComponent, config);
  }
  private _buildConfig(message: string, title: string, type: NotificationType) {
    const data: NotificationDialog = {
      title,
      message,
      type,
    };
    const config: MatDialogConfig = { data };
    return config;
  }
}
