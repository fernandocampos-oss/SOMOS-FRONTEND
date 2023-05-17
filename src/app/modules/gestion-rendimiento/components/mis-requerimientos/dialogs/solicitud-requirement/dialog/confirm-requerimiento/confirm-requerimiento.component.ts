import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-confirm-requerimiento',
  templateUrl: './confirm-requerimiento.component.html',
  styleUrls: ['./confirm-requerimiento.component.scss']
})
export class ConfirmRequerimientoComponent implements OnInit {

  constructor(private dialogRef       : MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _snackbar       : SnackbarService,
              private _service        : GestionRendimientoService,) { }

  ngOnInit(): void {
    console.log(this.data.obj);
  }

  closeAll(){
    console.log(this.data.obj);
    this._service.updateTareasFauxRequerimientos(this.data.obj);
    this._snackbar.success("Requerimiento asignado adecuadamente");
    this.dialogRef.closeAll();
  }
}
