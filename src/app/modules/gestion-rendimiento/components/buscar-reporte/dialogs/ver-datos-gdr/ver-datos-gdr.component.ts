import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, SnackbarService } from '@core/services';
import { ExcelTrabajadorService } from '@data/services/gestion-rendimiento/excel-trabajador.service';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { AsignarEvidenciaComponent } from '@modules/gestion-rendimiento/components/gestionar-indicadores-trabajador/dialogs/asignar-evidencia/asignar-evidencia.component';
import { AsignarIndicadorComponent } from '@modules/gestion-rendimiento/components/gestionar-indicadores-trabajador/dialogs/asignar-indicador/asignar-indicador.component';
import { EditMasterComponent } from '@modules/gestion-rendimiento/components/gestionar-indicadores-trabajador/dialogs/edit-master/edit-master.component';

@Component({
  selector: 'app-ver-datos-gdr',
  templateUrl: './ver-datos-gdr.component.html',
  styleUrls: ['./ver-datos-gdr.component.scss']
})
export class VerDatosGdrComponent implements OnInit {
  listIndicadoresAdmin: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'valor_meta', 'peso', 'evidencia', 'plazo', 'tipo_formula', 'logro_final', 'puntuacion_meta', 'fecha_asignacion'];
  groupedColumns: string[] = ['grouped'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
    private _serviceExcelEjecutor: ExcelTrabajadorService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.loadTableAdmin();
  }

  async loadTableAdmin() {
    let listPendiente = await this._grService.listPendientesTrabajadorByVotanteAdmin(this.data.modal.idVotante).then((data) => {
      if (data.length > 0) {
        this.listIndicadoresAdmin = data;
        console.log(this.listIndicadoresAdmin )
        this.dataSource = new MatTableDataSource(this.listIndicadoresAdmin);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  editarEvidencia(element) {
    const dialogRef: MatDialogRef<EditMasterComponent> = this._dialog.open(EditMasterComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTableAdmin();
    });
  }

  agregarIndicador(element, idVotante, i) {
    const dialogRef: MatDialogRef<AsignarIndicadorComponent> = this._dialog.open(AsignarIndicadorComponent, {
      disableClose: true,
      width: '50%',
      maxHeight: '810px',
      //height: '780px',
      autoFocus: false,
      data: {
        prioridadSelected: element,
        idVotante: this.data.modal.idVotante,
        trabajador: i
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTableAdmin();
    });
  }

  agregarEvidencia(i) {
    const dialogRef: MatDialogRef<AsignarEvidenciaComponent> = this._dialog.open(AsignarEvidenciaComponent, {
      disableClose: true,
      width: '50%',
      maxHeight: '810px',
      //height: '780px',
      autoFocus: false,
      data: {
        element: i
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadTableAdmin();
    });

  }

}
