import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService, SnackbarService } from '@core/services';

@Component({
  selector: 'app-confirmar-dialogo',
  templateUrl: './confirmar-dialogo.component.html',
  styleUrls: ['./confirmar-dialogo.component.scss']
})
export class ConfirmarDialogoComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _notification: NotificationService,
    private _dialogRef: MatDialog,
    private _snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  async asignar() {
    this._notification.success("Usuario Desactivado");
    this._dialogRef.closeAll();
  }
}
