import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services';
import { EvidenciaResponseDTO } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { ReporteEvidencia, ReportePersonal } from '@data/models/gestion-rendimiento/reporte-finalizados';
import { ExportExcelGestionRendimientoService } from '@data/services/export-excel-gestion-rendimiento.service';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { RequerimientoRegisterUpdateComponent } from '@modules/mis-requerimientos/components/requerimiento-register-update/requerimiento-register-update.component';
import { VerTareaComponent } from '@modules/mis-requerimientos/components/ver-tarea/ver-tarea.component';

@Component({
  selector: 'app-jefe-requirement',
  templateUrl: './jefe-requirement.component.html',
  styleUrls: ['./jefe-requirement.component.scss']
})
export class JefeRequirementComponent implements OnInit {
  evidenciaDTO: EvidenciaResponseDTO;
  listEvidencia: any[] = [];
  listDataRechazados: any[] = [];
  listDataFinalizados: any[] = [];
  listDataPendientes: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'requerimiento', 'fecha_asignacion', 'tipo_ingreso', 'avance', 'estado', 'acciones'];

  @ViewChild(MatSort) sort_finalizado: MatSort;
  @ViewChild(MatPaginator) paginator_finalizado: MatPaginator;
  dataSource_finalizado: MatTableDataSource<any>;
  displayedColumns_finalizado: string[] = ['item', 'identificador', 'requerimiento', 'fecha_asignacion', 'tipo_ingreso', 'avance', 'acciones'];

  @ViewChild(MatSort) sort_rechazado: MatSort;
  @ViewChild(MatPaginator) paginator_rechazado: MatPaginator;
  dataSource_rechazado: MatTableDataSource<any>;
  displayedColumns_rechazado: string[] = ['item', 'identificador', 'requerimiento', 'fecha_asignacion', 'tipo_ingreso', 'motivo'];

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
    this.loadTableFinalizado();
    // this.loadTableRechazado();
  }

  async loadTablePendiente() {
    let listPendiente = await this._requerimientoService.listarRequerimientoPendiente().then((data) => {
      if (data.length > 0) {
        this.listDataPendientes = data;
        this.dataSource = new MatTableDataSource(this.listDataPendientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  async loadTableFinalizado() {
    let listFinalizado = await this._requerimientoService.listarRequerimientoFinalizado().then((data) => {
      if (data.length > 0) {
        this.listDataFinalizados = data;
        this.dataSource_finalizado = new MatTableDataSource(this.listDataFinalizados);
        this.dataSource_finalizado.paginator = this.paginator_finalizado;
        this.dataSource_finalizado.sort = this.sort_finalizado;
      }
    });
  }

  // async loadTableRechazado() {
  //   let listRechazado = await this._requerimientoService.listarRequerimientoRechazado().then((data) => {
  //     if (data.length > 0) {
  //       this.listDataRechazados = data;
  //       this.dataSource_rechazado = new MatTableDataSource(this.listDataRechazados);
  //       this.dataSource_rechazado.paginator = this.paginator_rechazado;
  //       this.dataSource_rechazado.sort = this.sort_rechazado;
  //     }
  //   });
  // }

  verDetalleRequerimiento(element) {
    const dialogRef: MatDialogRef<VerTareaComponent> = this._matDialog.open(VerTareaComponent, {
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
      this.loadTableFinalizado();
      // this.loadTableRechazado();
    });
  }

  editarRequerimiento(element, es_editar) {
    const dialogRef: MatDialogRef<RequerimientoRegisterUpdateComponent> = this._matDialog.open(RequerimientoRegisterUpdateComponent, {
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
      this.loadTableFinalizado();
      // this.loadTableRechazado();
    });
  }

  nuevoRequerimientoJefe() {
    const dialogRef: MatDialogRef<RequerimientoRegisterUpdateComponent> = this._matDialog.open(RequerimientoRegisterUpdateComponent, {
      disableClose: false,
      width: '50%',
      //height: '780px',
      autoFocus: false,
      data: {
        esJefe: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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
