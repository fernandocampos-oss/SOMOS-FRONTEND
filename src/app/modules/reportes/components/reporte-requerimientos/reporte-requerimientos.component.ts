import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { EvidenciaResponseDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';

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
  evidenciaResponseDto: EvidenciaResponseDto;

  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // dataSource: MatTableDataSource<any>;
  // displayedColumns: string[] = ['item', 'requerimiento', 'fecha_asignacion', 'tipo_ingreso', 'avance', 'estado', 'acciones'];

  constructor(
    private _fb: FormBuilder,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
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
    // let result = await this._requerimientoService.reporteGeneralRequerimientos(this.form.value.frmAnioElegido).then((data) => {
    //   if (data.length > 0) {
    //     this.listData = data;
    //     console.log("data", this.listData.length)
    //     for (let i of this.listData) {
    //       this.procesarExcel(i);
    //     }
    //   } else {
    //     this._notification.warning("No se encontró requerimientos finalizados para el año " + this.form.value.frmAnioElegido);
    //   }
    // });
  }

  async procesarExcel(element) {

  }

}
