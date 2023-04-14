import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { UserSession } from '@data/models';
import { UsuarioService } from '@data/services';
import { AuthService } from '@data/services/auth.service';

@Component({
  selector: 'app-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<void>();
  user: UserSession;
  nombre: string;
  correo: string;
  hideDate = false;
  fechaActual: String = '';

  constructor(private _authService: AuthService,
              private _userService: UsuarioService,
              private responsive  : BreakpointObserver) {}

  ngOnInit() {
    this.responsive.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.XSmall,      
      Breakpoints.TabletLandscape,
      ])
      .subscribe(result => {

        this.hideDate = false; 

        if (result.matches) {
          this.hideDate = true;
        }

  });
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe((data)=>{
      this.nombre = `${data.nombres} ${data.apellidos}`;
      this.correo = data.correo;
    });
    this.setFechaActual();
  }

  logout() {
    this._authService.logout();
  }

  setFechaActual(){
    const dias = [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const date = new Date();
    const nombreDia = dias[date.getDay()];
    let dia = date.getDate();
    let year = date.getFullYear();
    let mes = date.toLocaleDateString("es-ES", {month:'long'})
    this.fechaActual = nombreDia+", "+dia+" de "+mes+" de "+year;
  }
}
