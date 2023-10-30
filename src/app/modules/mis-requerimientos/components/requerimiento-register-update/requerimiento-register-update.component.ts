import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { UserSession } from '@data/models';
import { RequerimientoResponse, TipoIngreso, TipoValorMeta } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-requerimiento-register-update',
  templateUrl: './requerimiento-register-update.component.html',
  styleUrls: ['./requerimiento-register-update.component.scss']
})
export class RequerimientoRegisterUpdateComponent implements OnInit {
  form: FormGroup;
  listTipoIngreso: TipoIngreso[] = [];
  idTipoIngresoSeleccionado: number;

  listValorMeta: any[] = [];
  idValorMetaSeleccionado: number;
  onChangeValue: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog,
    private _requerimientoService: GestionRendimientoService,
    private _fb: FormBuilder,
    private _notification: NotificationService
  ) {
  }

  ngOnInit(): void {
    console.log(this.data)
    this._createForm();
    this.listarTipoIngreso();
    this.listarValorMeta();
  }

  async listarTipoIngreso() {
    let listarTipoIngreso = await this._requerimientoService.listarTipoIngreso().then((data) => {
      if (data.length > 0) {
        this.listTipoIngreso = data;
      } else {
        this._notification.warning("Lista tipo de ingreso vacio");
      }
    });
  }

  async listarValorMeta() {
    let listarValorMeta = await this._requerimientoService.listarValorMeta().then((data) => {
      if (data.length > 0) {
        this.listValorMeta = data;
      } else {
        this._notification.warning("Lista de valor meta vacio");
      }
    });
  }

  private _createForm() {
    if (this.data.esEditar == true) {
      this.idTipoIngresoSeleccionado = this.data.model.requerimiento.tipoIngreso.idTipoIngreso;
      this.form = this._fb.group({
        frmNombre: [this.data.model.requerimiento.nombre, [Validators.required]],
        frmDescripcion: [this.data.model.requerimiento.descripcion, [Validators.required]],
        frmTipoIngreso: [this.data.model.requerimiento.tipoIngreso.idTipoIngreso, [Validators.required]],
        frmTipoValorMeta: [this.data.model.requerimiento.tipoValorMeta.idTipoValorMeta, [Validators.required]],
        frmValorMeta: [this.data.model.requerimiento.valorMeta, [Validators.required]],
      });
    } else {
      this.form = this._fb.group({
        frmNombre: [null, [Validators.required]],
        frmDescripcion: [null, [Validators.required]],
        frmTipoIngreso: [null, [Validators.required]],
        frmTipoValorMeta: [null, [Validators.required]],
        frmValorMeta: [null],
        // frmAreaSolicitante: 'SGSA',
      });
    }
  }

  onSelectionChange(event: any) {
    // console.log(event);
    this.onChangeValue = event.value;
  }

  async registrarActualizarRequerimiento() {
    const model = this._getModel();
    if (this.data.esEditar == true) {
      let modificar = await this._requerimientoService.updateRequerimiento(this.data.model.requerimiento.idRequerimiento, model).then((data) => {
        this._notification.success("Requerimiento actualizado correctamente")
        this.dialogRef.closeAll();
      });
    } else {
      let registrar = await this._requerimientoService.registrarRequerimiento(model).then((data) => {
        this._notification.success("Requerimiento registrado correctamente")
        this.dialogRef.closeAll();
      });
    }
  }

  private _getModel(): RequerimientoResponse {
    let modelTipoIngreso = new TipoIngreso();
    modelTipoIngreso.idTipoIngreso = this.form.value.frmTipoIngreso;

    let modelTipoValorMeta = new TipoValorMeta();
    modelTipoValorMeta.idTipoValorMeta = this.form.value.frmTipoValorMeta;

    let valorMetaTemp;
    if (this.form.value.frmTipoValorMeta == 1) {
      valorMetaTemp = 100;
    } else {
      valorMetaTemp = this.form.value.frmValorMeta;
    }

    return {
      nombre: this.form.value.frmNombre,
      descripcion: this.form.value.frmDescripcion,
      tipoIngreso: modelTipoIngreso,
      esJefe: this.data.esJefe,
      tipoValorMeta: modelTipoValorMeta,
      valorMeta: valorMetaTemp,
    };
  }

}
