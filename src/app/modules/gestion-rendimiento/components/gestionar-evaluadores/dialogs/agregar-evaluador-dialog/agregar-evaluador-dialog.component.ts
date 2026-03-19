import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

interface TrabajadorPreview {
  idVotante?: number;
  numeroDocumento: string;
  nombreCompleto: string;
  cargo: string;
  unidad: string;
  regimen: string;
  idSegmento?: number;
}

@Component({
  selector: 'app-agregar-evaluador-dialog',
  templateUrl: './agregar-evaluador-dialog.component.html',
  styleUrls: ['./agregar-evaluador-dialog.component.scss']
})
export class AgregarEvaluadorDialogComponent implements OnInit {

  dni = '';
  trabajador: TrabajadorPreview | null = null;
  isSearching = false;
  isSaving = false;
  errorBusqueda = '';

  constructor(
    private dialogRef: MatDialogRef<AgregarEvaluadorDialogComponent>,
    private grService: GestionRendimientoService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void { }

  async buscarPorDni(): Promise<void> {
    if (!this.dni || this.dni.trim().length === 0) {
      this.notification.warning('Ingrese un DNI');
      return;
    }

    if (!/^\d{8}$/.test(this.dni.trim())) {
      this.notification.warning('El DNI debe tener 8 dígitos numéricos');
      return;
    }

    this.isSearching = true;
    this.trabajador = null;
    this.errorBusqueda = '';

    try {
      const result = await this.grService.buscarTrabajadorParaEvaluador(this.dni.trim()) as TrabajadorPreview;
      this.trabajador = result;
    } catch (error: any) {
      console.error('Error al buscar:', error);
      if (error.status === 404) {
        this.errorBusqueda = 'No se encontró trabajador con el DNI ingresado';
      } else {
        this.errorBusqueda = 'Error al buscar el trabajador';
      }
    } finally {
      this.isSearching = false;
    }
  }

  get yaEsEvaluador(): boolean {
    return this.trabajador?.idSegmento === 3;
  }

  async confirmarAgregar(): Promise<void> {
    if (!this.trabajador) return;

    this.isSaving = true;
    try {
      await this.grService.agregarEvaluador(this.dni.trim());
      this.notification.success('Evaluador agregado correctamente');
      this.dialogRef.close(true);
    } catch (error: any) {
      console.error('Error al agregar:', error);
      this.notification.error(error.error?.mensaje || 'Error al agregar el evaluador');
    } finally {
      this.isSaving = false;
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  limpiar(): void {
    this.dni = '';
    this.trabajador = null;
    this.errorBusqueda = '';
  }
}
