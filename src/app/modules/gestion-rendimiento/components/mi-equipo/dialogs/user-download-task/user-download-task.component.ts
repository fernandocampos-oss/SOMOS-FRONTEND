import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common'
import { UserDownloadFileComponent } from '../user-download-file/user-download-file.component';
import { DialogService } from '@core/services';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { filter } from 'rxjs/operators';
import { TaskRejectComponent } from '../task-reject/task-reject.component';

@Component({
  providers: [DatePipe],
  selector: 'app-user-download-task',
  templateUrl: './user-download-task.component.html',
  styleUrls: ['./user-download-task.component.scss']
})
export class UserDownloadTaskComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'descripcion', 'porcentaje', 'fecha', 'acciones'];
  objElement: any;
  flgJefe: boolean = false;
  form: FormGroup;
  idTarea: number;
  idEstado: number;
  msj: string = "";
  numerador: number = 0;

  constructor(
    private _dialogService: DialogService,
    private dialog: MatDialog,
    private _fb: FormBuilder,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<UserDownloadTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private services: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    // this.idEstado=this.data.obj.idEstado;
    // this.idTarea=this.data.obj.id;
    // this.flgJefe=this.data.flg;
    // this.objElement=this.data.obj;
    // this.msj=this.data.obj.msj
    // this.numerador=this.data.obj.numerador;
    this.createForm();
    this.showMsj();
    this.loadTable();
  }

  loadTable() {
    if (this.data.model.listTarea) {
      this.dataSource = new MatTableDataSource(this.data.model.listTarea);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = null;
      this._notification.warning("Lista de tareas vacia");
    }
  }

  createForm() {
    this.form = this._fb.group({
      // frmDescripcion: [this.data.objAsignacion.nombreTarea],
      // frmFecFin: [[new Date(this.data.objAsignacion.plazo.split('/')[2],this.data.objAsignacion.plazo.split('/')[1]-1,this.data.objAsignacion.plazo.split('/')[0]).toLocaleDateString()]],
      // frmEstado: [this.data.objAsignacion.estado],
      frmDescripcion: [this.data.model.requerimiento.descripcion],
      frmFecFin: [[new Date(this.data.model.requerimiento.fechaCreacion)]],
      frmEstado: [this.data.model.estadoRequerimiento.descripcion],
      // frmCodigo: [this.objElement.codigo],
      // frmReferencia: [this.objElement.referencia],
      // frmMotivo: [this.objElement.motivo]
    });
  }


  showMsj() {
    if (this.msj != null && this.msj.length > 0) {
      this._notification.error(this.msj)
    }
  }

  showDialogFiles(element) {
    const dialogRef: MatDialogRef<UserDownloadFileComponent> = this.dialog.open(UserDownloadFileComponent, {
      disableClose: false,
      width: '500px',
      //height: '780px',
      autoFocus: false,
      data: {
        idTarea: element.idTarea
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok') {

      }
    });
  }

  showDialogRejectTasks() {
    const dialogRef: MatDialogRef<TaskRejectComponent> = this.dialog.open(TaskRejectComponent, {
      disableClose: false,
      width: '500px',
      autoFocus: false,
      data: {
        id: this.idTarea,
        numerador: this.numerador
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok') {
        this.dialogRef.close("ok")
      }
    });
  }

  confirmAprobar(aprobar: boolean) {
    this._dialogService
      .openConfirm('¿Está seguro de Aprobar la tarea?')
      .pipe(filter((isConfirmed) => isConfirmed))
      .subscribe(() => this.aprobar());
  }

  aprobar() {
    let obj = new Aprobar();
    obj.id = this.idTarea;
    obj.estado = true;
    this.services.AprobarRechazarTarea(obj).subscribe({
      next: data => {
        this.dialogRef.close("ok");
        this._notification.success("Se actualizó el estado de la tarea")
      },
      error: error => {
        this._notification.error("Aprobar: Se produjo un error")
      }
    });
  }

}


export class Aprobar {
  id: number
  estado: boolean
  motivo: string
}