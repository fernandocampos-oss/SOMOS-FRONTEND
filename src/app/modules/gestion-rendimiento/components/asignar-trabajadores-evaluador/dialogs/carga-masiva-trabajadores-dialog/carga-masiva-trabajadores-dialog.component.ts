import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import * as XLSX from 'xlsx';

type Paso = 'instrucciones' | 'archivo' | 'preview' | 'resultado' | 'error';

interface ValidacionItem {
  fila: number;
  dniEvaluador: string;
  dniTrabajador: string;
  nombreEvaluador?: string;
  nombreTrabajador?: string;
  yaAsignado?: boolean;
  evaluadorActual?: string;
  nombreEvaluadorActual?: string;
  mensaje?: string;
}

interface ValidacionResponse {
  totalFilas: number;
  totalValidos: number;
  totalErrores: number;
  validos: ValidacionItem[];
  errores: ValidacionItem[];
}

interface ResultadoCarga {
  totalProcesados: number;
  totalAsignados: number;
  totalYaAsignados: number;
  totalErrores: number;
  exito: boolean;
}

@Component({
  selector: 'app-carga-masiva-trabajadores-dialog',
  templateUrl: './carga-masiva-trabajadores-dialog.component.html',
  styleUrls: ['./carga-masiva-trabajadores-dialog.component.scss']
})
export class CargaMasivaTrabajadoresDialogComponent implements OnInit {

  paso: Paso = 'instrucciones';
  isLoading = false;
  
  // Datos del archivo
  filasParseadas: string[][] = [];
  nombreArchivo = '';
  
  // Validación
  validacionResponse: ValidacionResponse | null = null;
  
  // Resultado
  resultadoCarga: ResultadoCarga | null = null;
  
  // Columnas para tablas
  displayedColumnsPreview = ['fila', 'dniEvaluador', 'nombreEvaluador', 'dniTrabajador', 'nombreTrabajador', 'estado'];
  displayedColumnsError = ['fila', 'dniEvaluador', 'dniTrabajador', 'mensaje'];

  constructor(
    private dialogRef: MatDialogRef<CargaMasivaTrabajadoresDialogComponent>,
    private grService: GestionRendimientoService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void { }

  continuarAArchivo(): void {
    this.paso = 'archivo';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.nombreArchivo = file.name;

    // Validar extensión
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(extension || '')) {
      this.notification.error('Solo se permiten archivos Excel (.xlsx o .xls)');
      return;
    }

    // Leer archivo Excel
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      this.parsearExcel(data);
    };
    reader.readAsArrayBuffer(file);
  }

  parsearExcel(data: Uint8Array): void {
    try {
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convertir a array de arrays (sin encabezados)
      const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Filtrar filas vacías y convertir a strings
      this.filasParseadas = rows
        .filter(row => row && row.length > 0 && row[0])
        .map(row => row.map(cell => String(cell || '').trim()));

      if (this.filasParseadas.length === 0) {
        this.notification.error('El archivo está vacío');
        return;
      }

      // Validar que todas las filas tengan 2 columnas
      const filasInvalidas = this.filasParseadas.filter(f => f.length < 2);
      if (filasInvalidas.length > 0) {
        this.notification.warning(`${filasInvalidas.length} fila(s) no tienen el formato correcto (2 columnas)`);
      }

      this.validarArchivo();
    } catch (error) {
      console.error('Error al parsear Excel:', error);
      this.notification.error('Error al leer el archivo Excel');
    }
  }

  async validarArchivo(): Promise<void> {
    this.isLoading = true;
    try {
      this.validacionResponse = await this.grService.validarCargaMasivaTrabajadores(this.filasParseadas);
      
      if (this.validacionResponse.totalErrores > 0 && this.validacionResponse.totalValidos === 0) {
        this.paso = 'error';
      } else {
        this.paso = 'preview';
      }
    } catch (error) {
      console.error('Error al validar:', error);
      this.notification.error('Error al validar el archivo');
    } finally {
      this.isLoading = false;
    }
  }

  async confirmarCarga(): Promise<void> {
    if (!this.validacionResponse) return;

    this.isLoading = true;
    try {
      this.resultadoCarga = await this.grService.confirmarCargaMasivaTrabajadores(this.filasParseadas);
      this.paso = 'resultado';
      
      if (this.resultadoCarga.exito) {
        this.notification.success('Carga masiva completada correctamente');
      } else if (this.resultadoCarga.totalAsignados > 0) {
        this.notification.warning(`Carga completada con algunos errores. ${this.resultadoCarga.totalAsignados} asignados.`);
      }
    } catch (error) {
      console.error('Error al confirmar:', error);
      this.notification.error('Error al procesar la carga masiva');
    } finally {
      this.isLoading = false;
    }
  }

  volverAInstrucciones(): void {
    this.paso = 'instrucciones';
    this.filasParseadas = [];
    this.nombreArchivo = '';
    this.validacionResponse = null;
    this.resultadoCarga = null;
  }

  get totalNuevosAsignaciones(): number {
    if (!this.validacionResponse) return 0;
    return this.validacionResponse.validos.filter(v => !v.yaAsignado).length;
  }

  cerrar(): void {
    this.dialogRef.close(this.resultadoCarga?.totalAsignados ? true : false);
  }
}
