import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequerimientoRegisterUpdateComponent } from '../components/requerimiento-register-update/requerimiento-register-update.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VerTareaComponent } from '../components/ver-tarea/ver-tarea.component';
import { ExportExcelGestionRendimientoService } from '@data/services/export-excel-gestion-rendimiento.service';
import { ReporteEvidencia, ReportePersonal } from '@data/models/gestion-rendimiento/reporte-finalizados';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mis-requerimientos',
  templateUrl: './mis-requerimientos.component.html',
  styleUrls: ['./mis-requerimientos.component.scss']
})
export class MisRequerimientosComponent implements OnInit {
  listEvidencia: any[] = [];
  listDataRechazados: any[] = [];
  listDataFinalizados: any[] = [];
  listDataPendientes: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'identificador', 'requerimiento', 'fecha_asignacion', 'tipo_ingreso', 'avance', 'estado', 'acciones'];

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
    this.loadTableRechazado();
  }

  registrarRequerimiento() {
    const dialogRef: MatDialogRef<RequerimientoRegisterUpdateComponent> = this._matDialog.open(RequerimientoRegisterUpdateComponent, {
      disableClose: false,
      width: '50%',
      //height: '780px',
      autoFocus: false,
      data: {
        esJefe: false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
      this.loadTableFinalizado();
      this.loadTableRechazado();
    });

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
        this.dataSource.paginator = this.paginator_finalizado;
        this.dataSource.sort = this.sort_finalizado;
      }
    });
  }

  async loadTableRechazado() {
    let listRechazado = await this._requerimientoService.listarRequerimientoRechazado().then((data) => {
      if (data.length > 0) {
        this.listDataRechazados = data;
        this.dataSource_rechazado = new MatTableDataSource(this.listDataRechazados);
        this.dataSource.paginator = this.paginator_rechazado;
        this.dataSource.sort = this.sort_rechazado;
      }
    });
  }

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
      this.loadTableRechazado();
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
      this.loadTableRechazado();
    });

  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  async exportToExcel(element) {
    console.log("#####", element)
    if (element.idRequerimientoUsuario > 0) {

      let reportePersonal = new ReportePersonal();
      reportePersonal.apellidos = element.usuario.apellidos;
      reportePersonal.nombres = element.usuario.nombres;
      reportePersonal.cargo = element.usuario.cargo;

      let listTarea: ReporteEvidencia[] = [];
      for (let i of element.listTarea) {
        let obj = new ReporteEvidencia();
        obj.nombreTarea = i.nombreTarea;
        obj.plazoTarea = i.plazo;

        obj.poi = element.poi.descripcion;
        obj.indicador = element.poi.indicador.descripcion;

        let a = await this._requerimientoService.getListarEvidenciasTarea(i.idTarea).then((data: any) => {
          if (data.length > 0) {
            this.listEvidencia = data;
          } else {
            this._notification.warning("Error al obtener evidencias");
          }
        });

        for (let j of this.listEvidencia) {
          obj.descripcionEvidencia = j.descripcion;
          obj.porcentajeAvanceEvidencia = j.porcentajeAvance;
        }

        listTarea.push(obj);
        obj = null;
      }

      console.log("obj", listTarea)
      let columnsName = ["SERVIDOR/A EVALUADO/A", "SERVIDOR/A EVALUADOR/A"];
      let reportData = {
        data_personal: reportePersonal,
        data_evidencia: listTarea,
        headers: columnsName,
      };
      this._serviceExcel.exportExcel(reportData);
    }
  }



}
