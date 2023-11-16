import { filter } from 'rxjs/operators';
import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UserDownloadTaskComponent } from '../user-download-task/user-download-task.component';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { DialogService, NotificationService } from '@core/services';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { EvidenciaResponseDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
//import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.scss']
})
export class UserTaskComponent implements OnInit {
  evidenciaResponseDto: EvidenciaResponseDto;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'requerimiento', 'estado', 'porcentaje', 'acciones'];
  idUsuario: number;

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UserTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    private _dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    // console.log(this.data);
  }

  verTareas(element, id: number) {
    const dialogRef: MatDialogRef<UserDownloadTaskComponent> = this.dialog.open(UserDownloadTaskComponent, {
      disableClose: false,
      width: '65%',
      //height: '780px',
      autoFocus: false,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result == 'ok') {
      // this.loadTable()
      // }
    });
  }

  // finalizarTarea(element) {
  //   this._dialogService
  //     .openConfirm('¿Está seguro de aprobar la tarea?', element.tarea)
  //     .pipe(filter((isConfirmed) => isConfirmed))
  //     .subscribe(() => this.onSave());
  // }
  // onSave() {
  // }

  finalizarTarea(element) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de finalizar el requerimiento?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.services.finalizarTareaAdministrador(element.idRequerimientoUsuario).subscribe(() => {
        //   this._notification.success('Requerimiento finalizado correctamente');
        // });
      }
      this.confirmDialogRef == null;
    });
  }

  async exportToExcel(element) {

  }

}
