import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, SnackbarService } from '@core/services';
import { EvidenciaResponseDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
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
  displayedColumns: string[] = ['item', 'indicador_producto', 'descripcion', 'fecha_creacion', 'tipo_ingreso', 'tipo_valor_meta', 'valor_meta', 'acciones'];

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.loadTablePendiente();
  }

  async actualizarIndicadoresPendientes() {
    this.listDataPendientes = [];
    let pendientes = await this.loadTablePendiente();
    this._snackbar.success("La lista ya se encuentra actualizada");
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

  verDetalleIndicadorYtareas(element) {
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

  editarIndicadorJefe(element, es_editar) {
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

  async exportToExcelGR(element) {
   
  }
 
}
