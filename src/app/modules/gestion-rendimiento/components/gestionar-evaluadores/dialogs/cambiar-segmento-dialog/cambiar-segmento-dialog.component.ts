import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CambiarSegmentoData {
  dni: string;
  nombre: string;
  segmentoActual: number;
}

export interface SegmentoOption {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-cambiar-segmento-dialog',
  templateUrl: './cambiar-segmento-dialog.component.html',
  styleUrls: ['./cambiar-segmento-dialog.component.scss']
})
export class CambiarSegmentoDialogComponent implements OnInit {

  form: FormGroup;
  segmentos: SegmentoOption[] = [
    { id: 1, nombre: 'Directivo' },
    { id: 2, nombre: 'Operador' },
    { id: 4, nombre: 'Mando Medio' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CambiarSegmentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CambiarSegmentoData
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nuevoSegmento: [null, Validators.required]
    });
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  confirmar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.nuevoSegmento);
    }
  }

}
