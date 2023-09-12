import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { PdfComponent } from '../pdf/pdf.component';

@Component({
  selector: 'app-user-download-file',
  templateUrl: './user-download-file.component.html',
  styleUrls: ['./user-download-file.component.scss']
})
export class UserDownloadFileComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'descripcion', 'acciones'];
  idtarea = 0;

  constructor(
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    public dialogRef: MatDialogRef<UserDownloadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.idtarea = this.data.model.idTarea;
    this.loadTable();
  }

  async loadTable() {
    let listFiles = await this.services.getListarEvidenciasTarea(this.idtarea).then((data) => {
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = null;
        this._notification.warning("Aún no tiene evidencia registradas");
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
  

    // this.services.DescargarArchivo(element.idEvidencia).subscribe((dataItem) => {
    //   if (dataItem.codigo == 1) {
    //     const byteString = window.atob(dataItem.data.base64);
    //     const arrayBuffer = new ArrayBuffer(byteString.length);
    //     const int8Array = new Uint8Array(arrayBuffer);
    //     for (let i = 0; i < byteString.length; i++) {
    //       int8Array[i] = byteString.charCodeAt(i);
    //     }
    //     const blob = new Blob([int8Array], { type: dataItem.tipo });
    //     let url = window.URL.createObjectURL(blob);
    //     let a = document.createElement('a');
    //     document.body.appendChild(a);
    //     a.setAttribute('style', 'display: none');
    //     a.href = url;
    //     a.download = element.nombre + "." + element.ext;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove();
    //   } else {
    //     this._notification.error(dataItem.msj);
    //   }
    // });
  }

  showDialogPdf(element) {
    const dialogRef: MatDialogRef<PdfComponent> = this.dialog.open(PdfComponent, {
      disableClose: false,
      width: '90%',
      autoFocus: false,
      data: {
        obj: element
      }
    });
  }

}
