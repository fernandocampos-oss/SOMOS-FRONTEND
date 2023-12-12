import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from '@core/configs';
import { NotificationService } from '@core/services';
import { ActividadResponse, TipoValorMeta } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { ActividadRequest, EvidenciaRequest, IndicadorRequest } from '@data/models/gestion-rendimiento/indicador-dto.model';
import { UpdatePrioridadDto } from '@data/models/gestion-rendimiento/prioridad-exist-indicador.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

import * as moment from 'moment';

@Component({
  selector: 'app-edit-master',
  templateUrl: './edit-master.component.html',
  styleUrls: ['./edit-master.component.scss']
})
export class EditMasterComponent implements OnInit {
  minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;
  evidencia: EvidenciaRequest;
  indicador: IndicadorRequest;

  idActividadSeleccionado: number;
  listActividad: ActividadResponse[];
  formPrioridad: FormGroup;

  idTipoValorMetaSeleccionado: number;
  listTipoValorMeta: any[] = [];
  onChangeValueTipoValorMeta: number;
  formIndicador: FormGroup;
  showHelpPeso = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<EditMasterComponent>,
    // private _dialogRef: MatDialog,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.switch == 1) {
      this.listarActividades();
      this.getInitPrioridad();
    } else if (this.data.switch == 2) {
      this.listarTipoValorMeta();
      this.getInitIndicador();
    } else if (this.data.switch == 3) {
      this.getInitEvidencia();
    }
  }

  async listarActividades() {
    let listActividades = await this._grService.listarActividades().then((data) => {
      if (data.length > 0) {
        this.listActividad = data;
      } else {
        this._notification.warning("Lista de actividades vacia");
      }
    });
  }

  async listarTipoValorMeta() {
    let listarTipoValorMeta = await this._grService.listarTipoValorMeta().then((data) => {
      if (data.length > 0) {
        this.listTipoValorMeta = data;
      } else {
        this._notification.warning("Lista de tipo valor meta vacio");
      }
    });
  }

  getInitPrioridad() {
    this.formPrioridad = new FormGroup({
      'actividad': new FormControl(this.data.idActividad),
      'fechaAsignacion': new FormControl(new Date(this.data.fechaAsignacion))
    });
    this.idActividadSeleccionado = this.data.idActividad;
  }

  getInitIndicador() {
    this.formIndicador = new FormGroup({
      'descripcion': new FormControl(this.data.indicador.nombreIndicador),
      'tipoValorMeta': new FormControl(this.data.indicador.idTipoValorMeta),
      'valorMeta': new FormControl(this.data.indicador.valorMeta),
      'peso': new FormControl(this.data.indicador.peso),
    });
    this.idTipoValorMetaSeleccionado = this.data.indicador.idTipoValorMeta;
  }

  getInitEvidencia() {
    this.evidencia = new EvidenciaRequest();
    this.evidencia.descripcion = this.data.evidencia.descripcion;
    this.evidencia.plazo = this.data.evidencia.plazo;
  }

  async modificarPrioridad() {
    let actividad = new ActividadRequest();
    actividad.idActividad = this.idActividadSeleccionado;

    let model = new UpdatePrioridadDto();
    model.actividad = actividad;
    model.fechaAsignacion = moment(this.formPrioridad.value['fechaAsignacion']).format('YYYY-MM-DDTHH:mm:ss');

    if (model != null) {
      let update = await this._grService.modificarPrioridad(this.data.idPrioridad, model).then((data) => {
        if (data = 1) {
          this._notification.success("Prioridad Actualizada Correctamente");
          // this._dialogRef.closeAll();
          this._dialogRef.close();
        } else {
          this._notification.error("Actualizar Prioridad: Error");
        }
      });
    }
  }

  async modificarIndicador() {
    // console.log(this.formIndicador.value);
    if (this.formIndicador.valid) {
      let modelTipo = new TipoValorMeta();
      modelTipo.idTipoValorMeta = this.idTipoValorMetaSeleccionado;

      let model = new IndicadorRequest();
      model.descripcion = this.formIndicador.get('descripcion').value;
      model.tipoValorMeta = modelTipo;
      model.valorMeta = this.formIndicador.value.valorMeta;
      model.peso = Number(this.formIndicador.value.peso);

      if (model != null) {
        let update = await this._grService.modificarIndicador(this.data.indicador.idIndicador, model).then((data) => {
          if (data = 1) {
            this._notification.success("Indicador actualizada");
            // this._dialogRef.closeAll();
            this._dialogRef.close();
          } else {
            this._notification.error("Actualizar Indicador: Error");
          }
        });
      }
    } else {
      this._notification.warning("Ingrese todos los campos para continuar");
    }
  }

  async modificarEvidencia() {
    if (this.evidencia != null) {
      let update = await this._grService.modificarEvidencia(this.data.evidencia.idEvidencia, this.evidencia).then((data) => {
        if (data = 1) {
          this._notification.success("Evidencia actualizada");
          // this._dialogRef.closeAll();
          this._dialogRef.close();
        } else {
          this._notification.error("Actualizar Evidencia: Error");
        }
      });
    }
  }

}
