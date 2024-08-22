import { element } from 'protractor';
import { EncuestaFormularioService } from './../../../../data/services/encuesta-formulario.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { FormPreguntaResponse, RegistrarRespuestaRequestDto } from '@data/models/form-encuesta/registrarRespuestaRequestDto';
import { DialogTempComponent } from '../encuesta-simple/dialog-temp/dialog-temp.component';
import { ConfirmarPanelComponent } from '@shared/confirmar-panel/confirmar-panel.component';

interface Alternativa {
  id: number;
  denominacion: string;
  imagen: string;
  alt: string;
}

@Component({
  selector: 'app-encuesta-formulario',
  templateUrl: './encuesta-formulario.component.html',
  styleUrls: ['./encuesta-formulario.component.scss']
})
export class EncuestaFormularioComponent implements OnInit {
  confirmDialogRef: MatDialogRef<ConfirmarPanelComponent>;

  listPreguntasPorEncuesta: any[] = [];
  selectedImageIndex: number | null = null;

  listAlternativa: Alternativa[] = [
    { id: 1, denominacion: "Satisfecho", imagen: "assets/images/encuesta/satisfecho.png", alt: "Satisfecho" },
    { id: 2, denominacion: "Por mejorar", imagen: "assets/images/encuesta/por_mejorar.png", alt: "Por mejorar" },
    { id: 3, denominacion: "Insatisfecho", imagen: "assets/images/encuesta/insatisfecho.png", alt: "Insatisfecho" }
  ];

  currentQuestionIndex: number = 0;
  questions = [];
  idEncuesta: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private _dialogRef: MatDialogRef<EncuestaFormularioComponent>,
    private _dialog: MatDialog,
    private _encuestaFormularioService: EncuestaFormularioService,
  ) {
    // console.log("dialog", this.data.publicacion)
  }

  ngOnInit(): void {
    this.getPreguntasByIdEncuesta(this.data.publicacion.idEncuesta);
  }

  async getPreguntasByIdEncuesta(idEncuesta: any) {
    await this._encuestaFormularioService.getPreguntasByIdEncuesta(idEncuesta).then(data => {
      if (data.length > 0) {
        this.listPreguntasPorEncuesta = data;
        console.log(this.listPreguntasPorEncuesta)
        this.idEncuesta = this.listPreguntasPorEncuesta[0].formEncuesta.idFormEncuesta;
        console.log("encuesta", this.idEncuesta)

        this.evaluarEncuestaFinalizado(this.idEncuesta);
        for (let a of this.listPreguntasPorEncuesta) {
          this.questions.push({
            idPregunta: a.idFormPregunta,
            pregunta: a.denominacion,
            respuesta: ''
          });
        }
      }
    });
  }

  selectRespuesta(index: number, element: any, idPregunta: number): void {
    this.selectedImageIndex = index;
    // console.log("e ", element)
    this.questions[this.currentQuestionIndex].respuesta = element.denominacion;
    this.questions[this.currentQuestionIndex].idPregunta = idPregunta
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  async evaluarEncuestaFinalizado(idEncuesta: any) {
    await this._encuestaFormularioService.evaluarEncuestaFinalizado(idEncuesta).then(data => {
      if (data === true) {
        this._dialogRef.close();

        const dialogRef2: MatDialogRef<DialogTempComponent> = this._dialog.open(DialogTempComponent, {
          disableClose: true,
          minWidth: '22em',
          maxWidth: '40em',
          autoFocus: false,
        });

      }
    });
  }

  enviarRespuestas() {
    this.confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de enviar tus respuestas?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {

        console.log('rsptas', this.questions);
        let dto = new RegistrarRespuestaRequestDto();
        dto.idFormEncuesta = this.idEncuesta;

        let preguntas: FormPreguntaResponse[] = [];
        for (let i of this.questions) {
          let pregunta = new FormPreguntaResponse();
          pregunta.idFormPregunta = i.idPregunta;
          pregunta.denominacion = i.pregunta;
          pregunta.respuesta = i.respuesta;
          preguntas.push(pregunta);
        }
        dto.listPregunta = preguntas;
        this._encuestaFormularioService.registrarRespuestas(dto).subscribe(data => {
          if (data === null) {
            this._notification.success('Respuestas registradas correctamente');
            this._dialogRef.close();
          }
        });

      }
      this.confirmDialogRef = null;
    });

  }

}
