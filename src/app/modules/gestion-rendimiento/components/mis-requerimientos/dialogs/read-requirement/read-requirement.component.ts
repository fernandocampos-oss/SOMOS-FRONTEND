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
    console.log("koko", this.data)
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

  async exportToExcel(element) {
    // console.log("element", element)
    // if (element.idRequerimientoUsuario > 0) {
    //   let reportePersonal = new ReportePersonal();
    //   reportePersonal.apellidos = element.usuario.apellidos;
    //   reportePersonal.nombres = element.usuario.nombres;
    //   reportePersonal.cargo = element.usuario.cargo;

    //   let listTarea: ReporteEvidencia[] = [];
    //   for (let i of element.listTarea) {
    //     let obj = new ReporteEvidencia();
    //     obj.nombreTarea = i.nombreTarea;
    //     obj.requerimientoDescripcion = element.requerimiento.nombre;
    //     obj.poi = element.poi.descripcion;
    //     obj.indicador = element.poi.indicador.descripcion;

    //     let a = await this._requerimientoService.getEvidenciaPorTarea(i.idTarea).then((data: any) => {
    //       if (data != null) {
    //         this.evidenciaDTO = data;
    //         console.log("dto:", data);
    //       } else {
    //         this.evidenciaDTO = null;
    //       }
    //     });

    //     //comparar fechas para el comentario en excel
    //     let fechaISOPlazo = i.plazo.split("T");
    //     let fechaPlazo = fechaISOPlazo[0];

    //     if (this.evidenciaDTO.idEvidencia > 0) {
    //       let fechaISOEvidencia = this.evidenciaDTO.fechaCreacion.split("T");
    //       let fechaEvidencia = fechaISOEvidencia[0];

    //       console.log("fechaPlazo: ", fechaPlazo);
    //       console.log("fechaEvidencia: ", fechaEvidencia)

    //       var first = new Date(fechaPlazo);
    //       var second = new Date(fechaEvidencia);

    //       if (first < second) {
    //         console.log(first, "es menor que", second);
    //         obj.comentario = 'Se pasó de la fecha';
    //       }
    //       else if (first > second) {
    //         console.log(first, "es mayor que", second);
    //         obj.comentario = 'Presentó evidencia dentro de la fecha';
    //       }
    //       else if (first == second) {
    //         console.log(first, "es igual que", second);
    //         obj.comentario = 'Presentó evidencia dentro de la fecha';
    //       }
    //       obj.descripcionEvidencia = this.evidenciaDTO.descripcion;
    //       obj.porcentajeAvanceEvidencia = this.evidenciaDTO.porcentajeAvance;
    //       obj.plazoTarea = fechaPlazo;
    //       listTarea.push(obj);
    //       obj = null;
    //       reportePersonal.estadoEntregado = "Entregado";

    //     } else {
    //       this._notification.warning("No se encontró evidencia para la tarea: " + i.nombreTarea);

    //       let obj = new ReporteEvidencia();
    //       obj.nombreTarea = i.nombreTarea;
    //       obj.requerimientoDescripcion = element.requerimiento.nombre;
    //       obj.poi = element.poi.descripcion;
    //       obj.plazoTarea = fechaPlazo;
    //       obj.porcentajeAvanceEvidencia = 0;
    //       obj.comentario = 'No presentó evidencia';
    //       listTarea.push(obj);
    //       obj = null;
    //     }

    //   }
    //   console.log("data excel", listTarea)
    //   let columnsName = ["String_1", "String_2"];
    //   let reportData = {
    //     data_personal: reportePersonal,
    //     data_evidencia: listTarea,
    //     headers: columnsName,
    //   };
    //   this._serviceExcel.exportExcel(reportData);
    // }
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
