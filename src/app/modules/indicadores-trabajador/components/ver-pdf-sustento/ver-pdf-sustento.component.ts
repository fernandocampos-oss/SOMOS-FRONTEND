import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { EvidenciaResponseDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

@Component({
  selector: 'app-ver-pdf-sustento',
  templateUrl: './ver-pdf-sustento.component.html',
  styleUrls: ['./ver-pdf-sustento.component.scss']
})
export class VerPdfSustentoComponent implements OnInit {
// pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
pdfSrc: string = "";
evidenciaResponseDto: EvidenciaResponseDto;
evidenciaDescripcion: string = '';
esArchivoAntiguo: boolean = false;

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private _requerimientoService: GestionRendimientoService,
  private _notification: NotificationService,
) { }

ngOnInit(): void {
  this.loadPdfFile()
}

async loadPdfFile() {
  let load = await this._requerimientoService.getSustentoByEvidencia(this.data.model.idEvidencia).then((data: any) => {
    if (data != null) {
      this.evidenciaResponseDto = data;
      this.pdfSrc = this.evidenciaResponseDto.fileBase64;
      this.evidenciaDescripcion = this.evidenciaResponseDto.evidenciaDescripcion;
      this.esArchivoAntiguo = !!data.esArchivoAntiguo;
    } else {
      this.evidenciaResponseDto = null;
    }
  });
}

}
