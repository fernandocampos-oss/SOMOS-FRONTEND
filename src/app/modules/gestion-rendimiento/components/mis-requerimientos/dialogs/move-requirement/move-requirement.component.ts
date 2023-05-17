import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '@core/services';

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
    this.data.obj.estado = 'DERIVADO';
    this.data.obj.gerenciaReceptora = this.form_cambio.value.frmArea;
    console.log(this.data.moreData);
  }
}
