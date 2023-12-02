import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '@data/services';
import { Role } from '@data/enums';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

@Component({
  selector: 'app-gestion-rendimiento',
  templateUrl: './gestion-rendimiento.component.html',
  styleUrls: ['./gestion-rendimiento.component.scss']
})
export class GestionRendimientoComponent implements OnInit, AfterViewInit {
  trabajador = Role.TRABAJADOR;
  jefe = Role.ADMIN_CENTRAL;
  admin = Role.ADMIN_SEDE;
  rol: number;

  condicionGr: any;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _grService: GestionRendimientoService,
  ) {
    this.rol = this._authService.getRol();
    this.matIconRegistry.addSvgIcon("remote", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/remote.svg"));
  }

  ngOnInit(): void {
    this.getSegmentoModuloGR();
  }

  ngAfterViewInit() {
  }

  async getSegmentoModuloGR() {
    let load = await this._grService.getVotanteByIdUsuario().then((data: any) => {
      if (data) {
        if (data.codCondicion != null) {
          console.log(data)
          this.condicionGr = data.codCondicion;
        }
      }
    });
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

}
