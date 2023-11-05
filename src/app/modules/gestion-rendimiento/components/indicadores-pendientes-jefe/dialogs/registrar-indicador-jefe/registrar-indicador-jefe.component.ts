import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { IndicadorRequest, TipoIngreso, TipoValorMeta } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-registrar-indicador-jefe',
  templateUrl: './registrar-indicador-jefe.component.html',
  styleUrls: ['./registrar-indicador-jefe.component.scss']
})
export class RegistrarIndicadorJefeComponent implements OnInit {
  form: FormGroup;
  listTipoIngreso: TipoIngreso[] = [];
  idTipoIngresoSeleccionado: number;

  listTipoValorMeta: any[] = [];
  idValorMetaSeleccionado: number;
  onChangeValueTipoValorMeta: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog,
    private _gestionRendimientoService: GestionRendimientoService,
    private _fb: FormBuilder,
    private _notification: NotificationService
  ) {
  }

  ngOnInit(): void {
    console.log(this.data)
    this._createForm();
    this.listarTipoIngreso();
    this.listarTipoValorMeta();
  }

  async listarTipoIngreso() {
    let listarTipoIngreso = await this._gestionRendimientoService.listarTipoIngreso().then((data) => {
      if (data.length > 0) {
        this.listTipoIngreso = data;
      } else {
        this._notification.warning("Lista tipo de ingreso vacio");
      }
    });
  }

  async listarTipoValorMeta() {
    let listarTipoValorMeta = await this._gestionRendimientoService.listarTipoValorMeta().then((data) => {
      if (data.length > 0) {
        this.listTipoValorMeta = data;
      } else {
        this._notification.warning("Lista de tipo valor meta vacio");
      }
    });
  }

  private _createForm() {
    if (this.data.esEditar == true) {
      this.idTipoIngresoSeleccionado = this.data.model.indicador.tipoIngreso.idTipoIngreso;
      this.form = this._fb.group({
        frmNombre: [this.data.model.indicador.nombre, [Validators.required]],
        frmDescripcion: [this.data.model.indicador.descripcion, [Validators.required]],
        frmTipoIngreso: [this.data.model.indicador.tipoIngreso.idTipoIngreso, [Validators.required]],
        frmTipoValorMeta: [this.data.model.indicador.tipoValorMeta.idTipoValorMeta, [Validators.required]],
        frmValorMeta: [this.data.model.indicador.valorMeta, [Validators.required]],
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

  onSelectionChangeTipoValorMeta(event: any) {
    console.log(event.value);
    this.onChangeValueTipoValorMeta = event.value;
  }

  async registrarActualizarIndicador() {
    const model = this._getModel();
    if (this.data.esEditar == true) {
      let modificar = await this._gestionRendimientoService.updateIndicador(this.data.model.indicador.idIndicador, model).then((data) => {
        this._notification.success("Requerimiento actualizado correctamente")
        this.dialogRef.closeAll();
      });
    } else {
      let registrar = await this._gestionRendimientoService.registrarIndicador(model).then((data) => {
        this._notification.success("Requerimiento registrado correctamente")
        this.dialogRef.closeAll();
      });
    }
  }

  private _getModel(): IndicadorRequest {
    let modelTipoIngreso = new TipoIngreso();
    modelTipoIngreso.idTipoIngreso = this.form.value.frmTipoIngreso;

    let modelTipoValorMeta = new TipoValorMeta();
    modelTipoValorMeta.idTipoValorMeta = this.form.value.frmTipoValorMeta;

    let valorMetaTemp;
    if (this.form.value.frmTipoValorMeta == 3) {
      valorMetaTemp = 100;
    } else {
      valorMetaTemp = this.form.value.frmValorMeta;
    }

    return {
      nombre: this.form.value.frmNombre,
      descripcion: this.form.value.frmDescripcion,
      tipoIngreso: modelTipoIngreso,
      tipoValorMeta: modelTipoValorMeta,
      valorMeta: valorMetaTemp,
    };
  }
  

}
