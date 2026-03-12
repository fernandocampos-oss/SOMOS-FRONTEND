import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '@data/services/material.service';
import { MatTable } from '@angular/material/table';
import { MaestroMaterial } from '@data/models/material/maestro-material.model';
import { StockMaterial } from '@data/models/material/stock-material.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {

  nombreMaterial: string;
  codigoMaterial: string;
  codigoRed: string;

  @ViewChild('tablaMaestroMaterial') tablaMaestroMaterial: MatTable<any>;
  listMaestroMaterial: MaestroMaterial[] = [];
  displayedColumnsMaestroMaterial: string[] = ['codigoMaterial', 'nombreMaterial'];
  busquedaResultadoMaestro = '';

  @ViewChild('tablaStockMaterial') tablaStockMaterial: MatTable<any>;
  listStockMaterial: StockMaterial[] = [];
  displayedColumnsStockMaterial: string[] = ['codigoRed', 'nombreRed', 'codigoCentro', 'nombreCentro', 'codigoMaterial', 'nombreMaterial', 'medidaMaterial', 'cantidadMaterial'];
  busquedaResultadoStock = '';

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private materialService: MaterialService
  ) { }

  ngOnInit(): void {
  }

  buscarMaestroMaterial() {
    if (this.nombreMaterial == null) {
      this.nombreMaterial = '';
    }
    if (this.nombreMaterial.trim() === '') {
      return;
    }
    this.materialService.buscarMaestroMaterial(this.nombreMaterial.trim()).subscribe(data => {
      this.listMaestroMaterial = data;
      this.busquedaResultadoMaestro = `Se encontraron ${data.length} resultados para "${this.nombreMaterial.trim()}"`;
    });
  }

  obtenerStockMaterial(codigoMaterial: string) {
    this.codigoMaterial = codigoMaterial;
    this.buscarStockMaterial();
  }

  buscarStockMaterial() {
    if (this.codigoMaterial == null) {
      this.codigoMaterial = '';
    }
    if (this.codigoRed == null) {
      this.codigoRed = '';
    }
    if (this.codigoMaterial.trim() === '' && this.codigoRed.trim() === '') {
      return;
    }
    this.materialService.buscarStockMaterial(this.codigoMaterial.trim(), this.codigoRed.trim()).subscribe(data => {
      this.listStockMaterial = data;
      this.busquedaResultadoStock = `Se encontraron ${data.length} resultados para "${this.codigoMaterial.trim()}" y "${this.codigoRed.trim()}"`;
    });
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }

  exportarExcel() {
    const data = this.listStockMaterial.map(item => ({
      'Código de red': item.codigoRed,
      'Nombre de red': item.nombreRed,
      'Código de almacén': item.codigoCentro,
      'Nombre de almacén': item.nombreCentro,
      'Código de material': item.codigoMaterial,
      'Nombre de material': item.nombreMaterial,
      'Medida de material': item.medidaMaterial,
      'Cantidad de material': this.toNumber(item.cantidadMaterial)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { StockMaterial: worksheet },
      SheetNames: ['StockMaterial']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    FileSaver.saveAs(blob, 'stock_material.xlsx');
  }

  toNumber(valor: any): number {
    if (!valor) { return 0; }
    return Number(valor.toString().replace(/,/g, ''));
  }

}
