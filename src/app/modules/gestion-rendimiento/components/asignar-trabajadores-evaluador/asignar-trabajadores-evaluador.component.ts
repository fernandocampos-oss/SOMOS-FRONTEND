import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { AgregarTrabajadorDialogComponent } from './dialogs/agregar-trabajador-dialog/agregar-trabajador-dialog.component';
import { CargaMasivaTrabajadoresDialogComponent } from './dialogs/carga-masiva-trabajadores-dialog/carga-masiva-trabajadores-dialog.component';

interface Evaluador {
  idVotante: number;
  numeroDocumento: string;
  nombreCompleto: string;
  tieneTrabajadores?: boolean;
}

interface Trabajador {
  idEquipo: number;
  idVotante: number;
  numeroDocumento: string;
  nombreCompleto: string;
}

@Component({
  selector: 'app-asignar-trabajadores-evaluador',
  templateUrl: './asignar-trabajadores-evaluador.component.html',
  styleUrls: ['./asignar-trabajadores-evaluador.component.scss']
})
export class AsignarTrabajadoresEvaluadorComponent implements OnInit {

  // Lista de evaluadores
  displayedColumnsEvaluadores: string[] = ['numeroDocumento', 'nombreCompleto', 'cantidadTrabajadores', 'acciones'];
  evaluadores: Evaluador[] = [];
  isLoadingEvaluadores = false;
  filtroEvaluador = '';
  totalElements = 0;
  pageSize = 25;
  currentPage = 0;

  // Evaluador seleccionado y sus trabajadores
  evaluadorSeleccionado: Evaluador | null = null;
  displayedColumnsTrabajadores: string[] = ['numeroDocumento', 'nombreCompleto', 'acciones'];
  trabajadores: Trabajador[] = [];
  dataSourceTrabajadores = new MatTableDataSource<Trabajador>([]);
  isLoadingTrabajadores = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private grService: GestionRendimientoService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.cargarEvaluadores();
  }

  async cargarEvaluadores(): Promise<void> {
    this.isLoadingEvaluadores = true;
    try {
      const response = await this.grService.listarEvaluadores(this.currentPage, this.pageSize, this.filtroEvaluador, false);
      this.evaluadores = response.content || [];
      this.totalElements = response.totalElements || 0;
    } catch (error) {
      console.error('Error al cargar evaluadores:', error);
      this.notification.error('Error al cargar la lista de evaluadores');
    } finally {
      this.isLoadingEvaluadores = false;
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarEvaluadores();
  }

  buscarEvaluador(): void {
    this.currentPage = 0;
    this.cargarEvaluadores();
  }

  limpiarFiltroEvaluador(): void {
    this.filtroEvaluador = '';
    this.currentPage = 0;
    this.cargarEvaluadores();
  }

  async seleccionarEvaluador(evaluador: Evaluador): Promise<void> {
    this.evaluadorSeleccionado = evaluador;
    await this.cargarTrabajadores();
  }

  async cargarTrabajadores(): Promise<void> {
    if (!this.evaluadorSeleccionado) return;
    
    this.isLoadingTrabajadores = true;
    try {
      this.trabajadores = await this.grService.listarTrabajadoresPorEvaluador(this.evaluadorSeleccionado.idVotante);
      this.dataSourceTrabajadores.data = this.trabajadores;
    } catch (error) {
      console.error('Error al cargar trabajadores:', error);
      this.notification.error('Error al cargar trabajadores');
    } finally {
      this.isLoadingTrabajadores = false;
    }
  }

  volverAListaEvaluadores(): void {
    this.evaluadorSeleccionado = null;
    this.trabajadores = [];
    this.dataSourceTrabajadores.data = [];
  }

  abrirDialogAgregarTrabajador(): void {
    if (!this.evaluadorSeleccionado) return;

    const dialogRef = this.dialog.open(AgregarTrabajadorDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { evaluador: this.evaluadorSeleccionado }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarTrabajadores();
        this.cargarEvaluadores(); // Actualizar contador
      }
    });
  }

  abrirDialogCargaMasiva(): void {
    const dialogRef = this.dialog.open(CargaMasivaTrabajadoresDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.evaluadorSeleccionado) {
          this.cargarTrabajadores();
        }
        this.cargarEvaluadores();
      }
    });
  }

  quitarTrabajador(trabajador: Trabajador): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar desasignación',
        mensaje: `¿Está seguro de quitar a ${trabajador.nombreCompleto} (${trabajador.numeroDocumento}) de este evaluador?`
      }
    });

    dialogRef.afterClosed().subscribe(async (confirmado: boolean) => {
      if (confirmado) {
        try {
          await this.grService.desasignarTrabajador(trabajador.idEquipo);
          this.notification.success('Trabajador desasignado correctamente');
          this.cargarTrabajadores();
          this.cargarEvaluadores();
        } catch (error) {
          console.error('Error al desasignar trabajador:', error);
          this.notification.error('Error al desasignar trabajador');
        }
      }
    });
  }
}
