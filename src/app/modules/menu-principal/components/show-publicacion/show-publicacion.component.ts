import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuPublicacion } from '@data/models/menu-principal/menu-publicacion.model';

@Component({
  selector: 'app-show-publicacion',
  templateUrl: './show-publicacion.component.html',
  styleUrls: ['./show-publicacion.component.scss']
})
export class ShowPublicacionComponent implements OnInit {

  objPublicacion: MenuPublicacion = new MenuPublicacion();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.objPublicacion = this.data.obj;
  }

}
