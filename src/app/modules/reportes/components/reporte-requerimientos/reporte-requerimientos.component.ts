import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { ReporteEvidencia, ReportePersonal } from '@data/models/gestion-rendimiento/reporte-finalizados';
import { EvidenciaResponseDTO } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { ExportExcelGestionRendimientoService } from '@data/services/export-excel-gestion-rendimiento.service';

interface Año {
  anio: number;
}

@Component({
  selector: 'reportes-reporte-requerimientos',
  templateUrl: './reporte-requerimientos.component.html',
  styleUrls: ['./reporte-requerimientos.component.scss']
})
export class ReporteRequerimientosComponent implements OnInit {
  form: FormGroup;
  today = new Date();
  anios: Año[] = [
    { anio: 2023 },
    { anio: 2024 },
  ];
  anioElegido: number;
  listData: any[] = [];
  evidenciaDTO: EvidenciaResponseDTO;

  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // dataSource: MatTableDataSource<any>;
  // displayedColumns: string[] = ['item', 'requerimiento', 'fecha_asignacion', 'tipo_ingreso', 'avance', 'estado', 'acciones'];

  constructor(
    private _fb: FormBuilder,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
    public _serviceExcel: ExportExcelGestionRendimientoService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    // this.form.controls.frmMesElegido.setValue(this.today.getMonth()+1);
    this.form.controls.frmAnioElegido.setValue(this.today.getFullYear());

  }

  createForm() {
    this.form = this._fb.group({
      // frmMesElegido: [null],
      frmAnioElegido: [null],
    });
  }

  async generarReporte() {
    let result = await this._requerimientoService.reporteGeneralRequerimientos(this.form.value.frmAnioElegido).then((data) => {
      if (data.length > 0) {
        this.listData = data;
        console.log("data", this.listData.length)
        for (let i of this.listData) {
          this.procesarExcel(i);
        }
        // this.dataSource = new MatTableDataSource(this.listData);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      } else {
        this._notification.warning("No se encontró requerimientos finalizados para el año " + this.form.value.frmAnioElegido);
      }
    });
  }

  async procesarExcel(element) {
    console.log(">>>i ", element)

    //proceso principal
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
        reportePersonal.estadoEntregado = "Entregado";

        //exporta 1
        console.log("data excel", listTarea)
        let columnsName = ["String_1", "String_2"];
        let reportData = {
          data_personal: reportePersonal,
          data_evidencia: listTarea,
          headers: columnsName,
        };
        this._serviceExcel.exportExcel(reportData);

      } else {
        // console.log("No se encontró evidencia para la tarea: " + i.nombreTarea);
        let obj = new ReporteEvidencia();
        obj.nombreTarea = i.nombreTarea;
        obj.requerimientoDescripcion = element.requerimiento.nombre;
        obj.poi = element.poi.descripcion;
        obj.plazoTarea = fechaPlazo;
        obj.porcentajeAvanceEvidencia = 0;
        obj.comentario = 'No presentó evidencia';
        listTarea.push(obj);
        obj = null;

        //exporta 2 null
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

}
