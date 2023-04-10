import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AppRoute } from '../data/constants/app-route.constant';
import { MarcacionTrabajadorModule } from '../modules/marcacion-trabajador/marcacion-trabajador.module';
import { DjConflictoInteresComponent } from '../modules/dj-conflicto-interes/dj-conflicto-interes.component';

export const ROUTES: Routes = [
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
      {
        //path: AppRoute.LEGAJO,
        path:AppRoute.DATOS_PERSONALES,
        loadChildren: () =>
          import('../modules/datos-personales/datos-personales.module').then(
            (m) => m.DatosPersonalesModule
          ),
      },
      // Antiguo Home
      // {
      //   //path: AppRoute.LEGAJO,
      //   path:'',
      //   loadChildren: () =>
      //     import('../modules/datos-personales/datos-personales.module').then(
      //       (m) => m.DatosPersonalesModule
      //     ),
      // },
      {
        path: AppRoute.CONTROL_ACCESO,
        loadChildren: () =>
          import(
            '../modules//marcacion/marcacion.module'
          ).then((m) => m.MarcacionModule),
      },
      {
        path: AppRoute.MARCACION_TRABAJADOR,
        loadChildren: () =>
          import(
            '../modules/marcacion-trabajador/marcacion-trabajador.module'
          ).then((m) => m.MarcacionTrabajadorModule),
      },
      {
        path: AppRoute.PANEL_MARCACION,
        loadChildren: () =>
          import('../modules/panel-marcacion/panel-marcacion.module').then(
            (m) => m.PanelMarcacionModule
          ),
      },
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
        path: AppRoute.DDJJ_CONFLICTO,
        loadChildren: () =>
          import('../modules/ddjj-conflictos-interes/ddjj-conflictos-interes.module').then(
            (m) => m.DdjjConflictosInteresModule
          ),
      },
      {
        path: AppRoute.DDJJ_CONFLICTO_OTRO,
        loadChildren: () =>
          import('../modules/dj-conflicto-interes/dj-conflicto-interes.module').then(
            (m) => m.DjConflictoInteresModule
          ),
      },
      {
        path: AppRoute.ADJUNTAR_DOCUMENTOS,
        loadChildren: () =>
          import('../modules/adjuntar-documentos/adjuntar-documentos.module').then(
            (m) => m.AdjuntarDocumentosModule
          ),
      },
      {
        path: AppRoute.MANTENIMIENTOS,
        loadChildren: () =>
          import('../modules/mantenimientos/mantenimientos.module').then(
            (m) => m.MantenimientosModule
          ),
      },
      {
        path: AppRoute.SETTINGS,
        loadChildren: () =>
          import('../modules/configuraciones/configuraciones.module').then(
            (m) => m.ConfiguracionesModule
          ),
      },
      {
        path: AppRoute.MIS_REQUERIMIENTOS,
        loadChildren: () => 
          import('../modules/mis-requerimientos/mis-requerimientos.module').then(
            (m) => m.MisRequerimientosModule
          ),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class LayoutRoutingModule {}
