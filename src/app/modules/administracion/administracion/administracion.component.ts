import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@data/services';

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
  rol: number;

  respuestas= {
    usuariosActivos: 17,
    idEncuesta: 1,
    descripcion: 'Navidad EsSalud 2023',
    votos: 21,
    encuestaVotaciones: [
        {
            idAlternativa: 1,
            descripcion: 'Tarjetas para canje de alimentos y juguetes',
            votos: 9
        },
        {
            idAlternativa: 2,
            descripcion: 'Abono en cuenta',
            votos: 12
        }
    ]
  };
  // restringir = false;
  // sedes: sede_Demo[] = [
  //   {descripcion:'Todos'},
  //   {descripcion:'Central'},
  //   {descripcion:'INCOR'},
  //   {descripcion:'Salud Renal'},
  // ]
  // gruposPers: grupoPers_Demo[] = [
  //   {descripcion:'Todos'},
  //   {descripcion:'D.L 276'},
  //   {descripcion:'D.L 728'},
  //   {descripcion:'D.L 1057'},
  // ]
  // areasP: areaPers_Demo[] = [
  //   {descripcion:'Todos'},
  //   {descripcion:'Auxiliar'},
  //   {descripcion:'Ejecutivo'},
  //   {descripcion:'Profesional'},
  //   {descripcion:'Técnico'},
  //   {descripcion:'Residente'},
  // ]
  // tiemposServ: tiempoServicio_Demo[] = [
  //   {descripcion:'Todos'},
  //   {descripcion:'Menor a 06 meses'},
  //   {descripcion:'De 06 meses a 1 año'},
  //   {descripcion:'De 1 año 1 día hasta 5 años'},
  //   {descripcion:'De 5 años 1 día hasta 10 años'},
  //   {descripcion:'De 10 años 1 día hasta 15 años'},
  //   {descripcion:'De 15 años 1 día a más'},
  // ]

  // frmSede = new FormControl([''],[Validators.pattern('Todos')]);

  // frmGrupoPers = new FormControl([''],[Validators.pattern('Todos')]);

  // frmAreaPers = new FormControl([''],[Validators.pattern('Todos')]);

  // frmTiempoServ = new FormControl([''],[Validators.pattern('Todos')]);

  constructor(private _router : Router,
              private route   : ActivatedRoute,
              private authService:AuthService) { }

  ngOnInit(): void {
    this.rol = this.authService.getRol();
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
  // restringirFiltros(event){
  //   this.restringir = event.checked;
  //   console.log(this.frmSede, this.frmAreaPers.value, this.frmGrupoPers.value, this.frmTiempoServ.value);
  //   if (this.restringir == true){

  //   }
  // }
}
