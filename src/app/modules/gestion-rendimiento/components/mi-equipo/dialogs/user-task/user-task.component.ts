import { filter } from 'rxjs/operators';
import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UserAddTaskComponent } from '../user-add-task/user-add-task.component';
import { UserDownloadTaskComponent } from '../user-download-task/user-download-task.component';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { DialogService, NotificationService } from '@core/services';
import { Requerimiento_Integrante } from '@data/models/requerimiento/requerimiento.model';
//import * as XLSX from 'xlsx';

interface Tarea {
  item: number;
  tarea: string;
  estado: string;
  porcentaje: string;
}

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.scss']
})
export class UserTaskComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  // displayedColumns: string[] = ['item', 'descripcion','porcentaje','fecIni', 'fecFin','estado','acciones'];
  displayedColumns: string[] = ['item', 'requerimiento', 'estado', 'porcentaje', 'acciones'];
  idUsuario: number;
  nombreUsuario: string;

  // tareas: Tarea[] = [
  //   { item: 1, tarea: 'Nombre Tarea 1', estado: 'FINALIZADO', porcentaje: '100' },
  //   { item: 2, tarea: 'Nombre Tarea 2', estado: 'PENDIENTE', porcentaje: '50' },
  //   { item: 3, tarea: 'Nombre Tarea 3', estado: 'FINALIZADO', porcentaje: '100' },
  // ];

  // datosAsignados: Requerimiento_Integrante[] = [];

  reqAsignados = new Array;

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
    console.log(this.data.obj);
    // this.idUsuario = this.data.obj.id;
    // this.nombreUsuario = this.data.obj.colaborador;
    // this.cargarRequerimientos();
    // this.loadTable();
    // var workbook = XLSX.utils.book_new();
    // var worksheet = XLSX.utils.aoa_to_sheet([]);

    // for (let i = 0; i < this.datosAsignados.length; i++) {
    //   XLSX.utils.sheet_add_aoa(worksheet,[[this.datosAsignados[i].idReq,this.datosAsignados[i].nombreTarea,this.datosAsignados[i].avance]], { origin: `B${i+1}` })
    // }
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Prueba 1');
    // console.log(worksheet);
    // console.log(workbook);
    // XLSX.writeFile(workbook, "out.xlsx");
    this.loadTableReq(this.data.obj.idPersonal);
  }

  // cargarRequerimientos(){
  // this.datosAsignados = this.services.getFauxTablaRequeAsignados(this.data.obj.id);
  // for (let i = 0; i < this.datosAsignados.length; i++) {
  //   var requerimiento = this.services.getFauxRequerimiento(this.datosAsignados[i].idReq);
  //   this.reqAsignados.push({"idReq":requerimiento.id,
  //     "idColaborador": this.data.obj.id,
  //     "requerimiento":requerimiento.nombreRequerimiento,
  //     "estado":this.datosAsignados[i].estado,
  //     "porcentaje": this.datosAsignados[i].avance  
  // });
  // }
  // }

  loadTable() {
    this.services.ListarTareas(this.idUsuario).subscribe((dataItem) => {
      if (dataItem.codigo == 0) {
        this.dataSource = new MatTableDataSource(this.reqAsignados);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = null;
        if (dataItem.msj == "LISTA VACIA") {
          this._notification.warning(dataItem.msj)
        } else {
          this._notification.error(dataItem.msj)
        }
      }
    });
  }

  showDialogTaksUser() {
    const dialogRef: MatDialogRef<UserAddTaskComponent> = this.dialog.open(UserAddTaskComponent, {
      disableClose: false,
      width: '450px',
      //height: '780px',
      autoFocus: false,
      data: {
        auto: false,
        id: this.idUsuario
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogDownloadTask(element, id: number) {
    const dialogRef: MatDialogRef<UserDownloadTaskComponent> = this.dialog.open(UserDownloadTaskComponent, {
      disableClose: false,
      width: '70%',
      //height: '780px',
      autoFocus: false,
      data: {
        // obj: this.services.getFauxRequerimiento(this.datosAsignados[id].idReq),
        objAsignacion: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok') {
        this.loadTable()
      }
    });
  }

  finalizarTarea(element) {
    this._dialogService
      .openConfirm('¿Está seguro de aprobar la tarea?', element.tarea)
      .pipe(filter((isConfirmed) => isConfirmed))
      .subscribe(() => this.onSave());
  }

  onSave() {

  }

  loadTableReq(idPersonal: Number) {
    this.services.listarRequerimientosPorPersonal(idPersonal).subscribe((data: any) => {
      if (data) {
        this.reqAsignados = data;
        this.dataSource = new MatTableDataSource(this.reqAsignados);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = null;
        if (this.dataSource = null) {
          this._notification.warning("LISTA VACIA");
        }
        // if (dataItem.msj == "USTED NO SE ENCUENTRA ASGINADO EN UN EQUIPO DE TRABAJO") {
        //   this._notification.warning(dataItem.msj)
        // } else {
        //   this._notification.error(dataItem.msj)
        // }
      }
    });

  }

}
