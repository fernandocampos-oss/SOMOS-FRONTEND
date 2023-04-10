import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { UserSession } from '@data/models';
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
  fechaActual: String = '';

  constructor(private _authService: AuthService) {}

  ngOnInit() {
    this.user = this._authService.getUserSession();
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
