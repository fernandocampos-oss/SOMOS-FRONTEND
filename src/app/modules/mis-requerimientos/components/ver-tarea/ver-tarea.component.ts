import { element } from 'protractor';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EdicionEvidenciaComponent } from './edicion-evidencia/edicion-evidencia.component';
import { TareaResponse } from '@data/models/gestion-rendimiento/tarea-model';
import { ListEvidenciaComponent } from './list-evidencia/list-evidencia.component';

@Component({
  selector: 'app-ver-tarea',
  templateUrl: './ver-tarea.component.html',
  styleUrls: ['./ver-tarea.component.scss']
})
export class VerTareaComponent implements OnInit {

  form: FormGroup;
  requerimiento: string = '';
  idRequerimiento: number = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'nombre_tarea', 'fecha_asignacion', 'plazo', 'acciones'];

  dataSource_tarea: TareaResponse[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.requerimiento = this.data.model.requerimiento.nombre;
    this.idRequerimiento = this.data.model.requerimiento.idRequerimiento;
    this.createForm();
    this.dataSource_tarea = this.data.model.listTarea;
  }

  createForm() {
    this.form = this._fb.group({
      frmDescripcion: [this.data.model.requerimiento.descripcion],
      frmTipoIngreso: [this.data.model.requerimiento.tipoIngreso.descripcion],
      frmporcentajeAvance: [this.data.model.requerimiento.porcentajeAvance + '%'],
      // frmAreaDestinatario: [this.data.model.codUnidadReceptor],
      // frmEstado: [this.data.model.estadoRequerimiento.descripcion],
      frmMotivo: [this.data.model.motivo],
    });
  }

  registrarEvidencia(element) {
    const dialogRef: MatDialogRef<EdicionEvidenciaComponent> = this._matDialog.open(EdicionEvidenciaComponent, {
      disableClose: false,
      width: '500px',
      //height: '780px',
      autoFocus: true,
      data: {
        idRequerimiento: this.idRequerimiento,
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTablePendiente();
    });
  }

  listarEvidencias(element) {
    const dialogRef: MatDialogRef<ListEvidenciaComponent> = this._matDialog.open(ListEvidenciaComponent, {
      disableClose: false,
      width: '50%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTablePendiente();
    });
  }

}
