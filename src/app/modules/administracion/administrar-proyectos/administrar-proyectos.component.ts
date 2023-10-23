import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RenuevaEssaludService } from '@data/services/renueva-essalud.service';

@Component({
  selector: 'app-administrar-proyectos',
  templateUrl: './administrar-proyectos.component.html',
  styleUrls: ['./administrar-proyectos.component.scss']
})
export class AdministrarProyectosComponent implements OnInit {

  proyectos: any[] = [];

  displayedColumns: string[] = ['dni', 'nombres', 'cargo', 'celular', 'correo'];

  constructor( private renuevaService       : RenuevaEssaludService,
               private _router              : Router,
               private route                : ActivatedRoute,
               ) { }

  ngOnInit(): void {

    this.renuevaService.getRenuevaReporteProyectos().subscribe((data)=>{
      console.log(data)
      this.proyectos = data.proyectos;
    })
  }


  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }
}
