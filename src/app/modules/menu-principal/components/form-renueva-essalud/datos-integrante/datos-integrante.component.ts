import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '@data/services';

@Component({
  selector: 'app-datos-integrante',
  templateUrl: './datos-integrante.component.html',
  styleUrls: ['./datos-integrante.component.scss']
})
export class DatosIntegranteComponent implements OnInit {

  formIntegrante = this._formBuilder.group({
    frmNroDoc: [''],
    frmCodPlanilla: [''],
    frmNombres: [''],
    frmApellidos: [''],
    frmCorreo: [''],
    frmCelular: [''],
    frmFecNac: [''],
    frmCargo: [''],
  });

  constructor(
    private dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UsuarioService,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.userService.get(this.data.idPer).subscribe((data)=>{
      this.formIntegrante.controls["frmNroDoc"].setValue(data.numeroDocumento);
      this.formIntegrante.controls["frmNroDoc"].disable();
      this.formIntegrante.controls["frmCodPlanilla"].setValue(data.codigoPlanilla);
      this.formIntegrante.controls["frmCodPlanilla"].disable();
      this.formIntegrante.controls["frmNombres"].setValue(data.nombres);
      this.formIntegrante.controls["frmNombres"].disable();
      this.formIntegrante.controls["frmApellidos"].setValue(data.apellidos);
      this.formIntegrante.controls["frmApellidos"].disable();
      this.formIntegrante.controls["frmCorreo"].setValue(data.correo);
      this.formIntegrante.controls["frmCelular"].setValue(data.numeroCelular);
      this.formIntegrante.controls["frmFecNac"].setValue(data.fechaNacimiento);
      this.formIntegrante.controls["frmFecNac"].disable();
      this.formIntegrante.controls["frmCargo"].setValue(data.cargo);
      this.formIntegrante.controls["frmCargo"].disable();
    })
  }

}
