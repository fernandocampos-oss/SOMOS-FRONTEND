import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowBirthdayComponent } from '../components/show-birthday/show-birthday.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowSstComponent } from '../components/show-sst/show-sst.component';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss']
})
export class MenuPrincipalComponent implements OnInit {

  constructor(
    private dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  open(cuadro: number) {
    switch (cuadro) {
      case 1: 
      const dialogRef: MatDialogRef<ShowBirthdayComponent> = this.dialog.open(ShowBirthdayComponent, {
        disableClose: false,
        width: '50%',
        autoFocus: false,
      });
  
      dialogRef.afterClosed().subscribe(result => { });
        break;
      case 2:
      const dialogRef2: MatDialogRef<ShowSstComponent> = this.dialog.open(ShowSstComponent, {
          disableClose: false,
          width: '60%',
          autoFocus: false,
        });
    
        dialogRef2.afterClosed().subscribe(result => { });
          break;
    }
  }
}
