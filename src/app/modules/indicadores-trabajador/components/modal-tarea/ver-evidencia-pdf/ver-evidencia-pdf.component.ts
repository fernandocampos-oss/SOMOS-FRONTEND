import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { EvidenciaResponseDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-ver-evidencia-pdf',
  templateUrl: './ver-evidencia-pdf.component.html',
  styleUrls: ['./ver-evidencia-pdf.component.scss']
})
export class VerEvidenciaPdfComponent implements OnInit {
// pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
pdfSrc: string = "";
evidenciaResponseDto: EvidenciaResponseDto;
evidenciaDescripcion: string = '';

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

async loadPdfFile() {
  let load = await this._requerimientoService.getEvidenciaPorTarea(this.data.model.idTarea).then((data: any) => {
    if (data != null) {
      this.evidenciaResponseDto = data;
      this.pdfSrc = this.evidenciaResponseDto.fileBase64;
      this.evidenciaDescripcion = this.evidenciaResponseDto.evidenciaDescripcion;
    } else {
      this.evidenciaResponseDto = null;
    }
  });
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
  
}
