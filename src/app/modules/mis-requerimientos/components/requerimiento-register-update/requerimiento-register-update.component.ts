import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { ConstantesGr } from '@data/constants/constantes-gr.constant';
import { UserSession } from '@data/models';
import { Dependencia } from '@data/models/gestion-rendimiento/dependencia';
import { EstadoRequerimiento } from '@data/models/gestion-rendimiento/estadoRequerimiento';
import { Requerimiento } from '@data/models/gestion-rendimiento/requerimiento';
import { TipoIngreso } from '@data/models/gestion-rendimiento/tipoIngreso';
// import { Requerimiento } from '@data/models/requerimiento/requerimiento.model';
import { AuthService, UsuarioService, ZonaService } from '@data/services';
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
    private _gestionReqService: GestionRendimientoService,
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
      frmAreaSolicitante: 'SGSA',
      frmAreaReceptora: [null, [Validators.required]],
    });
  }

  submitRequerimiento() {
    // console.log(this._getModel());
    // this._gestionReqService.insertFauxRequerimientos(this._getModel());
    // console.log(this._gestionReqService.FauxTablaRequerimientos());

    this._gestionReqService.registrarRequerimiento(this._getModel()).subscribe((data) => {
      if (data = 1) {
        // this.dialogRef.close();
        this._notification.success("Se registró Requerimiento")
      } else {
        this._notification.error("Error al registrar Requerimiento")
      }
    });

    this.dialogRef.closeAll();
  }

  private _getModel(): Requerimiento {
    let t = new TipoIngreso();
    t.idTipoIngreso = this.form.value.frmMedio;

    let e = new EstadoRequerimiento();
    e.idEstadoRequerimiento = ConstantesGr.ESTADO_REQUERIMIENTO_PENDIENTE;

    let receptor = new Dependencia();
    receptor.idDependencia = this.form.value.frmAreaReceptora;

    let solicitante = new Dependencia();
    solicitante.idDependencia = 1;

    return {
      idRequerimiento: 0,
      nombre: this.form.value.frmNombre,
      descripcion: this.form.value.frmDescripcion,
      identificador: this.form.value.frmIdentificador,
      motivo: '',
      porcentajeAvance: 0,
      estado: true,
      // areaSolicitante: this.form.value.frmAreaSolicitante,
      areaSolicitante: solicitante,
      // areaReceptor: this.form.value.frmAreaReceptora,
      areaReceptor: receptor,
      tipoIngreso: t,
      estadoRequerimiento: e,
      // estadoRequerimiento: this.form.value.frmMedio,
      poi: null,
      // tarea: null,
    };

  }

}
