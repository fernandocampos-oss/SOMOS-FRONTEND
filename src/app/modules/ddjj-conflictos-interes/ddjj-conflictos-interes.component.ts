import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationParentescoComponent } from './components/dialogs/notification-parentesco/notification-parentesco.component';

@Component({
  selector: 'app-ddjj-conflictos-interes',
  templateUrl: './ddjj-conflictos-interes.component.html',
  styleUrls: ['./ddjj-conflictos-interes.component.scss'],
})
export class DdjjConflictosInteresComponent implements OnInit {
  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  open(cuadro: number) {
    switch (cuadro) {
      case 1: //this._router.navigate(['../conflicto']);
        this._router.navigate(['conflicto'], { relativeTo: this.route });
        break;
      case 2:
        this._router.navigate(['impedimento'], { relativeTo: this.route });
        break;
      case 3:
        this.openNotification();
        break; //this._router.navigate(['no-parentesco'], { relativeTo: this.route });break;
    }
  }


  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }

  openNotification() {
    const dialogRef = this.dialog.open(NotificationParentescoComponent, {
      maxWidth: '729px',
      maxHeight : '461px',
      disableClose: true ,
      panelClass: 'custom-modalbox' 
      //data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._router.navigate(['no-parentesco'], { relativeTo: this.route });
    });
  }
}
