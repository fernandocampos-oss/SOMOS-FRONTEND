import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AsignarTareaComponent } from './dialogs/asignar-tarea/asignar-tarea.component';
import { ReadIndicadorTareaComponent } from './dialogs/read-indicador-tarea/read-indicador-tarea.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { NotificationService, SnackbarService } from '@core/services';
import { MiEquipoComponent } from '../mi-equipo/mi-equipo.component';
import { OrganizarIndicadorComponent } from './dialogs/organizar-indicador/organizar-indicador.component';
import { AddPesoComponent } from './dialogs/add-peso/add-peso.component';

@Component({
  selector: 'gestion-rendimiento-gestionar-indicadores-trabajador',
  templateUrl: './gestionar-indicadores-trabajador.component.html',
  styleUrls: ['./gestionar-indicadores-trabajador.component.scss']
})
export class GestionarIndicadoresTrabajadorComponent implements OnInit {
  displayedColumns: string[] = ['item', 'prioridad', 'indicador_producto', 'valor_meta', 'peso_total', 'evidencia', 'tipo_formula', 'logro_final', 'puntuacion_meta', 'acciones'];
  // menuToggle = new EventEmitter<void>();
  listDataTable: any[] = [];

  constructor(
    private _dialog: MatDialog,
    private _requerimientoService: GestionRendimientoService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
  }

  async actualizar() {
    this.listDataTable = [];
    let update = await this.loadTable();
    this._snackbar.success("La lista ya se encuentra actualizada");
  }

  async loadTable() {
    let listPrioridades = await this._requerimientoService.listarPrioridadesPrincipal().then((data) => {
      if (data.length > 0) {
        this.listDataTable = data;
        console.log("onTable", this.listDataTable)
      }
    });
  }

  // async loadTable() {
  //   let load = await this._requerimientoService.listarIndicadoresPorTrabajadorPrincipal().then((data: any) => {
  //     if (data.length > 0) {
  //       this.listIndicadoresPorTrabajadorPrincipal = data;
  //     }
  //   });
  // }

  verIndicadorYtarea(element) {
    const dialogRef: MatDialogRef<ReadIndicadorTareaComponent> = this._dialog.open(ReadIndicadorTareaComponent, {
      disableClose: false,
      width: '70%',
      //height: '780px',
      autoFocus: false,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  registrarTareas(i) {
    console.log("ww", i);
    const dialogRef: MatDialogRef<AsignarTareaComponent> = this._dialog.open(AsignarTareaComponent, {
      disableClose: true,
      width: '50%',
      maxHeight: '810px',
      //height: '780px',
      autoFocus: false,
      data: {
        element: i
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });

  }

  organizarIndicadores() {
    const dialogRef: MatDialogRef<OrganizarIndicadorComponent> = this._dialog.open(OrganizarIndicadorComponent, {
      disableClose: false,
      width: '50%',
      // height: '60%',
      autoFocus: false,
      data: {
        // model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  // aprobarIndicador(element, onDelete: boolean) {
  //   console.log("aprobar", element);
  //   const dialogRef: MatDialogRef<AcceptRejectRequirementComponent> = this._dialog.open(AcceptRejectRequirementComponent, {
  //     disableClose: false,
  //     autoFocus: false,
  //     data: {
  //       model: element,
  //       rechazar: onDelete
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadTable();
  //   });
  // }

  modalMiEquipo() {
    const dialogRef: MatDialogRef<MiEquipoComponent> = this._dialog.open(MiEquipoComponent, {
      disableClose: false,
      width: '60%',
      maxHeight: '80vh',
      autoFocus: false,
      data: {
        // esJefe: false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  async exportToExcelGR() {

  }

  async addPesoIndicador(element) {
    console.log(">>", element);
    const dialogRef: MatDialogRef<AddPesoComponent> = this._dialog.open(AddPesoComponent, {
      disableClose: false,
      width: '15%',
      maxHeight: '100vh',
      autoFocus: false,
      data: {
        modal: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

}
