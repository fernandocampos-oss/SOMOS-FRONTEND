import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { EvidenciaResponseDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

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
  
  constructor(
    private _fb: FormBuilder,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.form.controls.frmAnioElegido.setValue(this.today.getFullYear());

  }

  createForm() {
    this.form = this._fb.group({
      frmAnioElegido: [null],
    });
  }

  async generarReporte() {
  }

  async procesarExcel(element) {

  }

}
