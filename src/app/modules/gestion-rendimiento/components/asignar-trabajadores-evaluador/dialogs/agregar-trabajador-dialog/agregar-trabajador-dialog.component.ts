import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

interface Evaluador {
  idVotante: number;
  numeroDocumento: string;
  nombreCompleto: string;
}

interface BusquedaResult {
  encontrado: boolean;
  puedeAsignar?: boolean;
  dni?: string;
  nombreCompleto?: string;
  mensaje?: string;
  evaluadorActual?: string;
}

@Component({
  selector: 'app-agregar-trabajador-dialog',
  templateUrl: './agregar-trabajador-dialog.component.html',
  styleUrls: ['./agregar-trabajador-dialog.component.scss']
})
export class AgregarTrabajadorDialogComponent implements OnInit {

  dni = '';
  resultado: BusquedaResult | null = null;
  isSearching = false;
  isSaving = false;

  constructor(
    private dialogRef: MatDialogRef<AgregarTrabajadorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { evaluador: Evaluador },
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
    this.resultado = null;

    try {
      this.resultado = await this.grService.buscarTrabajadorParaAsignar(
        this.data.evaluador.idVotante, 
        this.dni.trim()
      ) as BusquedaResult;
    } catch (error: any) {
      console.error('Error al buscar:', error);
      this.resultado = {
        encontrado: false,
        mensaje: 'Error al buscar el trabajador'
      };
    } finally {
      this.isSearching = false;
    }
  }

  async confirmarAsignar(): Promise<void> {
    if (!this.resultado || !this.resultado.puedeAsignar) return;

    this.isSaving = true;
    try {
      const result = await this.grService.asignarTrabajador(
        this.data.evaluador.idVotante, 
        this.dni.trim()
      );
      
      if (result.exito) {
        this.notification.success('Trabajador asignado correctamente');
        this.dialogRef.close(true);
      } else {
        this.notification.error(result.mensaje || 'Error al asignar');
      }
    } catch (error: any) {
      console.error('Error al asignar:', error);
      this.notification.error(error.error?.mensaje || 'Error al asignar el trabajador');
    } finally {
      this.isSaving = false;
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  limpiar(): void {
    this.dni = '';
    this.resultado = null;
  }
}
