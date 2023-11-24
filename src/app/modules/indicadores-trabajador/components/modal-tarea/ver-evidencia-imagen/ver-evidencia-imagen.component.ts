import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { EvidenciaResponseDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-ver-evidencia-imagen',
  templateUrl: './ver-evidencia-imagen.component.html',
  styleUrls: ['./ver-evidencia-imagen.component.scss']
})
export class VerEvidenciaImagenComponent implements OnInit {
  evidenciaResponseDto: EvidenciaResponseDto;
  evidenciaDescripcion: string = '';
  fileBase64: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private _dialogRef: MatDialog,
    private _fb: FormBuilder,
    private _requerimientoService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.loadImagenFile();
  }

  async loadImagenFile() {
    let load = await this._requerimientoService.getSustentoByEvidencia(this.data.model.idEvidencia).then((data: any) => {
      if (data != null) {
        this.evidenciaResponseDto = data;
        this.evidenciaDescripcion = this.evidenciaResponseDto.evidenciaDescripcion;
        this.fileBase64 = this.evidenciaResponseDto.fileBase64;
      } else {
        this.evidenciaResponseDto = null;
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


}
