import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '@data/services/material.service';
import { MatTable } from '@angular/material/table';
import { MaestroMaterial } from '@data/models/material/maestro-material.model';
import { StockMaterial } from '@data/models/material/stock-material.model';

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

}
