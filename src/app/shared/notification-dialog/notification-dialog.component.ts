import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export enum NotificationType {
  INFO,
  SUCCESS,
  WARNING,
  ERROR,
}

export interface NotificationDialog {
  title: string;
  message?: string;
  type?: NotificationType;
}

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss'],
})
export class NotificationDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: NotificationDialog) {}

  ngOnInit(): void {}
}
