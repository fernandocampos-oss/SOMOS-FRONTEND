import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { Reglamento } from '@data/models/reglamento/reglamento.model';
import { ReglamentoService } from '@data/services/reglamento.service';

@Component({
  selector: 'app-panel-informativo',
  templateUrl: './panel-informativo.component.html',
  styleUrls: ['./panel-informativo.component.scss']
})
export class PanelInformativoComponent implements OnInit {
  form: FormGroup;
  documentos = [
    {
      id: 1,
      titulo: 'Política de Seguridad y Salud en el Trabajo de EsSalud',
      archivo: 'assets/docs/1_Politica_de_Seguridad_y_Salud_en_el_Trabajo.pdf'
    },
    {
      id: 2,
      titulo: 'Reglamento Interno de Seguridad y Salud en el Trabajo de EsSalud',
      archivo: 'assets/docs/2_Reglamento_Interno_de_Seguridad_y_Salud_en_el_Trabajo.pdf'
    },
    {
      id: 3,
      titulo: 'Recomendaciones de Seguridad y Salud en el Trabajo de EsSalud',
      archivo: 'assets/docs/3_Recomendaciones_de_Seguriad_y_Salud_en_el_Trabajo.pdf'
    }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private fb: FormBuilder,
    private _notification: NotificationService,
    public _dialogRef: MatDialogRef<PanelInformativoComponent>,
    private _reglamentoService: ReglamentoService,
  ) {
    this.form = this.fb.group({
      documentos: this.fb.array(
        this.documentos.map(() => this.fb.control(false, Validators.requiredTrue))
      )
    });
  }

  ngOnInit(): void {
  }

  get documentosFormArray(): FormArray {
    return this.form.get('documentos') as FormArray;
  }

  allChecked(): boolean {
    return this.documentosFormArray.controls.every(control => control.value === true);
  }

  aceptar() {
    const seleccionados = this.documentos
      .filter((_, i) => this.documentosFormArray.at(i).value)
      .map(d => d.id);
    // console.log('IDs seleccionados:', seleccionados);

    if (seleccionados.length !== this.documentos.length) {
      this._notification.warning("Debes aceptar todos los documentos");
      return;
    }

    let reglamento = new Reglamento();
    reglamento.idReglamento = 0;
    if (seleccionados[0] == 1) {
      reglamento.itemPolitica = "Si";
    }
    if (seleccionados[1] == 2) {
      reglamento.itemReglamento = "Si";
    }
    if (seleccionados[2] == 3) {
      reglamento.itemRecomendacion = "Si";
    }
    if (this._data.semestre == 1) {
      reglamento.primerSemestre = 1;
    }
    if (this._data.semestre == 2) {
      reglamento.segundoSemestre = 2;
    }

    this._reglamentoService.save(reglamento).subscribe((data: any) => {
      this._dialogRef.close();
    });

  }

}
