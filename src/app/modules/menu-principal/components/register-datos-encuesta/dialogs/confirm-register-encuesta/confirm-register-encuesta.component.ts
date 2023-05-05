import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@core/services';
import { MenuPrincipalService } from '@data/services/menu-principal.service';

@Component({
  selector: 'app-confirm-register-encuesta',
  templateUrl: './confirm-register-encuesta.component.html',
  styleUrls: ['./confirm-register-encuesta.component.scss']
})
export class ConfirmRegisterEncuestaComponent implements OnInit {

  constructor(private dialogRef: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _snackbar: SnackbarService,
              private _menuService    : MenuPrincipalService,) { }

  ngOnInit(): void {
  }
  closeAll(){
    this._menuService.sendEncuesta(this.data.idEncuesta, this.data.encuesta).subscribe((dataItem) => {});
    this._snackbar.success('Encuesta enviada correctamente');
    this.dialogRef.closeAll();
  }
}
