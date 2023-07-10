import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-sistemas',
  templateUrl: './show-sistemas.component.html',
  styleUrls: ['./show-sistemas.component.scss']
})
export class ShowSistemasComponent implements OnInit {

  sistemas = [
    {nombre: 'Sistema de Tramite', direccion:'https://ww1.essalud.gob.pe/sgfa/index.php?ingresar=1', imgRuta: 'assets/images/computer.png'},
    {nombre: 'Sistema de Facturacion Eletronica', direccion:'http://facturacion.essalud/facturacion-e/login', imgRuta: 'assets/images/computer.png'},
    {nombre: 'VIVA Interno', direccion:'https://viva.essalud.gob.pe/viva/login', imgRuta: 'assets/images/computer.png'},
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
