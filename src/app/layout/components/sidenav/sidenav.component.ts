import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';

import { MenuService } from '@core/services';
import { UserSession } from '../../../data/models/auth/user-session.model';
import { AuthService } from '../../../data/services/auth.service';
import { UsuarioService } from '../../../data/services/usuario.service';
import { ZonaService } from '@data/services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswComponent } from './change-passw/change-passw/change-passw.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  menuItemList = this._menuService.getAll();
  user: UserSession;
  gerencia: String = '';//Aqui se guarda la gerencia
  email: String = '';
  nombre: String = '';

  constructor(private dialog: MatDialog,
              private _menuService   : MenuService,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer   : DomSanitizer,
              private _authService   : AuthService,
              private _zonaService   : ZonaService,
              private _userService   : UsuarioService) {
    this.matIconRegistry.addSvgIcon("remote_menu",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/remote_menu.svg"));
    this.matIconRegistry.addSvgIcon("ddjj",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/ddjj.svg"));
    this.matIconRegistry.addSvgIcon("check-access",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/check-access.svg"));
  }

  ngOnInit(): void {
    this._initialize();
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe( data =>{
      this.email = data.correo;
      this._zonaService.get(data.idZonaControl).subscribe(info=>{
        this.gerencia = info.descripcion;
      })
      this.nombre = data.nombres;
    })
  }

  private _initialize() {}

  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = false;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  cambiar_contra(){
    const dialogRef: MatDialogRef<ChangePasswComponent> = this.dialog.open(ChangePasswComponent, {
        disableClose: false,
        width: '20%',
        autoFocus: false,
      });
  
      dialogRef.afterClosed().subscribe(result => { });
  }
}
