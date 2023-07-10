import { Injectable } from '@angular/core';

import { AppRoute } from '@data/constants';
import { Role } from '@data/enums';
import { MenuItem } from '@data/models';
import { AuthService } from '@data/services';

const data: MenuItem[] = [
  // {
  //     path: AppRoute.DATOS_PERSONALES,
  //     icon: 'record_voice_over',
  //     label: 'Actualización de datos',
  // },
  {
    icon: 'payment_icon',
    svg : true,
    label: 'Cronograma de Pagos',
    type: 2,
  },
  // {
  //   path: AppRoute.CAMBIAR_CONTRA,
  //   icon: 'https',
  //   label: 'Cambiar Contraseña',
  // },
  {
      path: AppRoute.MIS_MARCACIONES,
      icon: 'marcacion_icon',
      svg : true,
      label: 'Mis Marcaciones',
  },
  // {
  //   path: AppRoute.ADMINISTRAR_USUARIOS,
  //   icon: 'settings',
  //   label: 'Administrar Usuarios',
  //   roles: [Role.ADMIN_CENTRAL, Role.ADMIN_SEDE],
  // },
  // {
  //   icon: 'settings',
  //   label:'Administracion',
  //   type: 3,
  //   roles: [Role.ADMIN_CENTRAL,Role.ADMIN_SEDE],
  //   children:[
  //     {
  //       path: AppRoute.ADMINISTRAR_ENCUESTA,
  //       icon: 'settings',
  //       label: 'Resultados encuesta',
  //       roles: [Role.ADMIN_CENTRAL,Role.ADMIN_SEDE],
  //     },
  //   ]
  // },
  // // // {
  // // //     path: AppRoute.ADMINISTRAR_ENCUESTA,
  // // //     icon: 'settings',
  // // //     label: 'Administrar Resultados Encuesta',
  // // //     roles: [Role.ADMIN_CENTRAL,Role.ADMIN_SEDE],
  // // // },
  // {
  //     path: AppRoute.MARCACION_TRABAJADOR,
  //     icon: 'airplanemode_active',
  //     label: 'Mis vacaciones',
  // },
  // {
  //     path: AppRoute.MIS_REQUERIMIENTOS,
  //     icon: 'payment',
  //     label: 'Mis boletas de pago',
  // },
  // // {
  // //   path: '',
  // //   icon: 'contact_mail',
  // //   label: 'Legajo Personal',
  // // },
  // // {
  // //   path: AppRoute.CONTROL_ACCESO,
  // //   icon: 'check_circle',
  // //   label: 'Control de Acceso'
  // // },
  // // {
  // //   path: AppRoute.MARCACION_TRABAJADOR,
  // //   icon: 'how_to_reg',
  // //   label: 'Marcación para Trabajador',
  // //   roles: [Role.ADMIN_CENTRAL, Role.ADMIN_SEDE],
  // // },
  // {
  //   path: AppRoute.MIS_MARCACIONES,
  //   icon: 'assignment',
  //   label: 'Mis Marcaciones',
  //   roles: [Role.ADMIN_CENTRAL, Role.ADMIN_SEDE],
  // },
  // // {
  // //   path: AppRoute.PANEL_MARCACION,
  // //   icon: 'assignment_turned_in',
  // //   label: 'Panel de Marcación',
  // //   roles: [Role.ADMIN_CENTRAL, Role.ADMIN_SEDE, Role.CONTROL_ACCESO],
  // // },
  // {
  //   path: AppRoute.MANTENIMIENTOS,
  //   icon: 'widgets',
  //   label: 'Mantenimientos',
  //   roles: [Role.ADMIN_CENTRAL, Role.ADMIN_SEDE],
  // },
  // {
  //   path: AppRoute.SETTINGS,
  //   icon: 'settings',
  //   label: 'Configuraciones',
  //   roles: [Role.ADMIN_CENTRAL, Role.ADMIN_SEDE],
  // },
  // {
  //    path: AppRoute.GESTION_RENDIMIENTO,
  //    icon: 'remote_menu',
  //    svg : true,
  //    label: 'Gestion del Rendimiento',
  //    roles: [Role.ADMIN_CENTRAL, Role.ADMIN_SEDE, Role.TRABAJADOR],
  // },
  // // {
  // //   path : AppRoute.DDJJ_CONFLICTO,
  // //   icon : 'ddjj',
  // //   svg : true,
  // //   label : 'DD.JJ'
  // // }
  // {
  //   path: AppRoute.MIS_REQUERIMIENTOS,
  //   icon: 'description',
  //   label: 'Mis Requerimientos',
  // },
];

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private _authService: AuthService) {}
  getAll() {
    const idRolSession = this._authService.getUserSession().idRol;
    return data.filter(
      (opt) => !opt.roles?.length || opt.roles.includes(idRolSession)
    );
  }
}
