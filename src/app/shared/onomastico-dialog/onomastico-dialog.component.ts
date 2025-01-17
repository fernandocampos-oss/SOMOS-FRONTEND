import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-onomastico-dialog',
  templateUrl: './onomastico-dialog.component.html',
  styleUrls: ['./onomastico-dialog.component.scss']
})
export class OnomasticoDialogComponent implements OnInit {
  titular: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<OnomasticoDialogComponent>
  ) { }

  ngOnInit(): void {
    this.titular = this._data.nombres + " " + this._data.apellidos;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
