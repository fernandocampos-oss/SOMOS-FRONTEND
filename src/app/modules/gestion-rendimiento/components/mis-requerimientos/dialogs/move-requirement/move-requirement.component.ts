import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService, NotificationService } from '@core/services';
import { ConstantesGr } from '@data/constants/constantes-gr.constant';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-move-requirement',
  templateUrl: './move-requirement.component.html',
  styleUrls: ['./move-requirement.component.scss']
})
export class MoveRequirementComponent implements OnInit {
  selectedIndex = 0;
  form_cambio: FormGroup;
  objElement: any;
  constructor(
    private _dialogService: DialogService,
    private fb: FormBuilder,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form_cambio = this.fb.group({
      frmArea: [null,[Validators.required, Validators.maxLength(30)]],
      frmMotivo: [null,[Validators.required, Validators.maxLength(200)]],
    });
  }

  moveRequirement(){ 
    this.data.obj.motivo = this.form_cambio.value.frmMotivo;
    // this.data.obj.estado = 'DERIVADO';
    this.data.obj.gerenciaReceptor = this.form_cambio.value.frmArea;
    console.log(this.data.moreData);

    this.services.derivarRequerimiento(ConstantesGr.ESTADO_REQUERIMIENTO_DERIVADO, this.data.obj.motivo, this.data.obj.gerenciaReceptor, this.data.obj.idRequerimiento).subscribe(data => {
      if (data) {
        this._notification.success("El Requerimiento fue derivado correctamente");        
      } else {
        this._notification.error("Error al derivar Requerimento")
      }

    });
  }
}
