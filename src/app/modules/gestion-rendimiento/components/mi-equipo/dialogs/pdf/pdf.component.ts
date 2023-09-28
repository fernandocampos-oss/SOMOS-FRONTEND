import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  pdfSrc = "" //https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.loadPdfFile(this.data.obj.idArchivo)
  }

  loadPdfFile(element){
    // this.services.DescargarArchivo(element).subscribe((dataItem) => {
    //   if (dataItem.codigo == 1) {
    //     this.pdfSrc=dataItem.data.base64
    //   } else {
    //     this._notification.error(dataItem.msj);
    //   }
    // });
  }

}
