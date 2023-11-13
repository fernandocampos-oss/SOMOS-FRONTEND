import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { TareaResponse } from '@data/models/gestion-rendimiento/tarea-model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { EditTareaComponent } from './edit-tarea/edit-tarea.component';
import { VerEvidenciaImagenComponent } from '@modules/indicadores-trabajador/components/modal-tarea/ver-evidencia-imagen/ver-evidencia-imagen.component';
import { VerEvidenciaPdfComponent } from '@modules/indicadores-trabajador/components/modal-tarea/ver-evidencia-pdf/ver-evidencia-pdf.component';

@Component({
  selector: 'app-read-indicador-tarea',
  templateUrl: './read-indicador-tarea.component.html',
  styleUrls: ['./read-indicador-tarea.component.scss']
})
export class ReadIndicadorTareaComponent implements OnInit {
  form: FormGroup;
  estadoReq: string = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre_tarea', 'fecha_asignacion', 'plazo', 'acciones'];
  dataSource_tarea: TareaResponse[];

  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _grService: GestionRendimientoService,
    private _dialog: MatDialog,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    console.log("tareas", this.data)
    // this.estadoReq = this.data.model.estadoIndicador.codigo;
    // this.createForm();
    this.dataSource_tarea = this.data.model.listTarea;
  }

  // createForm() {
  //   this.form = this._fb.group({
  //     frmTitulo: [this.data.model.requerimiento.nombre],
  //     frmDescripcion: [this.data.model.requerimiento.descripcion],
  //     frmIdentificador: [this.data.model.requerimiento.identificador],
  //     frmTipoIngreso: [this.data.model.requerimiento.tipoIngreso.descripcion],
  //     frmporcentajeAvance: [this.data.model.requerimiento.porcentajeAvance + "%"],
  //     frmEstado: [this.data.model.estadoRequerimiento.descripcion],
  //     frmMotivo: [this.data.model.motivo]
  //   });
  // }

  editarTarea(element) {
    const dialogRef: MatDialogRef<EditTareaComponent> = this._dialog.open(EditTareaComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: true,
      data: {
        // idRequerimientoUsuario: this.data.model.idRequerimientoUsuario,
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTable();
    });
  }

  verImagenEvidencia(element) {
    const dialogRef: MatDialogRef<VerEvidenciaImagenComponent> = this._dialog.open(VerEvidenciaImagenComponent, {
      disableClose: false,
      width: '50%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  verEvidenciaPdf(element) {
    const dialogRef: MatDialogRef<VerEvidenciaPdfComponent> = this._dialog.open(VerEvidenciaPdfComponent, {
      disableClose: false,
      width: '70%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  rechazarTarea(){
    
  }

  // onPoiCreate(){
  //   this.poiList.push({descripcionPoi: this.descripcionPoi});
  //   this.descripcionPoi = "";
  //   this.table.renderRows();
  // }

  // deletePoi(index){
  //   this.poiList.splice(index,1);
  //   this.table.renderRows();
  // }
 
}
