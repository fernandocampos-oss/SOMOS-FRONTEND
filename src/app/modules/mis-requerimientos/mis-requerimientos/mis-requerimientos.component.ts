import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Requerimiento } from '@data/models/requerimiento/requerimiento.model';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ColumnDef, ColumnType } from '@shared/table/table.component';
import { filter } from 'rxjs/operators';
import { RequerimientoRegisterUpdateComponent } from '../components/requerimiento-register-update/requerimiento-register-update.component';

@Component({
  selector: 'app-mis-requerimientos',
  templateUrl: './mis-requerimientos.component.html',
  styleUrls: ['./mis-requerimientos.component.scss']
})
export class MisRequerimientosComponent implements OnInit {
  requerimientoList: Requerimiento[] = [];
  requerimientoColumns: ColumnDef[] = [
    {
      label: 'Requerimiento',
      name: 'nombre',
    },
    {
      label: 'Área solicitada',
      name: 'areaReceptora',
    },
    {
      label: 'Estado',
      name: 'estado',
    },
  ];
  constructor(
    private _matDialog: MatDialog,
    ) { }

  ngOnInit(): void {
  }

  onCreateRequerimiento(){
    const dialogRef: MatDialogRef<RequerimientoRegisterUpdateComponent> = this._matDialog.open(RequerimientoRegisterUpdateComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: false,
      data: {
        auto: true,
        id : 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.loadTable();
    });
    //this._openAddUpdateDialog(RequerimientoRegisterUpdateComponent, null, this._loadRequerimientos);
  }

  onDeleteRequerimiento($event){

  }
  private _openAddUpdateDialog<T>(
    dialog: ComponentType<T>,
    data: any,
    callback: () => void
  ) {
    this._matDialog
      .open(dialog, { data, disableClose: true })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((isSuccess) => isSuccess)
      )
      .subscribe(() => callback.call(this));
  }
}
