import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EvidenciaResponseDTO } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';

@Component({
  selector: 'app-list-evidencia',
  templateUrl: './list-evidencia.component.html',
  styleUrls: ['./list-evidencia.component.scss']
})
export class ListEvidenciaComponent implements OnInit {
  descripcionEvidencia: string;
  stringBase64: string;
  evidenciaDTO: EvidenciaResponseDTO;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private _dialogRef: MatDialog,
    private _fb: FormBuilder,
    private _requerimientoService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.getEvidenciaPorTarea();
  }

  async getEvidenciaPorTarea() {
    let load = await this._requerimientoService.getEvidenciaPorTarea(this.data.model.idTarea).then((data: any) => {
      if (data != null) {
        this.evidenciaDTO = data;
        this.descripcionEvidencia = data.descripcion;
        this.stringBase64 = data.imagenBase64;
      } else {
        this.evidenciaDTO = null;
        this._notification.warning("Aún no tienes evidencias registradas");
      }
    });
  }

  downloadFile() {
    if (this.evidenciaDTO != null) {
      const byteString = window.atob(this.evidenciaDTO.imagenBase64);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: this.evidenciaDTO.extension });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Evidencia" + '_' + new Date().getTime() + "." + this.evidenciaDTO.extension;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } else {
      this._notification.error("Error al descargar imagen");
    }
  }

}
