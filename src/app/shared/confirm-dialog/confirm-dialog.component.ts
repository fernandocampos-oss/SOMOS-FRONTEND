import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationType } from '@data/enums/notification-type.enum';
export interface ConfirmDialog {
  title: string;
  message?: string;
  messageAdicional?: string;
  confirmButtonText?: string;
  type?: NotificationType;
}
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  isTypeWaring = this.data.type === NotificationType.WARNING;
  isTypeInfo = this.data.type === NotificationType.INFO;
  isTypeError = this.data.type === NotificationType.ERROR;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialog) {}

  ngOnInit() {}

}
