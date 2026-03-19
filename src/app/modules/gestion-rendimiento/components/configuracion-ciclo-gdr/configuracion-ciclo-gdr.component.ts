import { Component, OnInit } from '@angular/core';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ConfiguracionGdr {
  id: number;
  periodo: string;
  fasePreActiva: boolean;
  fasePlanificacionActiva: boolean;
  faseSeguimientoActiva: boolean;
  faseEvaluacionActiva: boolean;
  fasePostActiva: boolean;
  evidencia1Activa: boolean;
  evidencia2Activa: boolean;
  evidenciaFinalActiva: boolean;
  modificadoPor: string;
  fechaModificacion: string;
}

@Component({
  selector: 'app-configuracion-ciclo-gdr',
  templateUrl: './configuracion-ciclo-gdr.component.html',
  styleUrls: ['./configuracion-ciclo-gdr.component.scss']
})
export class ConfiguracionCicloGdrComponent implements OnInit {

  periodoActual: string = '';
  periodoSeleccionado: string = '';
  periodosDisponibles: string[] = [];
  configuracionGdr: ConfiguracionGdr | null = null;
  loading: boolean = false;

  constructor(
    private _grService: GestionRendimientoService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.inicializarPeriodos();
  }

  inicializarPeriodos() {
    const anioActual = new Date().getFullYear();
    // Generar periodos: año actual -1, actual, +1
    this.periodosDisponibles = [
      (anioActual - 1).toString(),
      anioActual.toString(),
      (anioActual + 1).toString()
    ];
    this.periodoActual = anioActual.toString();
    this.periodoSeleccionado = this.periodoActual;
    this.cargarConfiguracionGdr();
  }

  async cargarConfiguracionGdr() {
    if (!this.periodoSeleccionado) return;
    
    this.loading = true;
    try {
      this.configuracionGdr = await this._grService.obtenerConfiguracionGdr(this.periodoSeleccionado);
    } catch (error) {
      console.error('Error cargando configuración GDR:', error);
      this.showMessage('Error al cargar configuración del ciclo GDR', 'error');
    } finally {
      this.loading = false;
    }
  }

  onPeriodoChange() {
    this.cargarConfiguracionGdr();
  }

  async toggleFase(fase: string) {
    if (!this.configuracionGdr) return;
    
    // Toggle local
    switch (fase) {
      case 'pre':
        this.configuracionGdr.fasePreActiva = !this.configuracionGdr.fasePreActiva;
        break;
      case 'planificacion':
        this.configuracionGdr.fasePlanificacionActiva = !this.configuracionGdr.fasePlanificacionActiva;
        break;
      case 'seguimiento':
        this.configuracionGdr.faseSeguimientoActiva = !this.configuracionGdr.faseSeguimientoActiva;
        break;
      case 'evaluacion':
        this.configuracionGdr.faseEvaluacionActiva = !this.configuracionGdr.faseEvaluacionActiva;
        break;
      case 'post':
        this.configuracionGdr.fasePostActiva = !this.configuracionGdr.fasePostActiva;
        break;
    }

    await this.guardarFases();
  }

  async guardarFases() {
    if (!this.configuracionGdr) return;

    try {
      await this._grService.actualizarFasesGdr(this.periodoSeleccionado, {
        fasePreActiva: this.configuracionGdr.fasePreActiva,
        fasePlanificacionActiva: this.configuracionGdr.fasePlanificacionActiva,
        faseSeguimientoActiva: this.configuracionGdr.faseSeguimientoActiva,
        faseEvaluacionActiva: this.configuracionGdr.faseEvaluacionActiva,
        fasePostActiva: this.configuracionGdr.fasePostActiva
      });
      this.showMessage('Configuración de fases actualizada', 'success');
    } catch (error) {
      console.error('Error actualizando fases:', error);
      this.showMessage('Error al actualizar fases', 'error');
      // Recargar para revertir cambios locales
      await this.cargarConfiguracionGdr();
    }
  }

  async toggleEvidencia(numero: number) {
    if (!this.configuracionGdr) return;
    
    // Toggle local
    switch (numero) {
      case 1:
        this.configuracionGdr.evidencia1Activa = !this.configuracionGdr.evidencia1Activa;
        break;
      case 2:
        this.configuracionGdr.evidencia2Activa = !this.configuracionGdr.evidencia2Activa;
        break;
      case 3:
        this.configuracionGdr.evidenciaFinalActiva = !this.configuracionGdr.evidenciaFinalActiva;
        break;
    }

    await this.guardarEvidencias();
  }

  async guardarEvidencias() {
    if (!this.configuracionGdr) return;

    try {
      await this._grService.actualizarEvidenciasGdr(this.periodoSeleccionado, {
        evidencia1Activa: this.configuracionGdr.evidencia1Activa,
        evidencia2Activa: this.configuracionGdr.evidencia2Activa,
        evidenciaFinalActiva: this.configuracionGdr.evidenciaFinalActiva
      });
      this.showMessage('Configuración de evidencias actualizada', 'success');
    } catch (error) {
      console.error('Error actualizando evidencias:', error);
      this.showMessage('Error al actualizar evidencias', 'error');
      // Recargar para revertir cambios locales
      await this.cargarConfiguracionGdr();
    }
  }

  showMessage(message: string, type: 'success' | 'error' | 'warning') {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'snack-success' : type === 'error' ? 'snack-error' : 'snack-warning'
    });
  }
}
