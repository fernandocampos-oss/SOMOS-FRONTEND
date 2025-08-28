import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { UserSession } from '@data/models';
import { UsuarioService } from '@data/services';
import { AuthService } from '@data/services/auth.service';
import { ExportExcelPanelInformativoService } from '@data/services/excel-export-services/export-excel-panel-informativo.service';
import { ReglamentoService } from '@data/services/reglamento.service';

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
  activaReporte: boolean = false;
  numDoc: string;

  constructor(private _authService: AuthService,
    private _userService: UsuarioService,
    private responsive: BreakpointObserver,
    private excelPanelService: ExportExcelPanelInformativoService,
    private _reglamentoService: ReglamentoService,
  ) { }

  ngOnInit() {
    this.responsive.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.XSmall,
    ])
      .subscribe(result => {

        this.hideDate = false;

        if (result.matches) {
          this.hideDate = true;
        }

      });
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe((data) => {
      this.nombre = `${data.nombres} ${data.apellidos}`;
      this.correo = data.correo;

      if (data.numeroDocumento.trim() === "42138652") {
        this.activaReporte = true;
      }
      if (data.numeroDocumento.trim() === "25838607") {
        this.activaReporte = true;
      }

    });
    this.setFechaActual();
  }

  logout() {
    this._authService.logout();
    sessionStorage.removeItem("_roles");
  }

  setFechaActual() {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const date = new Date();
    const nombreDia = dias[date.getDay()];
    let dia = date.getDate();
    let year = date.getFullYear();
    let mes = date.toLocaleDateString("es-ES", { month: 'long' })
    this.fechaActual = nombreDia + ", " + dia + " de " + mes + " de " + year;
  }

  exportExcel() {
    this._reglamentoService.getAll().subscribe((data) => {
      this.excelPanelService.exportExcel(data);
    })
  }
  
}
