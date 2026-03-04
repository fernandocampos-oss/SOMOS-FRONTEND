import { Component, OnInit } from '@angular/core';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gestionar-maestros-gdr',
  templateUrl: './gestionar-maestros-gdr.component.html',
  styleUrls: ['./gestionar-maestros-gdr.component.scss']
})
export class GestionarMaestrosGdrComponent implements OnInit {
  
  maestrosGdr: any[] = [];
  loading: boolean = false;
  dniNuevo: string = '';
  dniUsuarioActual: string = '';

  displayedColumns: string[] = ['numero', 'dni', 'estado', 'fechaCreacion', 'acciones'];

  constructor(
    private _grService: GestionRendimientoService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarMaestros();
    this.obtenerDniActual();
  }

  async obtenerDniActual() {
    try {
      const response = await this._grService.esMaestroGdr();
      if (response) {
        this.dniUsuarioActual = response.dni || '';
      }
    } catch (error) {
      console.error('Error obteniendo DNI actual:', error);
    }
  }

  async cargarMaestros() {
    this.loading = true;
    try {
      const response = await this._grService.listarTodosMaestrosGdr();
      this.maestrosGdr = response || [];
    } catch (error) {
      console.error('Error cargando maestros GDR:', error);
      this.showMessage('Error al cargar la lista de Maestros GDR', 'error');
    } finally {
      this.loading = false;
    }
  }

  async agregarMaestro() {
    if (!this.dniNuevo || this.dniNuevo.trim().length < 8) {
      this.showMessage('Ingrese un DNI válido (mínimo 8 caracteres)', 'warning');
      return;
    }

    this.loading = true;
    try {
      const response = await this._grService.agregarMaestroGdr(this.dniNuevo.trim());
      if (response.success) {
        this.showMessage('Maestro GDR agregado exitosamente', 'success');
        this.dniNuevo = '';
        await this.cargarMaestros();
      } else {
        this.showMessage(response.error || 'Error al agregar Maestro GDR', 'error');
      }
    } catch (error: any) {
      console.error('Error agregando maestro:', error);
      this.showMessage(error.error?.error || 'Error al agregar Maestro GDR', 'error');
    } finally {
      this.loading = false;
    }
  }

  async toggleEstado(maestro: any) {
    if (maestro.numeroDocumento === this.dniUsuarioActual) {
      this.showMessage('No puede desactivarse a sí mismo', 'warning');
      return;
    }

    this.loading = true;
    try {
      let response;
      if (maestro.estado) {
        response = await this._grService.desactivarMaestroGdr(maestro.numeroDocumento);
      } else {
        response = await this._grService.activarMaestroGdr(maestro.numeroDocumento);
      }
      
      if (response.success) {
        this.showMessage(`Maestro GDR ${maestro.estado ? 'desactivado' : 'activado'} exitosamente`, 'success');
        await this.cargarMaestros();
      } else {
        this.showMessage(response.error || 'Error al cambiar estado', 'error');
      }
    } catch (error: any) {
      console.error('Error cambiando estado:', error);
      this.showMessage(error.error?.error || 'Error al cambiar estado', 'error');
    } finally {
      this.loading = false;
    }
  }

  esUsuarioActual(dni: string): boolean {
    return dni === this.dniUsuarioActual;
  }

  showMessage(message: string, type: 'success' | 'error' | 'warning') {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'snack-success' : type === 'error' ? 'snack-error' : 'snack-warning'
    });
  }
}
