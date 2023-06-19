import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-publicacion',
  templateUrl: './show-publicacion.component.html',
  styleUrls: ['./show-publicacion.component.scss']
})
export class ShowPublicacionComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    console.log(this.data.obj);
  }

}
