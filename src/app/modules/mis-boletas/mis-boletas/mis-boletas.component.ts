import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@data/services';
import { BoletaService } from '@data/services/boleta.service';

interface Mes{
  num: number;
  descripcion: string;
}

interface Año{
  anio: number;
}

@Component({
  selector: 'app-mis-boletas',
  templateUrl: './mis-boletas.component.html',
  styleUrls: ['./mis-boletas.component.scss']
})
export class MisBoletasComponent implements OnInit {

  @ViewChild('tablaBoletas') tablaBoletas: MatTable<any>;
  @ViewChild('tablaAcciones') tablaAcciones: MatTable<any>;
  today = new Date();

  displayedColumnsBoletas: string[] = ['anio', 'mes', 'regimen', 'tipoBoleta', 'periodo', 'descripcion', 'accion'];
  listBoletas = [{anio: '2023', mes: 'Julio', regimen:'R.L.728 Administrati', tipo:'Mensual', periodo: '2023-07', descripcion:'Boleta Mes de Julio'},
  {anio: '2023', mes: 'Julio', regimen:'R.L.728 Administrati', tipo:'Gratificación', periodo: '2023-07', descripcion:'Boleta Mes de Julio'},];

  displayedColumnsAcciones: string[] = ['periodo', 'descripcion', 'fecha', 'accion'];
  listAcciones = [{periodo: '2023-07', descripcion:'Boleta Mes de Julio', tipo: 'Mensual', fecha:new Date('9/28/2023, 11:00:00'), accion:'Descarga'}];

  form = this._fb.group({
    frmMesElegido: [null],
    frmAnioElegido: [null],
  });

  meses: Mes[] = [
    {num: 1,descripcion: 'Enero'},
    {num: 2,descripcion: 'Febrero'},
    {num: 3,descripcion: 'Marzo'},
    {num: 4,descripcion: 'Abril'},
    {num: 5,descripcion: 'Mayo'},
    {num: 6,descripcion: 'Junio'},
    {num: 7,descripcion: 'Julio'},
    {num: 8,descripcion: 'Agosto'},
    {num: 9,descripcion: 'Setiembre'},
    {num: 10,descripcion: 'Octubre'},
    {num: 11,descripcion: 'Noviembre'},
    {num: 12,descripcion: 'Diciembre'},
  ];
  anios: Año[] = [
    // {anio: 2021},
    // {anio: 2022},
    {anio: 2023},
  ];
  mesElegido: number;
  anioElegido: number;

  constructor(private _router       : Router,
              private _fb           : FormBuilder,
              private authService   : AuthService,
              private boletaService : BoletaService,
              private route         : ActivatedRoute,) { }

  ngOnInit(): void {
    this.form.controls.frmMesElegido.setValue(this.today.getMonth()+1);
    this.form.controls.frmAnioElegido.setValue(this.today.getFullYear());
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }

  Actualizar(){

  }

  desafiliar(){
    this.boletaService.deleteInscritosBoleta(localStorage.getItem('DTGRGHRTHRTERH').split('"')[1])
    this._router.navigate([''], { relativeTo: this.route });
  }
  
  showBoleta(element){
    this.listAcciones.push({
      periodo: element.periodo,
      descripcion: element.descripcion,
      fecha: this.today,
      tipo: element.tipo,
      accion: "Visualización"
    })
    this.tablaAcciones.renderRows();
  }

  downloadBoleta(element){
    this.listAcciones.push({
      periodo: element.periodo,
      descripcion: element.descripcion,
      fecha: this.today,
      tipo: element.tipo,
      accion: "Descarga"
    })
    this.tablaAcciones.renderRows();
  }
}
