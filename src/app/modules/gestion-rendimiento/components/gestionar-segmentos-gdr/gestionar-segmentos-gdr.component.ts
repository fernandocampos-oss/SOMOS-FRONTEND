import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import * as XLSX from 'xlsx';

interface SegmentoGdr {
  id: number;
  numeroDocumento: string;
  segmento: string;
  fechaCreacion: string;
  fechaModificacion: string;
  editando?: boolean;
  segmentoTemporal?: string;
}

@Component({
  selector: 'app-gestionar-segmentos-gdr',
  templateUrl: './gestionar-segmentos-gdr.component.html',
  styleUrls: ['./gestionar-segmentos-gdr.component.scss']
})
export class GestionarSegmentosGdrComponent implements OnInit {

  dataSource = new MatTableDataSource<SegmentoGdr>([]);
  displayedColumns: string[] = ['numero', 'dni', 'segmento', 'fechaModificacion', 'acciones'];
  
  loading: boolean = false;
  filtroSearch: string = '';
  
  // Form para agregar nuevo
  dniNuevo: string = '';
  segmentoNuevo: string = '';
  
  // Segmentos válidos
  segmentosValidos: string[] = [];
  
  // Carga masiva
  cargandoExcel: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _grService: GestionRendimientoService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarSegmentosValidos();
    this.cargarDatos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async cargarSegmentosValidos() {
    try {
      const response = await this._grService.obtenerSegmentosValidos();
      this.segmentosValidos = Array.isArray(response) ? response : Object.values(response);
    } catch (error) {
      console.error('Error cargando segmentos válidos:', error);
      // Valores por defecto
      this.segmentosValidos = ['Directivo', 'Ejecutor', 'Operador y asistencia', 'Mando medio', 'Funcionario'];
    }
  }

  async cargarDatos() {
    this.loading = true;
    try {
      let response;
      if (this.filtroSearch && this.filtroSearch.trim().length > 0) {
        response = await this._grService.buscarSegmentosGdr(this.filtroSearch.trim());
      } else {
        response = await this._grService.listarSegmentosGdr();
      }
      this.dataSource.data = response || [];
    } catch (error: any) {
      console.error('Error cargando datos:', error);
      if (error.status === 403) {
        this.showMessage('No tiene permisos de Maestro GDR', 'error');
      } else {
        this.showMessage('Error al cargar los datos', 'error');
      }
      this.dataSource.data = [];
    } finally {
      this.loading = false;
    }
  }

  buscar() {
    this.cargarDatos();
  }

  limpiarBusqueda() {
    this.filtroSearch = '';
    this.cargarDatos();
  }

  async agregar() {
    if (!this.dniNuevo || this.dniNuevo.trim().length < 8) {
      this.showMessage('Ingrese un DNI válido (mínimo 8 caracteres)', 'warning');
      return;
    }
    if (!this.segmentoNuevo) {
      this.showMessage('Seleccione un segmento', 'warning');
      return;
    }

    this.loading = true;
    try {
      const response = await this._grService.agregarSegmentoGdr(this.dniNuevo.trim(), this.segmentoNuevo);
      if (response.success) {
        this.showMessage('Segmento agregado exitosamente', 'success');
        this.dniNuevo = '';
        this.segmentoNuevo = '';
        await this.cargarDatos();
      } else {
        this.showMessage(response.error || 'Error al agregar', 'error');
      }
    } catch (error: any) {
      console.error('Error agregando:', error);
      this.showMessage(error.error?.error || 'Error al agregar segmento', 'error');
    } finally {
      this.loading = false;
    }
  }

  // Edición inline
  iniciarEdicion(row: SegmentoGdr) {
    row.editando = true;
    row.segmentoTemporal = row.segmento;
  }

  cancelarEdicion(row: SegmentoGdr) {
    row.editando = false;
    row.segmentoTemporal = undefined;
  }

  async guardarEdicion(row: SegmentoGdr) {
    if (!row.segmentoTemporal) {
      this.showMessage('Seleccione un segmento', 'warning');
      return;
    }

    this.loading = true;
    try {
      const response = await this._grService.actualizarSegmentoGdr(row.numeroDocumento, row.segmentoTemporal);
      if (response.success) {
        row.segmento = row.segmentoTemporal;
        row.editando = false;
        row.segmentoTemporal = undefined;
        this.showMessage('Segmento actualizado exitosamente', 'success');
      } else {
        this.showMessage(response.error || 'Error al actualizar', 'error');
      }
    } catch (error: any) {
      console.error('Error actualizando:', error);
      this.showMessage(error.error?.error || 'Error al actualizar segmento', 'error');
    } finally {
      this.loading = false;
    }
  }

  async eliminar(row: SegmentoGdr) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro de eliminar el segmento del DNI ${row.numeroDocumento}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.loading = true;
        try {
          const response = await this._grService.eliminarSegmentoGdr(row.numeroDocumento);
          if (response.success) {
            this.showMessage('Segmento eliminado exitosamente', 'success');
            await this.cargarDatos();
          } else {
            this.showMessage(response.error || 'Error al eliminar', 'error');
          }
        } catch (error: any) {
          console.error('Error eliminando:', error);
          this.showMessage(error.error?.error || 'Error al eliminar segmento', 'error');
        } finally {
          this.loading = false;
        }
      }
    });
  }

  // Carga masiva Excel
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar extensión
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(extension || '')) {
      this.showMessage('Solo se permiten archivos Excel (.xlsx, .xls)', 'error');
      event.target.value = '';
      return;
    }

    this.cargandoExcel = true;
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Leer datos sin encabezado (2 columnas: DNI, Segmento)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // Convertir a formato esperado
        const registros: { dni: string; segmento: string }[] = [];
        for (const row of jsonData) {
          if (row.length >= 2 && row[0] && row[1]) {
            registros.push({
              dni: String(row[0]).trim(),
              segmento: String(row[1]).trim()
            });
          }
        }

        if (registros.length === 0) {
          this.showMessage('El archivo no contiene datos válidos', 'error');
          return;
        }

        // Enviar al backend
        const response = await this._grService.cargaMasivaSegmentosGdr(registros);
        
        if (response.success) {
          this.showMessage(response.mensaje || 'Carga masiva completada', 'success');
          await this.cargarDatos();
        } else {
          // Mostrar errores
          if (response.errores && response.errores.length > 0) {
            const erroresStr = response.errores.slice(0, 5).join('\n');
            const masErrores = response.errores.length > 5 ? `\n... y ${response.errores.length - 5} errores más` : '';
            this.showMessage(`Errores en carga:\n${erroresStr}${masErrores}`, 'error', 8000);
          } else {
            this.showMessage(response.mensaje || 'Error en carga masiva', 'error');
          }
        }
      } catch (error) {
        console.error('Error procesando Excel:', error);
        this.showMessage('Error al procesar el archivo Excel', 'error');
      } finally {
        this.cargandoExcel = false;
        event.target.value = '';
      }
    };

    reader.readAsArrayBuffer(file);
  }

  descargarPlantilla() {
    // Crear Excel con ejemplo
    const data = [
      ['12345678', 'Directivo'],
      ['87654321', 'Ejecutor'],
      ['11111111', 'Mando medio']
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Segmentos');

    // Descargar
    XLSX.writeFile(wb, 'plantilla_segmentos_gdr.xlsx');
  }

  showMessage(message: string, type: 'success' | 'error' | 'warning', duration: number = 3000) {
    this._snackBar.open(message, 'Cerrar', {
      duration: duration,
      panelClass: type === 'success' ? 'snack-success' : type === 'error' ? 'snack-error' : 'snack-warning'
    });
  }
}
