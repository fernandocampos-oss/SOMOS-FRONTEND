import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface sede_Demo{
  descripcion: string;
}
interface grupoPers_Demo{
  descripcion: string;
}
interface areaPers_Demo{
  descripcion: string;
}
interface tiempoServicio_Demo{
  descripcion: string;
}
@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {

  restringir = false;
  sedes: sede_Demo[] = [
    {descripcion: undefined},
    {descripcion:'Central'},
    {descripcion:'INCOR'},
    {descripcion:'Salud Renal'},
  ]
  gruposPers: grupoPers_Demo[] = [
    {descripcion: undefined},
    {descripcion:'D.L 276'},
    {descripcion:'D.L 728'},
    {descripcion:'D.L 1057'},
  ]
  areasP: areaPers_Demo[] = [
    {descripcion: undefined},
    {descripcion:'Auxiliar'},
    {descripcion:'Ejecutivo'},
    {descripcion:'Profesional'},
    {descripcion:'Técnico'},
    {descripcion:'Residente'},
  ]
  tiemposServ: tiempoServicio_Demo[] = [
    {descripcion: undefined},
    {descripcion:'Menor a 06 meses'},
    {descripcion:'De 06 meses a 1 año'},
    {descripcion:'De 1 año 1 día hasta 5 años'},
    {descripcion:'De 5 años 1 día hasta 10 años'},
    {descripcion:'De 10 años 1 día hasta 15 años'},
    {descripcion:'De 15 años 1 día a más'},
  ]
  constructor(private _router : Router,
              private route   : ActivatedRoute,) { }

  ngOnInit(): void {

  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
  restringirFiltros(event){
    this.restringir = event.checked;
  }
}
