import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-datos-integrante',
  templateUrl: './datos-integrante.component.html',
  styleUrls: ['./datos-integrante.component.scss']
})
export class DatosIntegranteComponent implements OnInit {

  distribucionTotal: number = 3;
  distribucionCorreo: number = 2;

  formIntegrante = this._formBuilder.group({
    frmNroDoc: [''],
    frmCodPlanilla: [''],
    frmNombres: [''],
    frmApellidos: [''],
    frmCorreo: [''],
    frmCelular: [''],
    frmFecNac: [''],
    frmCargo: [''],
    frmUnidad: [''],
  });

  constructor(
    private dialogRef: MatDialogRef<DatosIntegranteComponent>,
    private responsive  : BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
     console.log(this.data.integrante)
    this.responsive.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
      ])
      .subscribe(result => {
        this.distribucionTotal = 3;
        this.distribucionCorreo = 2;

        if (result.matches) {
          this.distribucionTotal = 1;
          this.distribucionCorreo = 1;
        }
      });
    this.formIntegrante.controls["frmNroDoc"].setValue(this.data.integrante.numeroDocumento);
    this.formIntegrante.controls["frmNroDoc"].disable();
    this.formIntegrante.controls["frmCodPlanilla"].setValue(this.data.integrante.codigoPlanilla);
    this.formIntegrante.controls["frmCodPlanilla"].disable();
    this.formIntegrante.controls["frmNombres"].setValue(this.data.integrante.nombres);
    this.formIntegrante.controls["frmNombres"].disable();
    this.formIntegrante.controls["frmApellidos"].setValue(this.data.integrante.apellidos);
    this.formIntegrante.controls["frmApellidos"].disable();
    this.formIntegrante.controls["frmCorreo"].setValue(this.data.integrante.correo);
    this.formIntegrante.controls["frmCorreo"].disable();
    this.formIntegrante.controls["frmCelular"].setValue(this.data.integrante.numeroCelular);
    this.formIntegrante.controls["frmFecNac"].setValue(this.data.integrante.fechaNacimiento);
    this.formIntegrante.controls["frmFecNac"].disable();
    this.formIntegrante.controls["frmCargo"].setValue(this.data.integrante.cargo);
    this.formIntegrante.controls["frmCargo"].disable();
    this.formIntegrante.controls["frmUnidad"].setValue(this.data.integrante.unidad);
    this.formIntegrante.controls["frmUnidad"].disable();
    if (this.data.enviado) {
      this.formIntegrante.disable();
    }
  }

  guardar() {
    const resultData = {
      correo: this.formIntegrante.controls["frmCorreo"].value,
      celular: this.formIntegrante.controls["frmCelular"].value
    };
    this.dialogRef.close(resultData);
  }

  cerrar() {
    console.log(1)
    this.dialogRef.close();
  }

}
