import { Component, OnInit, ViewChild } from '@angular/core';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface DashboardAvanceDto {
  codigo: string;
  nombre: string;
  tipo: string;
  totalTrabajadores: number;
  totalIndicadores: number;
  indicadoresCompletados: number;
  evidenciasIniciales: number;
  evidenciasSeguimiento: number;
  evidenciasFinales: number;
  totalEvidencias: number;
  evidenciasSubidas: number;
  conCalificacion: number;
  sinCalificacion: number;
  distinguidos: number;
  porcentajeAvance: number;
  fasePlaneacion: number;
  faseSeguimiento: number;
  faseEvaluacion: number;
  desglose?: DashboardAvanceDto[];
}

interface UnidadOrganizativa {
  codUnidad: string;
  descripcion: string;
}

@Component({
  selector: 'app-dashboard-seguimiento',
  templateUrl: './dashboard-seguimiento.component.html',
  styleUrls: ['./dashboard-seguimiento.component.scss']
})
export class DashboardSeguimientoComponent implements OnInit {

  // Filtros
  anioActual: string = new Date().getFullYear().toString();
  tipoAgrupacion: string = 'PERSONA';
  codUnidadSeleccionada: string = '';
  unidades: UnidadOrganizativa[] = [];

  // Tabla
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<DashboardAvanceDto>([]);
  datos: DashboardAvanceDto[] = [];
  isLoading: boolean = false;

  // Resumen
  totalTrabajadores: number = 0;
  totalIndicadores: number = 0;
  totalIndicadoresCompletados: number = 0;
  promedioAvance: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private grService: GestionRendimientoService
  ) { }

  ngOnInit(): void {
    this.cargarUnidades();
    this.actualizarColumnas();
    this.buscar();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async cargarUnidades(): Promise<void> {
    try {
      const unidades = await this.grService.listAllUnidadOrganizativa() as UnidadOrganizativa[];
      this.unidades = unidades || [];
    } catch (error) {
      console.error('Error al cargar unidades:', error);
      this.unidades = [];
    }
  }

  actualizarColumnas(): void {
    switch (this.tipoAgrupacion) {
      case 'PERSONA':
        this.displayedColumns = ['codigo', 'nombre', 'totalIndicadores', 'indicadoresCompletados', 
                                 'evidenciasIniciales', 'evidenciasFinales', 
                                 'totalEvidencias', 'evidenciasSubidas', 
                                 'fasePlaneacion', 'faseSeguimiento', 'faseEvaluacion', 'porcentajeAvance'];
        break;
      case 'UNIDAD':
      case 'ORGANO':
        this.displayedColumns = ['codigo', 'nombre', 'totalTrabajadores', 'totalIndicadores', 
                                 'indicadoresCompletados', 'evidenciasIniciales', 
                                 'evidenciasFinales', 'totalEvidencias', 'evidenciasSubidas', 
                                 'fasePlaneacion', 'faseSeguimiento', 'faseEvaluacion', 'porcentajeAvance'];
        break;
    }
  }

  onTipoAgrupacionChange(): void {
    this.actualizarColumnas();
    this.buscar();
  }

  async buscar(): Promise<void> {
    this.isLoading = true;
    try {
      const request = {
        anio: this.anioActual,
        tipoAgrupacion: this.tipoAgrupacion,
        codUnidad: this.codUnidadSeleccionada || undefined,
        allRed: true
      };

      this.datos = await this.grService.obtenerDashboardAvance(request);
      this.dataSource.data = this.datos;
      this.calcularResumen();
    } catch (error) {
      console.error('Error al buscar datos del dashboard:', error);
      this.datos = [];
      this.dataSource.data = [];
    } finally {
      this.isLoading = false;
    }
  }

  calcularResumen(): void {
    if (this.tipoAgrupacion === 'PERSONA') {
      this.totalTrabajadores = this.datos.length;
      this.totalIndicadores = this.datos.reduce((sum, d) => sum + (d.totalIndicadores || 0), 0);
      this.totalIndicadoresCompletados = this.datos.reduce((sum, d) => sum + (d.indicadoresCompletados || 0), 0);
      const sumAvance = this.datos.reduce((sum, d) => sum + (d.porcentajeAvance || 0), 0);
      this.promedioAvance = this.datos.length > 0 ? sumAvance / this.datos.length : 0;
    } else {
      this.totalTrabajadores = this.datos.reduce((sum, d) => sum + (d.totalTrabajadores || 0), 0);
      this.totalIndicadores = this.datos.reduce((sum, d) => sum + (d.totalIndicadores || 0), 0);
      this.totalIndicadoresCompletados = this.datos.reduce((sum, d) => sum + (d.indicadoresCompletados || 0), 0);
      const sumAvance = this.datos.reduce((sum, d) => sum + (d.porcentajeAvance || 0), 0);
      this.promedioAvance = this.datos.length > 0 ? sumAvance / this.datos.length : 0;
    }
  }

  async exportarExcel(): Promise<void> {
    this.isLoading = true;
    try {
      const request = {
        anio: this.anioActual,
        tipoAgrupacion: this.tipoAgrupacion,
        codUnidad: this.codUnidadSeleccionada || undefined,
        allRed: true
      };

      const blob = await this.grService.exportarDashboardExcel(request);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard_avance_gdr_${this.anioActual}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
    } finally {
      this.isLoading = false;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAvanceClass(porcentaje: number): string {
    if (porcentaje >= 80) return 'avance-alto';
    if (porcentaje >= 50) return 'avance-medio';
    return 'avance-bajo';
  }
}