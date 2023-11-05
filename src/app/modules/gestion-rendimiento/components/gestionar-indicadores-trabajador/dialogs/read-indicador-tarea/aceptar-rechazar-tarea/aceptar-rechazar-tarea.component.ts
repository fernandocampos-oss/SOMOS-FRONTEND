import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-aceptar-rechazar-tarea',
  templateUrl: './aceptar-rechazar-tarea.component.html',
  styleUrls: ['./aceptar-rechazar-tarea.component.scss']
})
export class AceptarRechazarTareaComponent implements OnInit {
  form: FormGroup;
  reject: boolean;

  constructor(
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
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

  // aprobarIndicador() {
  //   this.services.aprobarIndicador(ConstantesGr.ESTADO_REQUERIMIENTO_APROBADO, this.data.model.idIndicadorUsuario).subscribe(data => {
  //     if (data) {
  //       this._notification.success("Indicador / Producto aprobado correctamente");
  //     } else {
  //       this._notification.error("Error al aprobar Indicador / Producto")
  //     }
  //   });
  // }

  // rechazarIndicador() {
  //   this.data.obj.motivo = this.form.value.frmMotivo;
  //   this.services.rechazarIndicador(ConstantesGr.ESTADO_REQUERIMIENTO_RECHAZADO, this.data.obj.motivo, this.data.obj.idRequerimientoUsuario).subscribe(data => {
  //     if (data) {
  //       this._notification.success("Requerimiento rechazado");
  //     } else {
  //       this._notification.error("Error al rechazar requerimento")
  //     }
  //   });
  // }
  

}
