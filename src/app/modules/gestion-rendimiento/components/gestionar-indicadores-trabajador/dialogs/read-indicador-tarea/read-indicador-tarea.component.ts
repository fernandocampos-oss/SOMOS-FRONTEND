import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { EditTareaComponent } from './edit-tarea/edit-tarea.component';
import { VerEvidenciaImagenComponent } from '@modules/indicadores-trabajador/components/modal-tarea/ver-evidencia-imagen/ver-evidencia-imagen.component';
import { VerEvidenciaPdfComponent } from '@modules/indicadores-trabajador/components/modal-tarea/ver-evidencia-pdf/ver-evidencia-pdf.component';
import { EvidenciaResponse } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

@Component({
  selector: 'app-read-indicador-tarea',
  templateUrl: './read-indicador-tarea.component.html',
  styleUrls: ['./read-indicador-tarea.component.scss']
})
export class ReadIndicadorTareaComponent implements OnInit {
  form: FormGroup;
  tareaEvidencia: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre_tarea', 'fecha_asignacion', 'plazo', 'acciones'];
  dataSource_tarea: EvidenciaResponse[];

  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _grService: GestionRendimientoService,
    private _dialog: MatDialog,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    // this.createForm();
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

  editarEvidencia(element) {
    const dialogRef: MatDialogRef<EditTareaComponent> = this._dialog.open(EditTareaComponent, {
      disableClose: false,
      width: '40%',
      //height: '780px',
      autoFocus: true,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTable();
    });
  }

  verEvidenciaImagen(element) {
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

   aprobarTarear(element, onDelete: boolean) {
    // console.log("aprobar", element, "bool ", onDelete);

    // const dialogRef: MatDialogRef<AcceptRejectRequirementComponent> = this._dialog.open(AcceptRejectRequirementComponent, {
    //   disableClose: false,
    //   autoFocus: false,
    //   data: {
    //     model: element,
    //     rechazar: onDelete
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   this.loadTable();
    // });
  }

  rechazarTarea(element, onDelete: boolean){
    // console.log("rechazar", element, "bool ", onDelete);
  }

  // showDialogUser(onDelete: boolean) {
  //   const dialogRef: MatDialogRef<UserAddDeleteComponent> = this._dialog.open(UserAddDeleteComponent, {
  //     disableClose: false,
  //     width: onDelete == true ? '600px' : '70%',
  //     autoFocus: false,
  //     data: {
  //       title: (onDelete == true ? 'Eliminar ' : 'Agregar ') + 'integrante',
  //       borrar: onDelete
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadTable();
  //   });
  // }
 
}
