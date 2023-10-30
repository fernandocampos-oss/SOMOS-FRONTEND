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
import { Integrante, Lider, LiderEquipoRequest } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
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
  displayedColumns: string[] = ['item', 'numero_documento', 'nombres_persona', 'apellidos_persona', 'fecha_creacion', 'acciones'];

  listEquipo: any[] = [];

  integranteControl = new FormControl('');
  listPersonal = [];
  filteredOptions: Observable<any[]>;
  personalSeleccionadoTmp: any;
  usuarioObtenido: any;

  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
    this.listarPersonalDesdeVotante();

    //filter
    this.filteredOptions = this.integranteControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : (value.nombres + ' ' + value.apellidos)),
        map(nombresCompletos => nombresCompletos ? this._filterPersonal(nombresCompletos) : this.listPersonal.slice())
      );
  }

  async listarPersonalDesdeVotante() {
    let load = await this.services.listarPersonalDesdeVotante().then((data: any) => {
      if (data.length > 0) {
        this.listPersonal = data;
      } else {
        this._notification.warning("Lista de personal vacia");
      }
    });
  }

  private _filterPersonal(value: string) {
    return this.listPersonal.filter(persona => (persona.nombres + ' ' + persona.apellidos).toLowerCase().includes(value.toLowerCase()));
  }
  displayFnPersonal(selectedpersona) {
    return selectedpersona ? (selectedpersona.nombres + ' ' + selectedpersona.apellidos) : undefined;
  }
  onSelectionChangePersonal(event: any) {
    this.personalSeleccionadoTmp = event.option.value;
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

  verRequerimientos(element) {
    const dialogRef: MatDialogRef<UserTaskComponent> = this.dialog.open(UserTaskComponent, {
      disableClose: false,
      width: '70%',
      autoFocus: false,
      data: {
        model: element,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  async loadTable() {
    let listPersonal = await this.services.listarIntegrantesPorLider().then((data) => {
      if (data.length > 0) {
        this.listEquipo = data;
        this.dataSource = new MatTableDataSource(this.listEquipo);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  async agregarIntegrante() {
    if (this.personalSeleccionadoTmp != undefined) {

      // let add = await this.services.findUsuarioByNumeroDocumento(this.personalSeleccionadoTmp.numeroDocumento).then((data: any) => {
      //   if (data != null) {
      //     this.usuarioObtenido = data;
      //   } else {
      //     this._notification.warning("El trabajador no se encuentra registrado como usuario");
      //   }
      // });

      if (this.listEquipo.find(x => x.integrante.idUsuario == Number(this.personalSeleccionadoTmp.idUsuario)) != undefined) {
        this._notification.warning("El integrante ya se encuentra inscrito en tu equipo");
        return;
      } else {
        let liderModel = new Lider();
        liderModel.idUsuario = 0;

        let integranteModel = new Integrante();
        integranteModel.idUsuario = this.personalSeleccionadoTmp.idUsuario;
        // integranteModel.idUsuario = this.usuarioObtenido.idUsuario;

        let liderEquipo = new LiderEquipoRequest();
        liderEquipo.lider = liderModel;
        liderEquipo.integrante = integranteModel;

        let add = await this.services.agregarIntegrante(liderEquipo).then((data: any) => {
          if (data = 1) {
            this._notification.success("El trabajador fue agregado correctamente");
            this.integranteControl.reset('');
            this.personalSeleccionadoTmp = null;
            this.loadTable();
          } else {
            this._notification.warning("Agregar integrante: Se produjo un error");
          }
        });
      }
    } else {
      this._notification.warning('Debe seleccionar un integrante');
    }
  }

  eliminarColaborador(element) {
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

  datosIntegrante(item) {
    const dialogRef: MatDialogRef<EditUserSelectedComponent> = this.dialog.open(EditUserSelectedComponent, {
      disableClose: false,
      width: '60%',
      autoFocus: false,
      data: {
        model: item,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

}
