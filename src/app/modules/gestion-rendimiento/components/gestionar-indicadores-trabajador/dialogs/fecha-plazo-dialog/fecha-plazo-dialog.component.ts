import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionRendimientoService } from 'src/app/data/services/gestion-rendimiento/gestion-rendimiento.service';
import { NotificationService } from 'src/app/core/services/common/notification.service';

@Component({
  selector: 'app-fecha-plazo-dialog',
  templateUrl: './fecha-plazo-dialog.component.html',
  styleUrls: ['./fecha-plazo-dialog.component.scss']
})
export class FechaPlazoDialogComponent implements OnInit {

  formFechaPlazo: FormGroup;
  cargando: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FechaPlazoDialogComponent>,
    private formBuilder: FormBuilder,
    private grService: GestionRendimientoService,
    private notification: NotificationService
  ) {
    this.formFechaPlazo = this.formBuilder.group({
      fechaPlazo: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.cargarFechaPlazo();
  }

  async cargarFechaPlazo() {
    this.cargando = true;
    try {
      const evidenciaTipo = await this.grService.obtenerEvidenciaTipo(this.data.idEvidencia);
      if (evidenciaTipo && evidenciaTipo.fechaPlazo) {
        this.formFechaPlazo.patchValue({
          fechaPlazo: evidenciaTipo.fechaPlazo
        });
      }
    } catch (error) {
      console.log('No hay fecha de plazo guardada o el backend no está disponible');
    } finally {
      this.cargando = false;
    }
  }

  async guardarFechaPlazo() {
    if (!this.formFechaPlazo.valid) {
      this.notification.warning('Por favor seleccione una fecha');
      return;
    }

    this.cargando = true;
    try {
      const valores = this.formFechaPlazo.value;
      
      console.log('Valores del formulario:', valores);
      console.log('Tipo de fechaPlazo:', typeof valores.fechaPlazo);
      console.log('fechaPlazo es Date?', valores.fechaPlazo instanceof Date);
      console.log('Valor de fechaPlazo:', valores.fechaPlazo);
      
      // Validar que hay una fecha seleccionada
      if (!valores.fechaPlazo) {
        this.notification.warning('Por favor seleccione una fecha');
        this.cargando = false;
        return;
      }
      
      // Convertir Date a string en formato ISO (YYYY-MM-DD)
      let fechaStr = '';
      const fecha = valores.fechaPlazo;
      
      if (fecha instanceof Date) {
        // Asegurarse de que la fecha es válida
        if (isNaN(fecha.getTime())) {
          this.notification.warning('Fecha inválida');
          this.cargando = false;
          return;
        }
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        fechaStr = `${year}-${month}-${day}`;
      } else if (typeof fecha === 'string' && fecha.length > 0) {
        // Si ya es string, intentar parsearlo
        fechaStr = fecha;
      } else if (fecha && typeof fecha === 'object' && fecha._d) {
        // Formato Moment.js (por si acaso)
        const d = fecha._d;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        fechaStr = `${year}-${month}-${day}`;
      } else {
        console.error('Formato de fecha no reconocido:', fecha);
        this.notification.warning('Formato de fecha no válido');
        this.cargando = false;
        return;
      }
      
      console.log('Fecha convertida a string:', fechaStr);
      
      // Validar que el string no esté vacío
      if (!fechaStr || fechaStr.trim() === '') {
        this.notification.warning('Fecha inválida - string vacío');
        this.cargando = false;
        return;
      }
      
      console.log('Guardando fecha de plazo:', fechaStr, 'para evidencia:', this.data.idEvidencia, 'indicador:', this.data.idIndicador);
      
      await this.grService.actualizarFechaPlazo(
        this.data.idEvidencia,
        this.data.idIndicador,
        fechaStr
      );
      
      this.notification.success('Fecha de plazo guardada exitosamente');
      this.dialogRef.close({ actualizado: true });
    } catch (error) {
      console.error('Error al guardar fecha de plazo:', error);
      this.notification.error('Error al guardar la fecha de plazo');
    } finally {
      this.cargando = false;
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
