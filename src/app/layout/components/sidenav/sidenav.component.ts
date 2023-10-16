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
import { ShowPaymentCalendarComponent } from '@modules/menu-principal/components/show-payment-calendar/show-payment-calendar.component';
import { InscribirseBoletasComponent } from '@modules/mis-boletas/components/inscribirse-boletas/inscribirse-boletas.component';
import { BoletaService } from '@data/services/boleta.service';
import { Router } from '@angular/router';
import { AppRoute } from '@data/constants';

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
  numDoc: string = '';

  constructor(private dialog: MatDialog,
              private _menuService   : MenuService,
              private router         : Router,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer   : DomSanitizer,
              private _authService   : AuthService,
              private _boletaService : BoletaService,
              private _zonaService   : ZonaService,
              private _userService   : UsuarioService) {
    this.matIconRegistry.addSvgIcon("remote_menu",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/remote_menu.svg"));
    this.matIconRegistry.addSvgIcon("ddjj",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/ddjj.svg"));
    this.matIconRegistry.addSvgIcon("marcacion_icon",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/carneMarcacionIcon.svg"));
    this.matIconRegistry.addSvgIcon("payment_icon",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/mon_azul_icon.svg"));
    this.matIconRegistry.addSvgIcon("check-access",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/check-access.svg"));
  }

  ngOnInit(): void {
    this._initialize();
    this.user = this._authService.getUserSession();
    console.log(JSON.parse(localStorage.getItem('RDTHRHRYHNYTN')!))
    this._userService.get(this.user.id).subscribe( data =>{
      this.email = data.correo;
      // this._zonaService.get(data.idZonaControl).subscribe(info=>{
      //   this.gerencia = info.descripcion;
      // })
      this.nombre = data.nombres;
      this.numDoc = data.numeroDocumento;
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
        width: '340px',
        autoFocus: false,
        data:{
          idUser: this.user.id
        }
      });
  
      dialogRef.afterClosed().subscribe(result => { });
  }
  open(option: string){
    switch (option) {
      case 'Cronograma de Pagos':
        const dialogRef: MatDialogRef<ShowPaymentCalendarComponent> = this.dialog.open(ShowPaymentCalendarComponent, {
          disableClose: false,
          minWidth: '350px',
          maxWidth: '50%',
          autoFocus: false,
        });
        break;
      case 'Mis boletas de pago':
          if (this._boletaService.getIfInscritosBoleta(this.numDoc)) {
            this.router.navigate([AppRoute.MIS_BOLETAS]);
          }
          else{
            const dialogRef2: MatDialogRef<InscribirseBoletasComponent> = this.dialog.open(InscribirseBoletasComponent, {
              disableClose: false,
              minWidth: '350px',
              maxWidth: '30%',
              autoFocus: false,
            });
          }
          break;
    }
  }
}
