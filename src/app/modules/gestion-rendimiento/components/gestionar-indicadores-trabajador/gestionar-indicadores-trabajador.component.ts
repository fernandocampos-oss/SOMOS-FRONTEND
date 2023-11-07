import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AsignarTareaComponent } from './dialogs/asignar-tarea/asignar-tarea.component';
import { ReadIndicadorTareaComponent } from './dialogs/read-indicador-tarea/read-indicador-tarea.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { NotificationService, SnackbarService } from '@core/services';
import { MiEquipoComponent } from '../mi-equipo/mi-equipo.component';
import { AsignarComponent } from './dialogs/asignar/asignar.component';

@Component({
  selector: 'gestion-rendimiento-gestionar-indicadores-trabajador',
  templateUrl: './gestionar-indicadores-trabajador.component.html',
  styleUrls: ['./gestionar-indicadores-trabajador.component.scss']
})
export class GestionarIndicadoresTrabajadorComponent implements OnInit {
  displayedColumns: string[] = ['item', 'actividad', 'indicador_producto', 'valor_meta', 'peso_total', 'evidencia', 'tipo_formula', 'logro_final', 'puntuacion_meta', 'acciones'];
  // menuToggle = new EventEmitter<void>();
  listIndicadoresPorTrabajadorPrincipal: any[] = [];

  constructor(
    private _dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    private _snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
  }

  async actualizar() {
    this.listIndicadoresPorTrabajadorPrincipal = [];
    let update = await this.loadTable();
    this._snackbar.success("La lista ya se encuentra actualizada");
  }

  async loadTable() {
    let load = await this.services.listarIndicadoresPorTrabajadorPrincipal().then((data: any) => {
      if (data.length > 0) {
        this.listIndicadoresPorTrabajadorPrincipal = data;
        console.log("## #####", this.listIndicadoresPorTrabajadorPrincipal)
      }
    });
  }

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

  registrarTareas(element) {
    if (element.actividad == null || element.actividad == undefined) {
      const dialogRef: MatDialogRef<AsignarTareaComponent> = this._dialog.open(AsignarTareaComponent, {
        disableClose: true,
        width: '50%',
        maxHeight: '810px',
        //height: '780px',
        autoFocus: false,
        data: {
          obj: element
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.loadTable();
      });
    } else {
      const dialogRef: MatDialogRef<AsignarComponent> = this._dialog.open(AsignarComponent, {
        disableClose: true,
        width: '50%',
        maxHeight: '810px',
        //height: '780px',
        autoFocus: false,
        data: {
          obj: element
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.loadTable();
      });
    }
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

  async exportToExcelGR(element) {

  }

}
