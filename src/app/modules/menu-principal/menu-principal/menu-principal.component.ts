import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowBirthdayComponent } from '../components/show-birthday/show-birthday.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowSstComponent } from '../components/show-sst/show-sst.component';

interface Cumpleaño{
  nombres: string;
  dia: number;
  area_dependencia: string;
}

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss']
})
export class MenuPrincipalComponent implements OnInit {

  today = (new Date()).getDate();
  cumpleanios: Cumpleaño[] = [
    {nombres: "Apolinario Pantoja, Suzety Fresia",dia: 17, area_dependencia: "Órgano de Control Institucional"},
    {nombres: "Bazán Gutierrez, Carlos Alberto",dia: 17, area_dependencia: "Secretaría General"},
    {nombres: "Campos Sanchez, Victor Julio",dia: 17, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Chan Del Pino, Fernando",dia: 17, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Chávez Escobar, Luis Alejandro",dia: 17, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Coloma Estrada, Nancy Rosa",dia: 17, area_dependencia: "Gerencia Central de Seguros y Prestaciones Económicas"},
    {nombres: "Escalón Tuestas, Enrique Benjamín",dia: 17, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Eyzaguirre Aparicio, Renan",dia: 17, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Hinostroza Casano, Betsy Dianna",dia: 17, area_dependencia: "Gerencia Central de Gestión de las Personas"},
    {nombres: "Perez Romero, Orlando Bernabe",dia: 17, area_dependencia: "Gerencia Central de Asesoría Jurídica"},
    {nombres: "Ríos Huarcaya, Maritza Narcisa",dia: 17, area_dependencia: "Programa CEI Modelo"},
    {nombres: "Rodriguez Gutierrez, Juan Manuel",dia: 17, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Rosales Guevara, Luis Junnior",dia: 17, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Saavedra Vitteri, Violeta",dia: 17, area_dependencia: "Gerencia Central de Seguros y Prestaciones Económicas"},
    {nombres: "Calderón Diaz, Zoila",dia: 18, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Camarena Rodriguez, Gina Isabel",dia: 18, area_dependencia: "Gerencia Central de la Persona Adulta Mayor y Persona con Discapacidad"},
    {nombres: "Cancino Linares, Ana Cecilia",dia: 18, area_dependencia: "Gerencia Central de Asesoría Jurídica"},
    {nombres: "Coronado Camargo, Cesar Amadeo",dia: 18, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Cuba Angulo, Gerson Efraín",dia: 18, area_dependencia: "Oficina de Defensa Nacional"},
    {nombres: "Dávila Palomino, Armando Héctor",dia: 18, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Medina Cubas, Yerson Jhonny",dia: 18, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Zela Qquenta, Marisol",dia: 18, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Almora Quispe, Percy Manuel",dia: 19, area_dependencia: "Órgano de Control Institucional"},
    {nombres: "Barreda Jara, Berta Teresa Rafaela",dia: 19, area_dependencia: "Gerencia Central de Seguros y Prestaciones Económicas"},
    {nombres: "Cabanillas Gonzales, Luis Carlos",dia: 19, area_dependencia: "Centro Nacional De Telemedicina - CENATE"},
    {nombres: "Castillo Rodriguez, Juan Pablo",dia: 19, area_dependencia: "Centro Nacional De Telemedicina - CENATE"},
    {nombres: "Cutipa Barrios, Irma Natali",dia: 19, area_dependencia: "Gerencia Central de Asesoría Jurídica"},
    {nombres: "Guerra Lozano, Teresa Carla",dia: 19, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Pinas Mendez, Julio Cesar",dia: 19, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Ponce Robles, Erika",dia: 19, area_dependencia: "Centro Nacional De Telemedicina - CENATE"},
    {nombres: "Rodriguez Manrique, Marel Danitza",dia: 19, area_dependencia: "Gerencia Central de Operaciones"},
    {nombres: "Román Schmitt, Natali Victoria",dia: 19, area_dependencia: "Gerencia Central de Planeamiento y Presupuesto"},
    {nombres: "Schmidt Monteverde, Karin Rita",dia: 19, area_dependencia: "Gerencia Central de Gestión de las Personas"},
    
    
  ]
  constructor(
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    console.log(this.today);
  }

  open(cuadro: number) {
    switch (cuadro) {
      case 1: 
      const dialogRef: MatDialogRef<ShowBirthdayComponent> = this.dialog.open(ShowBirthdayComponent, {
        disableClose: false,
        width: '50%',
        autoFocus: false,
      });
  
      dialogRef.afterClosed().subscribe(result => { });
        break;
      case 2:
      const dialogRef2: MatDialogRef<ShowSstComponent> = this.dialog.open(ShowSstComponent, {
          disableClose: false,
          width: '60%',
          autoFocus: false,
        });
    
        dialogRef2.afterClosed().subscribe(result => { });
          break;
    }
  }
}
