import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-evidencia',
  templateUrl: './ver-evidencia.component.html',
  styleUrls: ['./ver-evidencia.component.scss']
})
export class VerEvidenciaComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data.obj);
  }

}
