import { ReportesModule } from './../modules/reportes/reportes.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AppRoute } from '../data/constants/app-route.constant';
import { MenuPrincipalAdminComponent } from '@modules/menu-principal-admin/menu-principal-admin/menu-principal-admin.component';

export const ROUTES: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    children:[
      {
        path: '',
        loadChildren: () =>
        import('../modules/menu-principal-admin/menu-principal-admin.module').then(
        (m) => m.MenuPrincipalAdminModule
        ),
      }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path:'',
        loadChildren: () =>
           import('../modules/menu-principal/menu-principal.module').then(
            (m) => m.MenuPrincipalModule
          ),
      },
      // {
      //   path:AppRoute.DATOS_PERSONALES,
      //   loadChildren: () =>
      //     import('../modules/datos-personales/datos-personales.module').then(
      //       (m) => m.DatosPersonalesModule
      //     ),
      // },
      // Antiguo Home
      // {
      //   //path: AppRoute.LEGAJO,
      //   path:'',
      //   loadChildren: () =>
      //     import('../modules/datos-personales/datos-personales.module').then(
      //       (m) => m.DatosPersonalesModule
      //     ),
      // },
      // {
      //   path: AppRoute.CONTROL_ACCESO,
      //   loadChildren: () =>
      //     import(
      //       '../modules//marcacion/marcacion.module'
      //     ).then((m) => m.MarcacionModule),
      // },
      // {
      //   path: AppRoute.MARCACION_TRABAJADOR,
      //   loadChildren: () =>
      //     import(
      //       '../modules/marcacion-trabajador/marcacion-trabajador.module'
      //     ).then((m) => m.MarcacionTrabajadorModule),
      // },
      // {
      //   path: AppRoute.PANEL_MARCACION,
      //   loadChildren: () =>
      //     import('../modules/panel-marcacion/panel-marcacion.module').then(
      //       (m) => m.PanelMarcacionModule
      //     ),
      // },
      {
        path: AppRoute.MIS_MARCACIONES,
        loadChildren: () =>
          import('../modules/mis-marcaciones/mis-marcaciones.module').then(
            (m) => m.MisMarcacionesModule
          ),
      },
      {
        path: AppRoute.GESTION_RENDIMIENTO,
        loadChildren: () =>
          import('../modules/gestion-rendimiento/gestion-rendimiento.module').then(
            (m) => m.GestionRendimientoModule
          ),
      },
      {
        path: AppRoute.MIS_BOLETAS,
        loadChildren: () =>
          import('../modules/mis-boletas/mis-boletas.module').then(
            (m) => m.MisBoletasModule
          ),
      },
      {
        path: AppRoute.PLAZAS,
        loadChildren: () =>
          import('../modules/plazas/plazas.module').then(
            (m) => m.PlazasModule
          ),
      },
      {
        path: AppRoute.MATERIALES,
        loadChildren: () =>
          import('../modules/materiales/materiales.module').then(
            (m) => m.MaterialesModule
          ),
      },
      // {
      //   path: AppRoute.DDJJ_CONFLICTO,
      //   loadChildren: () =>
      //     import('../modules/ddjj-conflictos-interes/ddjj-conflictos-interes.module').then(
      //       (m) => m.DdjjConflictosInteresModule
      //     ),
      // },
      // {
      //   path: AppRoute.ADJUNTAR_DOCUMENTOS,
      //   loadChildren: () =>
      //     import('../modules/adjuntar-documentos/adjuntar-documentos.module').then(
      //       (m) => m.AdjuntarDocumentosModule
      //     ),
      // },
      // {
      //   path: AppRoute.MANTENIMIENTOS,
      //   loadChildren: () =>
      //     import('../modules/mantenimientos/mantenimientos.module').then(
      //       (m) => m.MantenimientosModule
      //     ),
      // },
      // {
      //   path: AppRoute.SETTINGS,
      //   loadChildren: () =>
      //     import('../modules/configuraciones/configuraciones.module').then(
      //       (m) => m.ConfiguracionesModule
      //     ),
      // },
      {
        path: AppRoute.ADMINISTRACION,
        loadChildren: () =>
          import('../modules/administracion/administracion.module').then(
            (m) => m.AdministracionModule
          ),
      },
      {
        path: AppRoute.ADMINISTRAR_USUARIOS,
        loadChildren: () =>
          import('../modules/administracion/administracion.module').then(
            (m) => m.AdministracionModule
          ),
      },
      {
        path: AppRoute.INDICADORES_TRABAJADORES,
        loadChildren: () => 
          import('../modules/indicadores-trabajador/indicadores-trabajador.module').then(
            (m) => m.IndicadoresTrabajadorModule
          ),
      },
      // {
      //   path: AppRoute.ADMINISTRAR_INSCRIPCIONES,
      //   loadChildren: () =>
      //     import('../modules/administrar-inscripcion/administrar-inscripcion.module').then(
      //       (m) => m.AdministrarInscripcionModule
      //     ),
      // },
      {
        path: AppRoute.ADMINISTRAR_ROL_RED,
        loadChildren: () => 
          import('../modules/administrar-rol-red/administrar-rol-red.module').then(
            (m) => m.AdministrarRolRedModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class LayoutRoutingModule {}
