import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { AgregarEvaluadorDialogComponent } from './dialogs/agregar-evaluador-dialog/agregar-evaluador-dialog.component';
import { CargaMasivaEvaluadoresDialogComponent } from './dialogs/carga-masiva-evaluadores-dialog/carga-masiva-evaluadores-dialog.component';
import { CambiarSegmentoDialogComponent, CambiarSegmentoData } from './dialogs/cambiar-segmento-dialog/cambiar-segmento-dialog.component';

interface Evaluador {
  idVotante: number;
  numeroDocumento: string;
  nombreCompleto: string;
  cargo: string;
  unidad: string;
  regimen: string;
  idSegmento: number;
}

interface Segmento {
  id: number;
  descripcion: string;
}

@Component({
  selector: 'app-gestionar-evaluadores',
  templateUrl: './gestionar-evaluadores.component.html',
  styleUrls: ['./gestionar-evaluadores.component.scss']
})
export class GestionarEvaluadoresComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['numeroDocumento', 'nombreCompleto', 'acciones'];
  dataSource = new MatTableDataSource<Evaluador>([]);
  evaluadores: Evaluador[] = [];
  isLoading = false;
  filtroTexto = '';

  // Paginación servidor
  totalElements = 0;
  pageSize = 50;
  currentPage = 0;
  
  // Filtro solo con trabajadores
  soloConTrabajadores = false;
  totalConTrabajadores = 0;

  segmentos: Segmento[] = [
    { id: 1, descripcion: 'Directivo' },
    { id: 2, descripcion: 'Operador' },
    { id: 3, descripcion: 'Ejecutor' },
    { id: 4, descripcion: 'Mando Medio' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private grService: GestionRendimientoService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.cargarEvaluadores();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async cargarEvaluadores(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.grService.listarEvaluadores(this.currentPage, this.pageSize, this.filtroTexto, this.soloConTrabajadores);
      this.evaluadores = response.content || [];
      this.dataSource.data = this.evaluadores;
      this.totalElements = response.totalElements || 0;
      this.totalConTrabajadores = response.totalConTrabajadores || 0;
    } catch (error) {
      console.error('Error al cargar evaluadores:', error);
      this.notification.error('Error al cargar la lista de evaluadores');
    } finally {
      this.isLoading = false;
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarEvaluadores();
  }

  filtrarTabla(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.filtroTexto = filtro.trim();
  }

  buscarEnServidor(): void {
    this.currentPage = 0; // Resetear a primera página al buscar
    this.cargarEvaluadores();
  }

  limpiarFiltro(): void {
    this.filtroTexto = '';
    this.currentPage = 0;
    this.cargarEvaluadores();
  }

  toggleFiltroConTrabajadores(): void {
    this.soloConTrabajadores = !this.soloConTrabajadores;
    this.currentPage = 0;
    this.cargarEvaluadores();
  }

  abrirDialogAgregar(): void {
    const dialogRef = this.dialog.open(AgregarEvaluadorDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarEvaluadores();
      }
    });
  }

  abrirDialogCargaMasiva(): void {
    const dialogRef = this.dialog.open(CargaMasivaEvaluadoresDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarEvaluadores();
      }
    });
  }

  async exportarExcel(): Promise<void> {
    try {
      const blob = await this.grService.exportarEvaluadoresExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'evaluadores_gdr.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
      this.notification.success('Excel exportado correctamente');
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      this.notification.error('Error al exportar el archivo Excel');
    }
  }

  quitarEvaluador(evaluador: Evaluador): void {
    const data: CambiarSegmentoData = {
      dni: evaluador.numeroDocumento,
      nombre: evaluador.nombreCompleto,
      segmentoActual: evaluador.idSegmento
    };

    const dialogRef = this.dialog.open(CambiarSegmentoDialogComponent, {
      width: '400px',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(async (nuevoSegmento: number | null) => {
      if (nuevoSegmento) {
        try {
          await this.grService.cambiarSegmentoEvaluador(evaluador.idVotante, nuevoSegmento);
          this.notification.success('Segmento actualizado correctamente');
          this.cargarEvaluadores();
        } catch (error) {
          console.error('Error al cambiar segmento:', error);
          this.notification.error('Error al cambiar el segmento');
        }
      }
    });
  }
}
