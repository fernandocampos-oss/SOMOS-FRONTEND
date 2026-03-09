import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

export interface RegistrarFormatoData {
  trabajador: any;
  idVotante: number;
  idVotanteEvaluador: number;
  nombreCompleto: string;
  periodo: string;
}

@Component({
  selector: 'app-registrar-formato',
  templateUrl: './registrar-formato.component.html',
  styleUrls: ['./registrar-formato.component.scss']
})
export class RegistrarFormatoComponent implements OnInit {

  asistioReunion: string = '-';
  fechaReunion: string = '';
  paso: number = 1; // 1 = pregunta reunión, 2 = confirmación final
  guardando: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RegistrarFormatoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistrarFormatoData,
    private _grService: GestionRendimientoService
  ) { }

  ngOnInit(): void {
  }

  puedeAvanzar(): boolean {
    if (this.asistioReunion === '-') return false;
    if (this.asistioReunion === 'S' && !this.fechaReunion) return false;
    return true;
  }

  avanzarPaso(): void {
    if (this.puedeAvanzar()) {
      this.paso = 2;
    }
  }

  async confirmar(): Promise<void> {
    this.guardando = true;
    try {
      // 1. Obtener o crear el registro de reunión
      const reunion = await this._grService.obtenerOCrearReunionMetas(
        this.data.idVotante,
        this.data.idVotanteEvaluador,
        this.data.periodo
      );

      // 2. Actualizar asistencia
      await this._grService.actualizarAsistenciaReunion(
        reunion.idReunion,
        this.asistioReunion,
        this.asistioReunion === 'S' ? this.fechaReunion : undefined
      );

      // 3. Confirmar la reunión (bloquear edición)
      await this._grService.confirmarReunionMetas(reunion.idReunion);

      this.dialogRef.close({
        confirmado: true,
        huboReunion: this.asistioReunion === 'S',
        fechaReunion: this.asistioReunion === 'S' ? this.fechaReunion : null
      });
    } catch (error) {
      console.error('Error al registrar formato:', error);
      this.guardando = false;
    }
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  volver(): void {
    this.paso = 1;
  }
}
