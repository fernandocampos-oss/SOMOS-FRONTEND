import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services';
import { EvidenciaResponseDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { ExportExcelGestionRendimientoService } from '@data/services/export-excel-gestion-rendimiento.service';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { ReporteEvidencia, ReportePersonal } from '@data/models/gestion-rendimiento/reporte-finalizados';
import { RegistrarIndicadorJefeComponent } from './dialogs/registrar-indicador-jefe/registrar-indicador-jefe.component';
import { ModalTareaComponent } from '@modules/indicadores-trabajador/components/modal-tarea/modal-tarea.component';

@Component({
  selector: 'gestion-rendimiento-indicadores-pendientes-jefe',
  templateUrl: './indicadores-pendientes-jefe.component.html',
  styleUrls: ['./indicadores-pendientes-jefe.component.scss']
})
export class IndicadoresPendientesJefeComponent implements OnInit {
  evidenciaResponseDto: EvidenciaResponseDto;
  listEvidencia: any[] = [];
  listDataPendientes: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'indicador_producto', 'fecha_asignacion', 'tipo_ingreso', 'tipo_valor_meta', 'valor_meta', 'estado', 'acciones'];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
    public _serviceExcel: ExportExcelGestionRendimientoService,
  ) { }

  ngOnInit(): void {
    this.loadTablePendiente();
  }

  async loadTablePendiente() {
    let listPendiente = await this._requerimientoService.listarIndicadorPendiente().then((data) => {
      if (data.length > 0) {
        this.listDataPendientes = data;
        this.dataSource = new MatTableDataSource(this.listDataPendientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  verDetalleRequerimiento(element) {
    const dialogRef: MatDialogRef<ModalTareaComponent> = this._matDialog.open(ModalTareaComponent, {
      disableClose: false,
      width: '60%',
      //height: '780px',
      autoFocus: true,
      data: {
        // auto: true,
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
    });
  }

  editarRequerimiento(element, es_editar) {
    const dialogRef: MatDialogRef<RegistrarIndicadorJefeComponent> = this._matDialog.open(RegistrarIndicadorJefeComponent, {
      disableClose: false,
      width: '600px',
      //height: '780px',
      autoFocus: false,
      data: {
        esEditar: es_editar,
        esJefe: false,
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
    });
  }

  registrarIndicadorJefe() {
    const dialogRef: MatDialogRef<RegistrarIndicadorJefeComponent> = this._matDialog.open(RegistrarIndicadorJefeComponent, {
      disableClose: false,
      width: '50%',
      //height: '780px',
      autoFocus: false,
      data: {
        esJefe: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
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

        let a = await this._requerimientoService.getEvidenciaPorTarea(i.idTarea).then((data: any) => {
          if (data != null) {
            this.evidenciaResponseDto = data;
            console.log("dto:", data);
          } else {
            this.evidenciaResponseDto = null;
          }
        });

        //comparar fechas para el comentario en excel
        let fechaISOPlazo = i.plazo.split("T");
        let fechaPlazo = fechaISOPlazo[0];

        if (this.evidenciaResponseDto.evidenciaFechaRegistro != '') {
          let fechaISOEvidencia = this.evidenciaResponseDto.evidenciaFechaRegistro.split("T");
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

          obj.descripcionEvidencia = this.evidenciaResponseDto.evidenciaDescripcion;
          // obj.porcentajeAvanceEvidencia = this.evidenciaResponseDto.porcentajeAvance;
          obj.plazoTarea = fechaPlazo;
          listTarea.push(obj);
          obj = null;

        } else {
          // this._notification.warning("No se encontró evidencia para la tarea: " + i.nombreTarea);
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
