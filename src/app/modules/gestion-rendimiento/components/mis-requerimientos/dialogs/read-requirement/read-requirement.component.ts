import { element } from 'protractor';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { UpdateTareaComponent } from './update-tarea/update-tarea.component';
import { TareaResponse } from '@data/models/gestion-rendimiento/tarea-model';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-read-requirement',
  templateUrl: './read-requirement.component.html',
  styleUrls: ['./read-requirement.component.scss']
})
export class ReadRequirementComponent implements OnInit {

  form: FormGroup;
  estadoReq: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre_tarea', 'fecha_asignacion', 'plazo', 'acciones'];

  dataSource_tarea: TareaResponse[];

  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _requerimientoService: GestionRendimientoService,
    private _dialog: MatDialog,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.estadoReq = this.data.model.estadoRequerimiento.codigo;
    this.createForm();

    this.dataSource_tarea = this.data.model.listTarea;
  }

  createForm() {
    this.form = this._fb.group({
      frmTitulo: [this.data.model.requerimiento.nombre],
      frmDescripcion: [this.data.model.requerimiento.descripcion],
      frmIdentificador: [this.data.model.requerimiento.identificador],
      frmTipoIngreso: [this.data.model.requerimiento.tipoIngreso.descripcion],
      frmporcentajeAvance: [this.data.model.requerimiento.porcentajeAvance + "%"],
      // frmAreaSolicitante: [this.data.model.codUnidadSolicitante],
      // frmAreaDestinatario: [this.data.model.codUnidadReceptor],
      frmEstado: [this.data.model.estadoRequerimiento.descripcion],
      frmMotivo: [this.data.model.motivo]
    });
  }

  actualizarTarea(element) {
    const dialogRef: MatDialogRef<UpdateTareaComponent> = this._dialog.open(UpdateTareaComponent, {
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
