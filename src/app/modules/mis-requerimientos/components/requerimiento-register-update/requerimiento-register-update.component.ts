import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserSession } from '@data/models';
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
  zona: string='';
  constructor(private dialogRef       : MatDialog,
              private _gestionReqService: GestionRendimientoService,
              private _fb: FormBuilder) { 
  }

  ngOnInit(): void {
    this._createForm();

  }
  private _createForm() {
    this.form = this._fb.group({
      frmNombre: [null, [Validators.required]],
      frmDescripcion: [null, [Validators.required]],
      frmTipo: [null, [Validators.required]],
      frmAreaSolicitante: 'SGSA',
      frmAreaReceptora: [null, [Validators.required]],
    });
  }
  submitRequerimiento(){
    // console.log(this._getModel());
    // this._gestionReqService.insertFauxRequerimientos(this._getModel());
    // console.log(this._gestionReqService.FauxTablaRequerimientos());
    // this.dialogRef.closeAll();
  }
  // private _getModel(): Requerimiento{
  //   return {
  //     id: (this._gestionReqService.FauxTablaRequerimientos().length + 1),
  //     nombreRequerimiento: this.form.value.frmNombre,
  //     descripcion: this.form.value.frmDescripcion,
  //     tipoRequerimiento: this.form.value.frmTipo,
  //     gerenciaSolicitante: this.form.value.frmAreaSolicitante,
  //     gerenciaReceptora: this.form.value.frmAreaReceptora,
  //     estado: 'PENDIENTE',
  //   };
  // }
}
