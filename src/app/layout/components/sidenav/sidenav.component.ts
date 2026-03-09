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
import { SegmentoVotante } from '@data/enums';
import { InscripcionService } from '@data/services/inscripcion.service';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { PlataformaIntegralService } from '@data/services/plataforma-integral.service';
import { environment } from '@env';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  menuItemList = this._menuService.getAll();
  asignacionesInscripciones = [];
  user: UserSession;
  gerencia: String = '';//Aqui se guarda la gerencia
  dataPersona = Object();
  email: String = '';
  nombre: String = '';
  numDoc: string = '';

  votanteSegmento: number = 0;
  usuarioVotante: any;
  segmentoJefe: number;
  segmentoTrabajador: number;
  evaluador: number;

  activarModuloGr: boolean = environment.moduloGr;
  tienePermisoModuloPlaza: boolean;
  esMaestroGdr: boolean = false;

  constructor(private dialog: MatDialog,
              private _menuService   : MenuService,
              private router         : Router,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer   : DomSanitizer,
              private _authService   : AuthService,
              private _boletaService : BoletaService,
              private _zonaService   : ZonaService,
              private _userService   : UsuarioService,
              private _gestionRendimientoService: GestionRendimientoService,
              private _inscripcionService   : InscripcionService,
              private _plataformaIntegralService: PlataformaIntegralService) {
    this.matIconRegistry.addSvgIcon("remote_menu",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/remote_menu.svg"));
    this.matIconRegistry.addSvgIcon("ddjj",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/ddjj.svg"));
    this.matIconRegistry.addSvgIcon("marcacion_icon",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/carneMarcacionIcon.svg"));
    this.matIconRegistry.addSvgIcon("payment_icon",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/mon_azul_icon.svg"));
    this.matIconRegistry.addSvgIcon("check-access",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/check-access.svg"));
    this.segmentoJefe = SegmentoVotante.DIRECTIVO;
    this.segmentoTrabajador = SegmentoVotante.EJECUTOR;
    this.evaluador = SegmentoVotante.EVALUADOR;
  }

  ngOnInit(): void {
    this._initialize();
    this.user = this._authService.getUserSession();
    // console.log(JSON.parse(localStorage.getItem('RDTHRHRYHNYTN')!))
    this._userService.get(this.user.id).subscribe( data =>{
      this.dataPersona = data;
      // this.email = data.correo;
      // this._zonaService.get(data.idZonaControl).subscribe(info=>{
      //   this.gerencia = info.descripcion;
      // })
      // this.nombre = data.nombres;
      // this.numDoc = data.numeroDocumento;
    })

    this.getSegmentoModuloGR();
    this.validarTienePermisoModuloPlaza('PLAZAS');
    this.verificarEsMaestroGdr();
  }

  private _initialize() {
    this._inscripcionService.getInscripcionesAsignadas().subscribe((data)=>{
      this.asignacionesInscripciones = data;
    })
  }

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

  showEditPerfil(){
    const dialogRef: MatDialogRef<EditUserComponent> = this.dialog.open(EditUserComponent, {
        disableClose: false,
        minWidth: '340px',
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '90vh',
        autoFocus: false,
        data:{
          idUser: this.user.id
        }
      });
    
    dialogRef.afterClosed().subscribe(()=>{
      this._userService.get(this.user.id).subscribe( data =>{
        this.dataPersona = data;
      })
    })
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
      case 'Mis Boletas de Pago':
        this._boletaService.getIfInscritosBoleta().subscribe((data)=>{
          if(data){
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
        })
        break;
    }
  }

  async getSegmentoModuloGR() {
    let load = await this._gestionRendimientoService.getVotanteByIdUsuario().then((data: any) => {
      if (data != null) {
        this.usuarioVotante = data;
        this.votanteSegmento = this.usuarioVotante.idSegmento;
      }
    });
  }

  async verificarEsMaestroGdr() {
    try {
      const response = await this._gestionRendimientoService.esMaestroGdr();
      this.esMaestroGdr = response?.esMaestroGdr || false;
    } catch (error) {
      this.esMaestroGdr = false;
    }
  }

  validarTienePermisoModuloPlaza(modulo: string) {
    this._userService.usuarioTienePermisoModulo(modulo).subscribe((data)=> {
      this.tienePermisoModuloPlaza = data;
    });
  }

  openLinkCAFAE() {
    window.open('https://www.gob.pe/institucion/essalud/campa%C3%B1as/68712-elecciones-cafae-essalud', '_blank');
  }

  openPIGRH() {
    this._plataformaIntegralService.generarToken().subscribe({
      next: (response) => {
        // Construir URL del backend de PIGRH según el ambiente
        const url = new URL(response.urlPlataforma);
        let urlDestino: string;
        
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          // Desarrollo local: backend PIGRH en puerto 3000
          urlDestino = `${url.protocol}//${url.hostname}:3000/api/sso/ingreso`;
        } else if (url.hostname.includes('appsqa')) {
          // Ambiente QA
          urlDestino = 'https://appsqa.essalud.gob.pe/sisprom-v2-service/api/sso/ingreso';
        } else {
          // Producción
          urlDestino = 'https://pigrh.essalud.gob.pe/api/sso/ingreso';
        }
        
        // Crear formulario POST oculto para enviar token de forma segura
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = urlDestino;
        form.target = '_blank';
        
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'token';
        tokenInput.value = response.token;
        
        form.appendChild(tokenInput);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      error: (error) => {
        console.error('Error al generar token para PIGRH:', error);
        alert('Error al conectar con PIGRH. Por favor, intente nuevamente.');
      }
    });
  }
	
}
