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
import { PdfComponent } from '../pdf/pdf.component';

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
  displayedColumns: string[] = ['item', 'descripcion', 'fecha', 'acciones'];
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
    // this.idEstado=this.data.obj.idEstado;
    // this.flgJefe=this.data.flg;
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
      frmTitulo: [this.data.model.requerimiento.nombre],
      // frmFecFin: [[new Date(this.data.objAsignacion.plazo.split('/')[2],this.data.objAsignacion.plazo.split('/')[1]-1,this.data.objAsignacion.plazo.split('/')[0]).toLocaleDateString()]],
      frmDescripcion: [this.data.model.requerimiento.descripcion],
      frmEstado: [this.data.model.estadoRequerimiento.descripcion],
      frmFecFin: [[new Date(this.data.model.requerimiento.fechaCreacion).toISOString().split('T', 1)[0]]]      
    });
  }

  showMsj() {
    if (this.msj != null && this.msj.length > 0) {
      this._notification.error(this.msj)
    }
  }

  verEvidencia(element) {
    const dialogRef: MatDialogRef<UserDownloadFileComponent> = this.dialog.open(UserDownloadFileComponent, {
      disableClose: false,
      width: '500px',
      //height: '780px',
      autoFocus: false,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok') {

      }
    });
  }

  verPdf(element) {
    const dialogRef: MatDialogRef<PdfComponent> = this.dialog.open(PdfComponent, {
      disableClose: false,
      width: '50%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTablePendiente();
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
    // this.services.AprobarRechazarTarea(obj).subscribe({
    //   next: data => {
    //     this.dialogRef.close("ok");
    //     this._notification.success("Se actualizó el estado de la tarea")
    //   },
    //   error: error => {
    //     this._notification.error("Aprobar: Se produjo un error")
    //   }
    // });
  }

}


export class Aprobar {
  id: number
  estado: boolean
  motivo: string
}