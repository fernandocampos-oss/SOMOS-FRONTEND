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
//import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.scss']
})
export class UserTaskComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'requerimiento', 'estado', 'porcentaje', 'acciones'];
  idUsuario: number;
  nombreUsuario: string;

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
    console.log(this.data);
    this.nombreUsuario = this.data.model.nombres + " " + this.data.model.apellidos;
    this.loadTableRequerimiento(this.data.model.idUsuario);

    // var workbook = XLSX.utils.book_new();
    // var worksheet = XLSX.utils.aoa_to_sheet([]);

    // for (let i = 0; i < this.datosAsignados.length; i++) {
    //   XLSX.utils.sheet_add_aoa(worksheet,[[this.datosAsignados[i].idReq,this.datosAsignados[i].nombreTarea,this.datosAsignados[i].avance]], { origin: `B${i+1}` })
    // }
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Prueba 1');
    // console.log(worksheet);
    // console.log(workbook);
    // XLSX.writeFile(workbook, "out.xlsx");

  }

  // loadTable() {
  //   this.services.ListarTareas(this.idUsuario).subscribe((dataItem) => {
  //     if (dataItem.codigo == 0) {
  //       this.dataSource = new MatTableDataSource(dataItem);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     } else {
  //       this.dataSource = null;
  //       if (dataItem.msj == "LISTA VACIA") {
  //         this._notification.warning(dataItem.msj)
  //       } else {
  //         this._notification.error(dataItem.msj)
  //       }
  //     }
  //   });
  // }

  // showDialogTaksUser() {
  //   const dialogRef: MatDialogRef<UserAddTaskComponent> = this.dialog.open(UserAddTaskComponent, {
  //     disableClose: false,
  //     width: '450px',
  //     //height: '780px',
  //     autoFocus: false,
  //     data: {
  //       auto: false,
  //       id: this.idUsuario
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     // this.loadTable();
  //   });
  // }

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
      if (result == 'ok') {
        // this.loadTable()
      }
    });
  }

  // finalizarTarea(element) {
  //   this._dialogService
  //     .openConfirm('¿Está seguro de aprobar la tarea?', element.tarea)
  //     .pipe(filter((isConfirmed) => isConfirmed))
  //     .subscribe(() => this.onSave());
  // }

  finalizarTarea(element) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de finalizar el requerimiento?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.services.finalizarTareaAdministrador(element.idRequerimientoUsuario).subscribe(() => {
          this._notification.success('Requerimiento finalizado con exito');
        });
        this.loadTableRequerimiento(this.data.model.idUsuario);
      }
      this.confirmDialogRef == null;
    });
  }

  onSave() {

  }

  async loadTableRequerimiento(idUsuario: Number) {
    let load = await this.services.listarRequerimientosPorPersonal(idUsuario).then((data: any) => {
      if (data.length > 0) {
        console.log(data)
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = null;
        this._notification.warning("El integrante no cuenta con requerimientos");
      }
    });
  }

}
