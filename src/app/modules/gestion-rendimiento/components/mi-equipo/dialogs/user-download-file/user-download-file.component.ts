import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { EvidenciaResponseDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { VerEvidenciaPdfComponent } from '@modules/indicadores-trabajador/components/modal-tarea/ver-evidencia-pdf/ver-evidencia-pdf.component';

@Component({
  selector: 'app-user-download-file',
  templateUrl: './user-download-file.component.html',
  styleUrls: ['./user-download-file.component.scss']
})
export class UserDownloadFileComponent implements OnInit {

  descripcionEvidencia: string;
  stringBase64: string;
  evidenciaResponseDto: EvidenciaResponseDto;

  constructor(
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
    public dialogRef: MatDialogRef<UserDownloadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.getEvidenciaPorTarea();
  }

  async getEvidenciaPorTarea() {
    let load = await this._requerimientoService.getEvidenciaPorTarea(this.data.model.idTarea).then((data: any) => {
      if (data != null) {
        this.evidenciaResponseDto = data;
        this.descripcionEvidencia = data.descripcion;
        this.stringBase64 = data.imagenBase64;
      } else {
        this.evidenciaResponseDto = null;
        this._notification.warning("Aún no tienes evidencias registradas");
      }
    });
  }

  downloadFile() {
    if (this.evidenciaResponseDto != null) {
      const byteString = window.atob(this.evidenciaResponseDto.fileBase64);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: this.evidenciaResponseDto.extension });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Evidencia" + '_' + new Date().getTime() + "." + this.evidenciaResponseDto.extension;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } else {
      this._notification.error("Error al descargar imagen");
    }
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

  showDialogPdf(element) {
    const dialogRef: MatDialogRef<VerEvidenciaPdfComponent> = this.dialog.open(VerEvidenciaPdfComponent, {
      disableClose: false,
      width: '90%',
      autoFocus: false,
      data: {
        obj: element
      }
    });
  }

}
