import { Component, OnInit } from '@angular/core';
import { PlazaService } from '@data/services/plaza.service';
import { Plaza } from '@data/models/plaza/plaza.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-plazas',
  templateUrl: './plazas.component.html',
  styleUrls: ['./plazas.component.scss']
})
export class PlazasComponent implements OnInit {

  plaza: string;
  nombre: string;
  resultado: Plaza | null = null;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private plazaService: PlazaService
  ) { }

  ngOnInit(): void {
  }

  buscarPlaza(){
    if (this.plaza == null) {
      this.plaza = '';
    }
    if (this.nombre == null) {
      this.nombre = '';
    }
    if (this.plaza.trim() === '' && this.nombre.trim() === '') {
      this.resultado = null;
      return;
    }
    this.plazaService.buscarPlaza(this.plaza.trim(), this.nombre.trim()).subscribe(data => {
      this.resultado = data;
    });
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }

}
