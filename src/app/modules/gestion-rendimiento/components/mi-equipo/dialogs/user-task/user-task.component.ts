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
import { ReporteEvidencia, ReportePersonal } from '@data/models/gestion-rendimiento/reporte-finalizados';
import { EvidenciaResponseDTO } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { ExportExcelGestionRendimientoService } from '@data/services/export-excel-gestion-rendimiento.service';
//import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.scss']
})
export class UserTaskComponent implements OnInit {
  evidenciaDTO: EvidenciaResponseDTO;

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
    public _serviceExcel: ExportExcelGestionRendimientoService,
  ) { }

  ngOnInit(): void {
    // console.log(this.data);
    this.loadTableRequerimiento(this.data.model.integrante.idUsuario);
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

  finalizarTarea(element) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de finalizar el requerimiento?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.services.finalizarTareaAdministrador(element.idRequerimientoUsuario).subscribe(() => {
          this._notification.success('Requerimiento finalizado correctamente');
          this.loadTableRequerimiento(this.data.model.integrante.idUsuario);
        });
      }
      this.confirmDialogRef == null;
    });
  }

  onSave() {
  }

  async loadTableRequerimiento(idUsuario: Number) {
    let load = await this.services.listarRequerimientosPorPersonal(idUsuario).then((data: any) => {
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = null;
        this._notification.warning("El integrante no cuenta con requerimientos");
      }
    });
  }

  async exportToExcel(element) {
    console.log("element", element)
    if (element.idRequerimientoUsuario > 0) {
      let reportePersonal = new ReportePersonal();
      reportePersonal.apellidos = element.usuario.apellidos;
      reportePersonal.nombres = element.usuario.nombres;
      reportePersonal.cargo = element.usuario.cargo;

      let listTarea: ReporteEvidencia[] = [];
      for (let i of element.listTarea) {
        let obj = new ReporteEvidencia();
        obj.nombreTarea = i.nombreTarea;
        obj.requerimientoDescripcion = element.requerimiento.nombre;
        obj.poi = element.poi.descripcion;
        obj.indicador = element.poi.indicador.descripcion;

        let a = await this.services.getEvidenciaPorTarea(i.idTarea).then((data: any) => {
          if (data != null) {
            this.evidenciaDTO = data;
            console.log("dto:", data);
          } else {
            this.evidenciaDTO = null;
          }
        });

        //comparar fechas para el comentario en excel
        let fechaISOPlazo = i.plazo.split("T");
        let fechaPlazo = fechaISOPlazo[0];

        if (this.evidenciaDTO.idEvidencia > 0) {
          let fechaISOEvidencia = this.evidenciaDTO.fechaCreacion.split("T");
          let fechaEvidencia = fechaISOEvidencia[0];

          console.log("fechaPlazo: ", fechaPlazo);
          console.log("fechaEvidencia: ", fechaEvidencia)

          var first = new Date(fechaPlazo);
          var second = new Date(fechaEvidencia);

          if (first < second) {
            console.log(first, "es menor que", second);
            obj.comentario = 'Se pasó de la fecha';
          }
          else if (first > second) {
            console.log(first, "es mayor que", second);
            obj.comentario = 'Presentó evidencia dentro de la fecha';
          }
          else if (first == second) {
            console.log(first, "es igual que", second);
            obj.comentario = 'Presentó evidencia dentro de la fecha';
          }
          obj.descripcionEvidencia = this.evidenciaDTO.descripcion;
          obj.porcentajeAvanceEvidencia = this.evidenciaDTO.porcentajeAvance;
          obj.plazoTarea = fechaPlazo;
          listTarea.push(obj);
          obj = null;
          reportePersonal.estadoEntregado = "Entregado";

        } else {
          this._notification.warning("No se encontró evidencia para la tarea: " + i.nombreTarea);

          let obj = new ReporteEvidencia();
          obj.nombreTarea = i.nombreTarea;
          obj.requerimientoDescripcion = element.requerimiento.nombre;
          obj.poi = element.poi.descripcion;
          obj.plazoTarea = fechaPlazo;
          obj.porcentajeAvanceEvidencia = 0;
          obj.comentario = 'No presentó evidencia';
          listTarea.push(obj);
          obj = null;
        }

      }
      console.log("data excel", listTarea)
      let columnsName = ["String_1", "String_2"];
      let reportData = {
        data_personal: reportePersonal,
        data_evidencia: listTarea,
        headers: columnsName,
      };
      this._serviceExcel.exportExcel(reportData);
    }
  }

}
