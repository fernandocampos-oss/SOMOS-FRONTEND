import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { UserSession } from '@data/models';
import { RequerimientoResponse, TipoIngreso } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
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
  }

  async listarTipoIngreso() {
    let listPoi = await this._requerimientoService.listarTipoIngreso().then((data) => {
      if (data.length > 0) {
        this.listTipoIngreso = data;
      } else {
        this._notification.warning("Lista tipo de ingreso vacio");
      }
    });
  }

  private _createForm() {
    if (this.data.esEditar == true) {
      this.idTipoIngresoSeleccionado = this.data.model.requerimiento.tipoIngreso.idTipoIngreso;
      this.form = this._fb.group({
        frmNombre: [this.data.model.requerimiento.nombre, [Validators.required]],
        frmDescripcion: [this.data.model.requerimiento.descripcion, [Validators.required]],
        frmMedio: [this.data.model.requerimiento.tipoIngreso.idTipoIngreso, [Validators.required]],
        frmIdentificador: [this.data.model.requerimiento.identificador, [Validators.required]],
      });
    } else {
      this.form = this._fb.group({
        frmNombre: [null, [Validators.required]],
        frmDescripcion: [null, [Validators.required]],
        frmMedio: [null, [Validators.required]],
        frmIdentificador: [null, [Validators.required]],
        // frmAreaSolicitante: 'SGSA',
      });
    }
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
    let tipoIngreso = new TipoIngreso();
    tipoIngreso.idTipoIngreso = this.form.value.frmMedio;

    return {
      nombre: this.form.value.frmNombre,
      descripcion: this.form.value.frmDescripcion,
      identificador: this.form.value.frmIdentificador,
      porcentajeAvance: 0,
      tipoIngreso: tipoIngreso,
      esJefe: this.data.esJefe,
    };
  }

}
