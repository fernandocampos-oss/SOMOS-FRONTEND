import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from '@core/configs';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-edit-user-selected',
  templateUrl: './edit-user-selected.component.html',
  styleUrls: ['./edit-user-selected.component.scss']
})
export class EditUserSelectedComponent implements OnInit {
  minFechaTarea = AppConfig.MAX_FECHA_NACIMIENTO;

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _gestionRendimientoService: GestionRendimientoService,
    private _formBuilder: FormBuilder,
    private responsive: BreakpointObserver,
    private dialogRef: MatDialogRef<EditUserSelectedComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
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
    this.formIntegrante.controls["frmNroDoc"].setValue(this.data.model.integrante.numeroDocumento);
    this.formIntegrante.controls["frmNroDoc"].disable();
    this.formIntegrante.controls["frmCodPlanilla"].setValue(this.data.model.integrante.codigoPlanilla);
    this.formIntegrante.controls["frmCodPlanilla"].disable();
    this.formIntegrante.controls["frmNombres"].setValue(this.data.model.integrante.nombres);
    this.formIntegrante.controls["frmNombres"].disable();
    this.formIntegrante.controls["frmApellidos"].setValue(this.data.model.integrante.apellidos);
    this.formIntegrante.controls["frmApellidos"].disable();
    this.formIntegrante.controls["frmCorreo"].setValue(this.data.model.integrante.correo);
    this.formIntegrante.controls["frmCorreo"].disable();
    this.formIntegrante.controls["frmCelular"].setValue(this.data.model.integrante.numeroCelular);
    this.formIntegrante.controls["frmCelular"].disable();
    this.formIntegrante.controls["frmFecNac"].setValue(this.data.model.integrante.fechaNacimiento);
    this.formIntegrante.controls["frmFecNac"].disable();
    this.formIntegrante.controls["frmCargo"].setValue(this.data.model.integrante.cargo);
    this.formIntegrante.controls["frmCargo"].disable();
    this.formIntegrante.controls["frmUnidad"].setValue(this.data.model.integrante.unidad);
    this.formIntegrante.controls["frmUnidad"].disable();
    if (this.data.enviado) {
      this.formIntegrante.disable();
    }
  }

  cerrar() {
    console.log(1)
    this.dialogRef.close();
  }

}
