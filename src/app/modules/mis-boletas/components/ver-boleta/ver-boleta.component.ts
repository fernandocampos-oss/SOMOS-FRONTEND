import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-boleta',
  templateUrl: './ver-boleta.component.html',
  styleUrls: ['./ver-boleta.component.scss']
})
export class VerBoletaComponent implements OnInit {

  pdfBase64: string;
  descripcion: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.pdfBase64 = data.pdfBase64;
    this.descripcion = data.descripcion;
  }

  ngOnInit(): void {
  }

}
