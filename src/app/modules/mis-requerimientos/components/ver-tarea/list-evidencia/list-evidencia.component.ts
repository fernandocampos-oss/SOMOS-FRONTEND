import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-evidencia',
  templateUrl: './list-evidencia.component.html',
  styleUrls: ['./list-evidencia.component.scss']
})
export class ListEvidenciaComponent implements OnInit {
  titleTarea: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'descripcion', 'fecha_creacion', 'acciones']; //'porcentaje_avance', 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private _dialogRef: MatDialog,
    private _fb: FormBuilder,
    private _requerimientoService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    // console.log(this.data)
    this.getListarEvidencias();
    this.titleTarea = this.data.model.nombreTarea;
  }

  async getListarEvidencias() {
    let load = await this._requerimientoService.getListarEvidenciasTarea(this.data.model.idTarea).then((data: any) => {
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this._notification.warning("Aún no tienes evidencias registradas");
      }
    });
  }

  downloadFile(element) {
    console.log("File download", element)
      if (element) {
        const byteString = window.atob(element.imagenBase64);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: element.extension });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = "Evidencia" + "." + element.extension;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        this._notification.error("Error al descargar imagen");
      }
  }

}
