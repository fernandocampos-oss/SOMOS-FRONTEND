import { GestionRendimientoExcelEjecutorService } from './../../../data/services/gestion-rendimiento-excel-ejecutor.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, SnackbarService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { ModalTareaComponent } from '../components/modal-tarea/modal-tarea.component';
import { Persona, RowsBody } from '@data/models/gestion-rendimiento/excel-model';

@Component({
  selector: 'app-indicadores-trabajador',
  templateUrl: './indicadores-trabajador.component.html',
  styleUrls: ['./indicadores-trabajador.component.scss']
})
export class IndicadoresTrabajadorComponent implements OnInit {
  listDataFinalizados: any[] = [];
  listIndicadoresPendientes: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'valor_meta', 'peso', 'evidencia', 'plazo', 'tipo_formula', 'logro_final', 'puntuacion_meta', 'fecha_asignacion', 'acciones'];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
    public _serviceExcelEjecutor: GestionRendimientoExcelEjecutorService,
    private _snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.loadTablePendiente();
  }

  async loadTablePendiente() {
    let listPendiente = await this._requerimientoService.listarIndicadorPendiente().then((data) => {
      if (data.length > 0) {
        this.listIndicadoresPendientes = data;
        console.log(this.listIndicadoresPendientes);
        this.dataSource = new MatTableDataSource(this.listIndicadoresPendientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  async actualizarIndicadoresPendientes() {
    this.listIndicadoresPendientes = [];
    let pendientes = await this.loadTablePendiente();
    this._snackbar.success("La lista ya se encuentra actualizada");
  }

  verDetalleIndicadorYtareas(element) {
    console.log(element)
    const dialogRef: MatDialogRef<ModalTareaComponent> = this._matDialog.open(ModalTareaComponent, {
      disableClose: false,
      width: '60%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element,
        // auto: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTablePendiente();
    });
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  async generarExcelEjecutor() {
    console.log("data", this.listIndicadoresPendientes)
    if (this.listIndicadoresPendientes.length > 0) {
      let trabajador = new Persona();
      trabajador.nombre = this.listIndicadoresPendientes[0].usuario.apellidos + "" + this.listIndicadoresPendientes[0].usuario.nombres;
      trabajador.cargo = this.listIndicadoresPendientes[0].usuario.cargo;
      trabajador.segmento = "";
      trabajador.codUnidad = "";
      trabajador.numeroDocumento = "";

      let listRows: RowsBody[] = [];
      for (let i of this.listIndicadoresPendientes) {
        let rowsBody = new RowsBody();
        rowsBody.prioridad = "";
        rowsBody.indicador = i.nombre;
        rowsBody.valorMeta = i.valorMeta;
        rowsBody.peso = i.peso;

        listRows.push(rowsBody);
        rowsBody = null;
      }

      // if (i.listTarea.length > 0) {
      //   for (let t of i.listTarea) {
      //     if (t.evidenciaFechaRegistro !== null) { //evidencia registrada?
      //       //iterativo
      //       rowsBody.nombre = t.nombre;
      //       let fechaPlazo = t.plazo.split("T")[0];
      //       rowsBody.plazo = fechaPlazo;

      //       let fechaEvidencia = t.evidenciaFechaRegistro.split("T")[0];
      //       console.log("fechaPlazo: ", fechaPlazo, " fechaEvidencia: ", fechaEvidencia);

      //       var first = new Date(fechaPlazo);
      //       var second = new Date(fechaEvidencia);

      //       //comparar fechas para evaluacionComentario
      //       if (first < second) {
      //         console.log(first, "es menor que", second);
      //         rowsBody.evaluacionComentario = 'Se pasó de la fecha';
      //       }
      //       else if (first > second) {
      //         console.log(first, "es mayor que", second);
      //         rowsBody.evaluacionComentario = 'Presentó evidencia dentro de la fecha';
      //       }
      //       else if (first == second) {
      //         console.log(first, "es igual que", second);
      //         rowsBody.evaluacionComentario = 'Presentó evidencia dentro de la fecha';
      //       }
      //       listRows.push(rowsBody);
      //       rowsBody = null;
      //       // reportePersonal.estadoEntregado = "Entregado";
      //     } else {
      //       console.log("La tarea " + t.idTarea + " no tiene evidencia registrada");
      //       let rowsBody = new RowsBody();
      //       rowsBody.actividad = i.actividad.descripcion;
      //       rowsBody.indicador = i.indicador.nombre;
      //       rowsBody.valorMeta = i.indicador.valorMeta;
      //       //iterativo
      //       rowsBody.pesoFraccion = t.pesoFraccion;
      //       rowsBody.nombre = t.nombre;
      //       rowsBody.plazo = t.plazo.split("T")[0];
      //       rowsBody.evaluacionComentario = 'No presentó evidencia';
      //       listRows.push(rowsBody);
      //       rowsBody = null;
      //     }
      //   }
      // } else {
      //   console.log("El indicador no cuenta con tareas");
      //   let rowsBody = new RowsBody();
      //   if (i.actividad != null) {
      //     rowsBody.actividad = i.actividad.descripcion;
      //   } else {
      //     rowsBody.actividad = '-'
      //   }
      //   rowsBody.indicador = i.indicador.nombre;
      //   rowsBody.valorMeta = i.indicador.valorMeta;
      //   rowsBody.evaluacionComentario = 'No tiene tareas asignadas';
      //   listRows.push(rowsBody);
      //   rowsBody = null;
      // }

      console.log("data excel", listRows);
      let columnsName = ["String_1", "String_2"];
      let reportData = {
        data_trabajador: trabajador,
        data_evidencia: listRows,
        headers: columnsName,
      };
      let listFinalizado = await this._serviceExcelEjecutor.exportExcelEjecutor(reportData);
    }
  }

}
