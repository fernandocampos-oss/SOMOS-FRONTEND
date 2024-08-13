import { EncuestaFormularioService } from './../../../../data/services/encuesta-formulario.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-encuesta-formulario',
  templateUrl: './encuesta-formulario.component.html',
  styleUrls: ['./encuesta-formulario.component.scss']
})
export class EncuestaFormularioComponent implements OnInit {

  listPreguntasPorEncuesta: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private dialogRef: MatDialogRef<EncuestaFormularioComponent>,
    private dialog: MatDialog,
    private _encuestaFormularioService: EncuestaFormularioService
  ) {
    console.log(">>", this.data.publicacion)
  }

  ngOnInit(): void {
    this.getPreguntasByIdEncuesta(this.data.publicacion.idEncuesta)
  }

  async getPreguntasByIdEncuesta(idEncuesta: any) {
    await this._encuestaFormularioService.getPreguntasByIdEncuesta(idEncuesta).then(data => {
      this.listPreguntasPorEncuesta = data;
    });
  }

}
