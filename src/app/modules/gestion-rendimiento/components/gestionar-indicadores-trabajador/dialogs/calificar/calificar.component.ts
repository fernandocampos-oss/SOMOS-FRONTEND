import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from '@core/configs';
import { NotificationService } from '@core/services';
import { ActividadResponse, EvidenciaResponseDto, TipoValorMeta } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { ActividadRequest, EvidenciaRequest, IndicadorRequest } from '@data/models/gestion-rendimiento/indicador-dto.model';
import { UpdatePrioridadDto } from '@data/models/gestion-rendimiento/prioridad-exist-indicador.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

import * as moment from 'moment';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.component.html',
  styleUrls: ['./calificar.component.scss']
})
export class CalificarComponent implements OnInit {
  expTexto:RegExp = /^[a-zA-Z\u00C1\u00C9\u00CD\u00D3\u00F3\u00FA\u00d1\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa0-9,.\- \'\"\(\)\[\]]{1,200}$/;
  minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;
  indicador: IndicadorRequest;

  pdfSrc: string = "";
  evidenciaResponseDto: EvidenciaResponseDto;
  evidenciaDescripcion: string = '';

  formEvidencia = this._formBuilder.group({
    frmDescripcion: ['',[Validators.pattern(this.expTexto), Validators.maxLength(300)]],
    frmPlazo: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
    public _dialogRef: MatDialogRef<CalificarComponent>,
    private _requerimientoService: GestionRendimientoService,
    private _formBuilder: FormBuilder
  ) {}
  

  ngOnInit(): void {
    this.evidenciaResponseDto = {
      'comentario':'',
      'calificacion':0
    }
    console.log(this.data);
    this.cargarDatosIniciales();
  }

  async cargarDatosIniciales() {
    await this._requerimientoService.getSustentoByEvidencia(this.data.idEvidencia).then((data: any) => {
    // await this._requerimientoService.getSustentoByEvidencia(this.data.model.idEvidencia).then((data: any) => {
      if (data != null) {
        this.evidenciaResponseDto = data;
        this.pdfSrc = this.evidenciaResponseDto.fileBase64;
        this.evidenciaDescripcion = this.evidenciaResponseDto.evidenciaDescripcion;
      } else {
        this.evidenciaResponseDto = null;
      }
    });
  }


  // getInitEvidencia() {
  //   this.evidencia = new EvidenciaRequest();
  //   this.evidencia.descripcion = this.data.evidencia.descripcion;
  //   this.evidencia.plazo = this.data.evidencia.plazo;
  // }

  // async modificarEvidencia() {
  //   if (this.evidencia != null) {
  //     let update = await this._grService.modificarEvidencia(this.data.evidencia.idEvidencia, this.evidencia).then((data) => {
  //       if (data = 1) {
  //         this._notification.success("Evidencia actualizada");
  //         // this._dialogRef.closeAll();
  //         this._dialogRef.close();
  //       } else {
  //         this._notification.error("Actualizar Evidencia: Error");
  //       }
  //     });
  //   }
  // }
  async moficarCalificacion(){
    if (this.evidenciaResponseDto.comentario!=null && this.evidenciaResponseDto.calificacion!=undefined) {
      let update = await this._grService.actualizarCalificacionEvidencia(this.data.idEvidencia,this.evidenciaResponseDto.comentario,this.evidenciaResponseDto.calificacion).then((data)=>{
        if (data = 1) {
          this._notification.success("Calificación actualizada");
          // this._dialogRef.closeAll();
          this._dialogRef.close();
        } else {
          this._notification.error("Actualizar Calificación: Error");
        }
      })
    }  
  }

  validaTexto(event:any){
    const inputValue: string = String.fromCharCode(event.keyCode);
    return this.expTexto.test(inputValue);
  }

}
