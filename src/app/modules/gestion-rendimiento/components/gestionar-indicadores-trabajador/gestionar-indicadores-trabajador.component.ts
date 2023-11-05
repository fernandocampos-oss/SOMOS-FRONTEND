import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AsignarTareaComponent } from './dialogs/asignar-tarea/asignar-tarea.component';
import { ReadIndicadorTareaComponent } from './dialogs/read-indicador-tarea/read-indicador-tarea.component';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { NotificationService } from '@core/services';
import { MiEquipoComponent } from '../mi-equipo/mi-equipo.component';

@Component({
  selector: 'gestion-rendimiento-gestionar-indicadores-trabajador',
  templateUrl: './gestionar-indicadores-trabajador.component.html',
  styleUrls: ['./gestionar-indicadores-trabajador.component.scss']
})
export class GestionarIndicadoresTrabajadorComponent implements OnInit {
// @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'actividad', 'indicador_producto', 'valor_meta', 'peso_total', 'evidencia', 'tipo_formula', 'logro_final', 'puntuacion_meta', 'acciones'];
  // menuToggle = new EventEmitter<void>();

  // listDataPendientes: any[] = [];
  listIndicadoresPorTrabajador: any[] = [];
  listEquipo: any[] = [];

  constructor(
    private _dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
  }

  async actualizar() {
    this.listEquipo = [];
    let listar = await this.loadTable();
  }

  async loadTable() {
    let listtrabajadores = await this.services.listarIntegrantesPorLider().then((data) => {
      if (data.length > 0) {
        this.listEquipo = data;
        console.log(">>>>>3333", this.listEquipo);
      }
    });
  }

  // async loadTable() {
  //   let listar = await this.services.listarIndicadoresPrincipal().then((data) => {
  //     if (data.length > 0) {
  //       this.listDataPendientes = data;
  //       console.log("<<<<<<<<<<<<<<<", this.listDataPendientes)
  //       // this.dataSource = new MatTableDataSource(this.listDataPendientes);
  //       // this.dataSource.paginator = this.paginator;
  //       // this.dataSource.sort = this.sort;
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

  registrarTareas(element) {
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

  // derivarRequerimiento(element) {
  //   const dialogRef: MatDialogRef<MoveRequirementComponent> = this._dialog.open(MoveRequirementComponent, {
  //     disableClose: false,
  //     width: '35%',
  //     autoFocus: false,
  //     data: {
  //       obj: element,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadTable();
  //   });
  // }

  // nuevoRequerimientoJefe() {
  //   const dialogRef: MatDialogRef<RequerimientoRegisterUpdateComponent> = this._dialog.open(RequerimientoRegisterUpdateComponent, {
  //     disableClose: false,
  //     width: '50%',
  //     //height: '780px',
  //     autoFocus: false,
  //     data: {
  //       esJefe: true,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  // listRequerimientosJefe() {
  //   const dialogRef: MatDialogRef<JefeRequirementComponent> = this._dialog.open(JefeRequirementComponent, {
  //     disableClose: false,
  //     width: '80%',
  //     // height: '680px',
  //     autoFocus: false,
  //     data: {
  //       esJefe: true,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
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

  async listarIndicadoresPorTrabajador(idUsuario: Number) {
    let load = await this.services.listarIndicadoresPorTrabajador(idUsuario).then((data: any) => {
      if (data.length > 0) {
        console.log("## #####", data)
        this.listIndicadoresPorTrabajador = data;
        // this.dataSource = new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      }
    });
  }
 

}
