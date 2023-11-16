import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, SnackbarService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'gestion-rendimiento-indicadores-finalizados-jefe',
  templateUrl: './indicadores-finalizados-jefe.component.html',
  styleUrls: ['./indicadores-finalizados-jefe.component.scss']
})
export class IndicadoresFinalizadosJefeComponent implements OnInit {
  listDataFinalizados: any[] = [];

  @ViewChild(MatSort) sort_finalizado: MatSort;
  @ViewChild(MatPaginator) paginator_finalizado: MatPaginator;
  dataSource_finalizado: MatTableDataSource<any>;
  displayedColumns_finalizado: string[] = ['item', 'indicador_producto', 'descripcion', 'fecha_creacion', 'tipo_ingreso', 'tipo_valor_meta', 'valor_meta'];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.loadTableFinalizado();
  }

  async actualizarindicadoresRechazados() {
    this.listDataFinalizados = [];
    let finalizados = await this.loadTableFinalizado();
    this._snackbar.success("La lista ya se encuentra actualizada");
  }

  async loadTableFinalizado() {
    let listFinalizado = await this._requerimientoService.listarIndicadorFinalizado().then((data) => {
      if (data.length > 0) {
        this.listDataFinalizados = data;
        this.dataSource_finalizado = new MatTableDataSource(this.listDataFinalizados);
        this.dataSource_finalizado.paginator = this.paginator_finalizado;
        this.dataSource_finalizado.sort = this.sort_finalizado;
      }
    });
  }

  exportToExcelGR(){
    
  }

}
