import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  user: UserSession;
  form: FormGroup;
  zona: string = '';

  constructor(
    private dialogRef: MatDialog,
    private _requerimientoService: GestionRendimientoService,
    private _fb: FormBuilder,
    private _notification: NotificationService
  ) {
  }

  ngOnInit(): void {
    this._createForm();

  }

  private _createForm() {
    this.form = this._fb.group({
      frmNombre: [null, [Validators.required]],
      frmDescripcion: [null, [Validators.required]],
      frmMedio: [null, [Validators.required]],
      frmIdentificador: [null, [Validators.required]],
      // frmAreaSolicitante: 'SGSA',
      // frmAreaReceptora: [null, [Validators.required]],
    });
  }

  registrarRequerimiento() {
    const model = this._getModel();

    this._requerimientoService.registrarRequerimiento(model).subscribe((data) => {
      this._notification.success("Requerimiento registrado")
      this.dialogRef.closeAll();
    });

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
    };
  }

}
