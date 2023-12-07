import { startWith, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VerDatosGdrComponent } from './dialogs/ver-datos-gdr/ver-datos-gdr.component';

@Component({
  selector: 'app-buscar-reporte',
  templateUrl: './buscar-reporte.component.html',
  styleUrls: ['./buscar-reporte.component.scss']
})
export class BuscarReporteComponent implements OnInit {

  formFindSelect = this._formBuilder.group({
    frmNombre: ['', Validators.required],
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'numero_documento', 'nombre_completo', 'acciones'];

  listVotantes: any[] = [];

  constructor(
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    
  }

  async buscarVotante() {
    // console.log(this.formFindSelect.value.frmNombre.toUpperCase());
    let getVotante = await this._grService.findVotanteByNombre(this.formFindSelect.value.frmNombre.toUpperCase()).then((data) => {
      if (data != null) {
        this.listVotantes = data;
        this.dataSource = new MatTableDataSource(this.listVotantes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
    });
  }

  async verDatosGDR(element: any) {
    const dialogRef: MatDialogRef<VerDatosGdrComponent> = this._dialog.open(VerDatosGdrComponent, {
      disableClose: false,
      width: '80%',
      maxHeight: '80vh',
      autoFocus: false,
      data: {
        modal: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTable();
    });
  }

}
