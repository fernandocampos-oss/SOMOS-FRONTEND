import { element } from 'protractor';
import { startWith, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserAddDeleteComponent } from './dialogs/user-add-delete/user-add-delete.component'
import { UserTaskComponent } from './dialogs/user-task/user-task.component'
import { GestionRendimientoService } from '../../../../data/services/gestion-rendimiento.service'
import { NotificationService } from '@core/services';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { EquipoRequest, Integrante, Jefe } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { EditUserSelectedComponent } from './dialogs/edit-user-selected/edit-user-selected.component';

@Component({
  selector: 'gestion-rendimiento-mi-equipo',
  templateUrl: './mi-equipo.component.html',
  styleUrls: ['./mi-equipo.component.scss']
})
export class MiEquipoComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'trabajador', 'numero_documento', 'fecha_creacion', 'acciones'];

  listEquipo: any[] = [];

  integranteControl = new FormControl('');
  listTrabajador = [];
  filteredOptions: Observable<any[]>;
  trabajadorSeleccionadoTmp: any;
  usuarioObtenido: any;

  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
    this.listarVotantes();

    //filter
    this.filteredOptions = this.integranteControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : (value.nombres + ' ' + value.apellidos)),
        map(nombresCompletos => nombresCompletos ? this._filterTrabajador(nombresCompletos) : this.listTrabajador.slice())
      );
  }

  async listarVotantes() {
    let load = await this.services.listarVotantes().then((data: any) => {
      if (data.length > 0) {
        this.listTrabajador = data;
      } else {
        this._notification.warning("Lista de trabajadores vacia");
      }
    });
  }

  private _filterTrabajador(value: string) {
    return this.listTrabajador.filter(persona => (persona.nombres + ' ' + persona.apellidos).toLowerCase().includes(value.toLowerCase()));
  }
  displayFnTrabajador(selectedtrabajador) {
    return selectedtrabajador ? (selectedtrabajador.nombres + ' ' + selectedtrabajador.apellidos) : undefined;
  }
  onSelectionChangePersonal(event: any) {
    this.trabajadorSeleccionadoTmp = event.option.value;
  }

  showDialogUser(onDelete: boolean) {
    const dialogRef: MatDialogRef<UserAddDeleteComponent> = this.dialog.open(UserAddDeleteComponent, {
      disableClose: false,
      width: onDelete == true ? '600px' : '70%',
      autoFocus: false,
      data: {
        title: (onDelete == true ? 'Eliminar ' : 'Agregar ') + 'integrante',
        borrar: onDelete
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  // verRequerimientos(element) {
  //   const dialogRef: MatDialogRef<UserTaskComponent> = this.dialog.open(UserTaskComponent, {
  //     disableClose: false,
  //     width: '70%',
  //     autoFocus: false,
  //     data: {
  //       model: element,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadTable();
  //   });
  // }

  async loadTable() {
    let listtrabajadores = await this.services.listarIntegrantesPorLider().then((data) => {
      if (data.length > 0) {
        this.listEquipo = data;
        this.dataSource = new MatTableDataSource(this.listEquipo);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  async registrarTrabajador() {
    if (this.trabajadorSeleccionadoTmp != undefined) {
      if (this.listEquipo.find(x => x.integrante.idVotante == Number(this.trabajadorSeleccionadoTmp.idVotante)) != undefined) {
        this._notification.warning("El trabajador ya existe");
        return;
      } else {
        let jefeModel = new Jefe();
        jefeModel.idVotante = 0;

        let integranteModel = new Integrante();
        integranteModel.idVotante = this.trabajadorSeleccionadoTmp.idVotante;

        let equipo = new EquipoRequest();
        equipo.jefe = jefeModel;
        equipo.integrante = integranteModel;

        let add = await this.services.registrarTrabajador(equipo).then((data: any) => {
          if (data = 1) {
            this._notification.success("Trabajador agregado correctamente");
            this.integranteControl.reset('');
            this.trabajadorSeleccionadoTmp = null;
            this.loadTable();
          } else {
            this._notification.warning("Agregar trabajador: Se produjo un error");
          }
        });
      }
    } else {
      this._notification.warning('Debe seleccionar un trabajador');
    }
  }

  eliminarTrabajador(element) {
    const dialogRef: MatDialogRef<DeleteDialogComponent> = this.dialog.open(DeleteDialogComponent, {
      disableClose: false,
      width: '30%',
      autoFocus: false,
      data: {
        // funcion: 3,
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listEquipo = [];
      this.loadTable();
    });
  }

  filter(value: string) {
    this.dataSource.filter = value.trim().toUpperCase();
  }

  // datosTrabajador(element) {
  //   const dialogRef: MatDialogRef<EditUserSelectedComponent> = this.dialog.open(EditUserSelectedComponent, {
  //     disableClose: false,
  //     width: '60%',
  //     autoFocus: false,
  //     data: {
  //       model: element,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadTable();
  //   });
  // }

}
