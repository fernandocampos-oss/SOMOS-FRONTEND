import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistrarEvidenciaTrabajadorComponent } from './registrar-evidencia-trabajador/registrar-evidencia-trabajador.component';
import { VerEvidenciaImagenComponent } from './ver-evidencia-imagen/ver-evidencia-imagen.component';
import { VerEvidenciaPdfComponent } from './ver-evidencia-pdf/ver-evidencia-pdf.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { EvidenciaResponse } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';

@Component({
  selector: 'app-modal-tarea',
  templateUrl: './modal-tarea.component.html',
  styleUrls: ['./modal-tarea.component.scss']
})
export class ModalTareaComponent implements OnInit {
  form: FormGroup;
  // requerimiento: string = '';
  idRequerimiento: number = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'nombre_tarea', 'fecha_asignacion', 'plazo', 'acciones'];

  dataSource_tarea: EvidenciaResponse[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _matDialog: MatDialog,
    private _grService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.idRequerimiento = this.data.model.idIndicador;
    // this.createForm();
    this.loadTable();
  }

  async loadTable() {
    let listFinalizado = await this._grService.getTareasByIdIndicador(this.data.model.idIndicador).then((data) => {
      if (data.length > 0) {
        this.dataSource_tarea = data;
        console.log("tareas", this.dataSource_tarea)
      }
    });
  }

  // createForm() {
  //   this.form = this._fb.group({
  //     frmDescripcion: [this.data.model.requerimiento.descripcion],
  //     frmTipoIngreso: [this.data.model.requerimiento.tipoIngreso.descripcion],
  //     frmporcentajeAvance: [this.data.model.requerimiento.porcentajeAvance + '%'],
  //     frmMotivo: [this.data.model.motivo],
  //   });
  // }

  registrarEvidencia(element) {
    const dialogRef: MatDialogRef<RegistrarEvidenciaTrabajadorComponent> = this._matDialog.open(RegistrarEvidenciaTrabajadorComponent, {
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

  verImagenEvidencia(element) {
    const dialogRef: MatDialogRef<VerEvidenciaImagenComponent> = this._matDialog.open(VerEvidenciaImagenComponent, {
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

  verEvidenciaPdf(element) {
    const dialogRef: MatDialogRef<VerEvidenciaPdfComponent> = this._matDialog.open(VerEvidenciaPdfComponent, {
      disableClose: false,
      width: '70%',
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
