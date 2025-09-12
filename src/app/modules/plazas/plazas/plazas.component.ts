import { Component, OnInit } from '@angular/core';
import { PlazaService } from '@data/services/plaza.service';
import { Plaza } from '@data/models/plaza/plaza.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSession } from '@data/models';
import { AuthService, UsuarioService } from '@data/services';

@Component({
  selector: 'app-plazas',
  templateUrl: './plazas.component.html',
  styleUrls: ['./plazas.component.scss']
})
export class PlazasComponent implements OnInit {

  user: UserSession;
  plaza: string;
  nombre: string;
  resultado: Plaza | null = null;
  fechaConsulta: Date;
  usuarioConsulta: string;

  constructor(
    private _authService: AuthService,
    private _userService: UsuarioService,
    private _router: Router,
    private route: ActivatedRoute,
    private plazaService: PlazaService
  ) { }

  ngOnInit(): void {
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe( data => {
      this.usuarioConsulta = `${data.nombres} ${data.apellidos} - ${data.numeroDocumento}`;
    });
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
      this.fechaConsulta = new Date();
    });
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }

  imprimir() {
    window.print();
  }

  limpiar() {
    this.resultado = null;
    this.plaza = null;
    this.nombre = null;
  }

}
