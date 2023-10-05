import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { NotificationService } from '@core/services';
import { EvidenciaResponseDTO } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {
  // pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  pdfSrc: string = "";
  evidenciaDTO: EvidenciaResponseDTO;
  // descripcionEvidencia: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    // this.loadPdfFile(this.data.model.idArchivo)
    this.loadPdfFile()
  }

  // loadPdfFile(element){
  // this.services.DescargarArchivo(element).subscribe((dataItem) => {
  //   if (dataItem.codigo == 1) {
  //     this.pdfSrc=dataItem.data.base64
  //   } else {
  //     this._notification.error(dataItem.msj);
  //   }
  // });
  // }

  async loadPdfFile() {
    let load = await this._requerimientoService.getEvidenciaPorTarea(this.data.model.idTarea).then((data: any) => {
      if (data != null) {
        this.evidenciaDTO = data;        
        this.pdfSrc = data.imagenBase64;
        // this.descripcionEvidencia = data.descripcion;
      } else {
        this.evidenciaDTO = null;
        this._notification.warning("Aún no tienes evidencias registradas");
      }
    });
  }

}
