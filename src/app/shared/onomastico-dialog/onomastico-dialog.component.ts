import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-onomastico-dialog',
  templateUrl: './onomastico-dialog.component.html',
  styleUrls: ['./onomastico-dialog.component.scss']
})
export class OnomasticoDialogComponent implements OnInit {
  isMobile = false;
  titular: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<OnomasticoDialogComponent>,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.titular = this._data.nombres;
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
