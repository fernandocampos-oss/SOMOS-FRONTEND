import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import * as XLSX from 'xlsx';

interface EvaluadorPreview {
  fila: number;
  dni: string;
  nombreCompleto: string;
  cargo: string;
  unidad: string;
  regimen: string;
  yaEsEvaluador: boolean;
}

interface ErrorCarga {
  fila: number;
  dni: string;
  mensaje: string;
}

interface ValidacionResponse {
  exito: boolean;
  totalProcesados: number;
  totalExitosos: number;
  totalErrores: number;
  evaluadoresValidos: EvaluadorPreview[];
  errores: ErrorCarga[];
}

@Component({
  selector: 'app-carga-masiva-evaluadores-dialog',
  templateUrl: './carga-masiva-evaluadores-dialog.component.html',
  styleUrls: ['./carga-masiva-evaluadores-dialog.component.scss']
})
export class CargaMasivaEvaluadoresDialogComponent implements OnInit {

  // Estados
  paso: 'seleccion' | 'validando' | 'preview' | 'error' | 'procesando' | 'completado' = 'seleccion';
  
  // Archivo
  nombreArchivo = '';
  dnisExtraidos: string[] = [];
  
  // Validación
  validacionResponse: ValidacionResponse | null = null;
  erroresFormato: ErrorCarga[] = [];
  
  // Columnas para tabla de preview
  displayedColumnsPreview = ['fila', 'dni', 'nombreCompleto', 'unidad', 'estado'];
  displayedColumnsError = ['fila', 'dni', 'mensaje'];

  constructor(
    private dialogRef: MatDialogRef<CargaMasivaEvaluadoresDialogComponent>,
    private grService: GestionRendimientoService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.nombreArchivo = file.name;
    this.erroresFormato = [];
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Leer datos sin header (raw)
        const jsonData = XLSX.utils.sheet_to_json<any>(firstSheet, { header: 1 });
        
        // Extraer DNIs de la columna A
        this.dnisExtraidos = [];
        
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row[0] !== undefined && row[0] !== null && row[0] !== '') {
            const valor = String(row[0]).trim();
            
            // Validar formato
            if (!/^\d+$/.test(valor)) {
              this.erroresFormato.push({
                fila: i + 1,
                dni: valor,
                mensaje: 'La celda contiene caracteres no numéricos'
              });
            } else if (valor.length !== 8) {
              this.erroresFormato.push({
                fila: i + 1,
                dni: valor,
                mensaje: `DNI debe tener 8 dígitos (tiene ${valor.length})`
              });
            } else {
              this.dnisExtraidos.push(valor);
            }
          }
        }
        
        // Si hay errores de formato, mostrar
        if (this.erroresFormato.length > 0) {
          this.paso = 'error';
          return;
        }
        
        // Si no hay DNIs válidos
        if (this.dnisExtraidos.length === 0) {
          this.notification.warning('No se encontraron DNIs válidos en el archivo');
          return;
        }
        
        // Proceder a validar
        this.validarCargaMasiva();
        
      } catch (error) {
        console.error('Error al procesar archivo:', error);
        this.notification.error('Error al procesar el archivo Excel');
      }
    };
    
    reader.readAsArrayBuffer(file);
  }

  async validarCargaMasiva(): Promise<void> {
    this.paso = 'validando';
    
    try {
      const response = await this.grService.validarCargaMasivaEvaluadores(this.dnisExtraidos) as ValidacionResponse;
      this.validacionResponse = response;
      
      if (response.errores && response.errores.length > 0) {
        // Hay errores de validación (DNIs no encontrados, etc)
        this.erroresFormato = response.errores;
        this.paso = 'error';
      } else {
        // Todo OK, mostrar preview
        this.paso = 'preview';
      }
    } catch (error) {
      console.error('Error al validar:', error);
      this.notification.error('Error al validar los datos');
      this.paso = 'seleccion';
    }
  }

  async confirmarCarga(): Promise<void> {
    if (!this.validacionResponse) return;
    
    this.paso = 'procesando';
    
    try {
      const response = await this.grService.confirmarCargaMasivaEvaluadores(this.dnisExtraidos) as ValidacionResponse;
      
      if (response.exito) {
        this.notification.success(`Se agregaron ${response.totalExitosos} evaluadores correctamente`);
        this.dialogRef.close(true);
      } else {
        this.notification.warning(`Proceso completado con ${response.totalErrores} errores`);
        this.dialogRef.close(true);
      }
    } catch (error) {
      console.error('Error al confirmar:', error);
      this.notification.error('Error al procesar la carga masiva');
      this.paso = 'preview';
    }
  }

  reiniciar(): void {
    this.paso = 'seleccion';
    this.nombreArchivo = '';
    this.dnisExtraidos = [];
    this.validacionResponse = null;
    this.erroresFormato = [];
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  get totalNuevos(): number {
    if (!this.validacionResponse) return 0;
    return this.validacionResponse.evaluadoresValidos.filter(e => !e.yaEsEvaluador).length;
  }

  get totalYaEvaluadores(): number {
    if (!this.validacionResponse) return 0;
    return this.validacionResponse.evaluadoresValidos.filter(e => e.yaEsEvaluador).length;
  }
}
