import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionRendimientoService } from 'src/app/data/services/gestion-rendimiento/gestion-rendimiento.service';
import { NotificationService } from 'src/app/core/services/common/notification.service';

@Component({
  selector: 'app-comentario-dialog',
  templateUrl: './comentario-dialog.component.html',
  styleUrls: ['./comentario-dialog.component.scss']
})
export class ComentarioDialogComponent implements OnInit {

  formComentario: FormGroup;
  modoEdicion: boolean = false;
  cargando: boolean = false;
  esFinal: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ComentarioDialogComponent>,
    private formBuilder: FormBuilder,
    private grService: GestionRendimientoService,
    private notification: NotificationService
  ) {
    this.esFinal = data.esFinal || false;
    this.formComentario = this.formBuilder.group({
      estadoDropdown: [{ value: '', disabled: true }],
      comentarioAdicional: [{ value: '', disabled: true }]
    });
  }

  async ngOnInit() {
    await this.cargarComentario();
  }

  async cargarComentario() {
    this.cargando = true;
    try {
      const comentario = await this.grService.obtenerComentarioEstado(this.data.idEvidencia);
      if (comentario) {
        let estadoValue = comentario.estadoDropdown || '';
        
        // Si es comentario final y tiene prefijo 'final_', quitarlo para mostrarlo
        if (this.esFinal && estadoValue.startsWith('final_')) {
          estadoValue = estadoValue.substring(6);
        }
        
        this.formComentario.patchValue({
          estadoDropdown: estadoValue,
          comentarioAdicional: comentario.comentarioAdicional || ''
        });
      }
    } catch (error) {
      console.log('No hay comentario guardado para esta evidencia o el backend no está disponible');
      this.notification.warning('No se pudo cargar el comentario. Verifica que el backend esté corriendo.');
    } finally {
      this.cargando = false;
    }
  }

  activarEdicion() {
    this.modoEdicion = true;
    this.formComentario.get('estadoDropdown').enable();
    this.formComentario.get('comentarioAdicional').enable();
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.formComentario.get('estadoDropdown').disable();
    this.formComentario.get('comentarioAdicional').disable();
    this.cargarComentario();
  }

  async guardarComentario() {
    if (!this.formComentario.valid) {
      this.notification.warning('Por favor complete los campos requeridos');
      return;
    }

    this.cargando = true;
    try {
      const valores = this.formComentario.value;
      let estadoValue = valores.estadoDropdown;
      
      // Si es comentario final, agregar el prefijo 'final_' antes de guardar
      if (this.esFinal && estadoValue) {
        estadoValue = 'final_' + estadoValue;
      }
      
      await this.grService.guardarComentarioEstado(
        this.data.idEvidencia,
        estadoValue,
        valores.comentarioAdicional
      );
      
      this.notification.success('Comentario guardado exitosamente');
      this.modoEdicion = false;
      this.formComentario.get('estadoDropdown').disable();
      this.formComentario.get('comentarioAdicional').disable();
      this.dialogRef.close({ actualizado: true });
    } catch (error) {
      console.error('Error al guardar comentario:', error);
      this.notification.error('Error al guardar el comentario');
    } finally {
      this.cargando = false;
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
