import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { ConstantesGr } from '@data/constants/constantes-gr.constant';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-accept-reject-requirement',
  templateUrl: './accept-reject-requirement.component.html',
  styleUrls: ['./accept-reject-requirement.component.scss']
})
export class AcceptRejectRequirementComponent implements OnInit {

  requerimiento: String;
  form: FormGroup;
  reject: boolean;

  constructor(
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.requerimiento = this.data.obj.requerimiento.nombre;
    this.reject = this.data.rechazar;
    if (this.reject == true) {
      this.createForm();
    }
  }

  createForm() {
    this.form = this._fb.group({
      frmMotivo: [null, [Validators.required]]
    });
  }

  aprobarRequerimiento() {
    this.services.aprobarRequerimiento(ConstantesGr.ESTADO_REQUERIMIENTO_APROBADO, this.data.obj.idRequerimientoUsuario).subscribe(data => {
      if (data) {
        this._notification.success("Requerimiento aprobado correctamente");
      } else {
        this._notification.error("Error al aprobar requerimento")
      }
    });
  }

  rechazarRequerimiento() {
    this.data.obj.motivo = this.form.value.frmMotivo;
    this.services.rechazarRequerimiento(ConstantesGr.ESTADO_REQUERIMIENTO_RECHAZADO, this.data.obj.motivo, this.data.obj.idRequerimientoUsuario).subscribe(data => {
      if (data) {
        this._notification.success("Requerimiento rechazado");
      } else {
        this._notification.error("Error al rechazar requerimento")
      }
    });

  }

}
