import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

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
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.requerimiento = this.data.obj.nombreRequerimiento;
    this.reject = this.data.rechazar;
    if(this.reject == true){
      this.createForm();
    }
  }

  createForm() {
    this.form = this._fb.group({
      frmMotivo: [null, [Validators.required]]
    });
  }
  aprobarReq(){
    this.data.obj.estado = 'APROBADO';
  }
  rechazarReq(){
    this.data.obj.estado = 'RECHAZADO';
    this.data.obj.motivo = this.form.value.frmMotivo;
    console.log(this.data.obj.motivo);
  }
}
