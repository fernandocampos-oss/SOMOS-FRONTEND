import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionRendimientoComponent } from './gestion-rendimiento/gestion-rendimiento.component';
import { GestionRendimientoRoutingModule } from './gestion-rendimiento-routing.module'
import { MaterialModule } from '@material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { IndicadoresPendientesJefeComponent } from './components/indicadores-pendientes-jefe/indicadores-pendientes-jefe.component';
import { GestionarIndicadoresTrabajadorComponent } from './components/gestionar-indicadores-trabajador/gestionar-indicadores-trabajador.component';
import { NotificacionCorreoComponent } from './components/gestionar-indicadores-trabajador/dialogs/notificacion-correo/notificacion-correo.component';
import { AsignarIndicadorComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-indicador/asignar-indicador.component';
import { GrEquipoComponent } from './components/gestionar-indicadores-trabajador/dialogs/gr-equipo/gr-equipo.component';
import { AsignarPrioridadComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-prioridad/asignar-prioridad.component';
import { AsignarEvidenciaComponent } from './components/gestionar-indicadores-trabajador/dialogs/asignar-evidencia/asignar-evidencia.component';
import { AlertaPesoComponent } from './components/gestionar-indicadores-trabajador/dialogs/alerta-peso/alerta-peso.component';
import { ReporteUsuarioGdrComponent } from './components/reporte-usuario-gdr/reporte-usuario-gdr.component';
import { BuscarReporteComponent } from './components/buscar-reporte/buscar-reporte.component';
import { VerDatosGdrComponent } from './components/buscar-reporte/dialogs/ver-datos-gdr/ver-datos-gdr.component';
import { EditMasterComponent } from './components/buscar-reporte/dialogs/edit-master/edit-master.component';
import { AdministrarVotanteComponent } from './components/administrar-votante/administrar-votante.component';
import { PanelObservadoComponent } from './components/administrar-votante/dialogs/panel-observado/panel-observado.component';
import { CalificarComponent } from './components/gestionar-indicadores-trabajador/dialogs/calificar/calificar.component';

@NgModule({
  declarations: [
    GestionRendimientoComponent,
    IndicadoresPendientesJefeComponent,
    GestionarIndicadoresTrabajadorComponent,
    NotificacionCorreoComponent,
    AsignarIndicadorComponent,
    GrEquipoComponent,
    AsignarPrioridadComponent,
    CalificarComponent,
    AsignarEvidenciaComponent,
    AlertaPesoComponent,
    ReporteUsuarioGdrComponent,
    BuscarReporteComponent,
    VerDatosGdrComponent,
    EditMasterComponent,
    AdministrarVotanteComponent,
    PanelObservadoComponent
  ],
  imports: [
    CommonModule,
    GestionRendimientoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MatGridListModule,
    NgxExtendedPdfViewerModule,
    FormsModule,
  ]
})
export class GestionRendimientoModule { }
