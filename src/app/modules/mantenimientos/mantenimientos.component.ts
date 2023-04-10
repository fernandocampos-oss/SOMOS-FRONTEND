import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { NotificationService } from '@core/services';
import { Sede, Zona, Usuario, ZonaSearchResponse } from '@data/models';
import { SedeService, ZonaService, UsuarioService } from '@data/services';
import { Role } from '@data/enums';
import { ColumnDef, ColumnType } from '@shared/table/table.component';
import { ZonaRegisterUpdateDialog } from './dialogs/zona-register-update/zona-register-update.dialog';
import { SedeRegisterUpdateDialog } from './dialogs/sede-register-update/sede-register-update.dialog';
import { UsuarioRegisterUpdateDialog } from './dialogs/usuario-register-update/usuario-register-update.dialog';

@UntilDestroy()
@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.scss'],
})
export class MantenimientosComponent implements OnInit {
  roleAdminCentral = Role.ADMIN_CENTRAL;
  sedeList: Sede[] = [];
  sedeColumns: ColumnDef[] = [
    {
      label: 'Código Terminal SAP',
      name: 'terminalSap',
    },
    {
      label: 'Nombre',
      name: 'descripcion',
    },
  ];

  usuarioList: Usuario[] = [];
  usuarioColumns: ColumnDef[] = [
    {
      label: 'Nro. Documento',
      name: 'numeroDocumento',
    },
    {
      label: 'Cód. Planilla',
      name: 'codigoPlanilla',
    },
    {
      label: 'Nombres',
      name: 'nombres',
    },
    {
      label: 'Apellidos',
      name: 'apellidos',
    },
    {
      label: 'Fecha Nacimiento',
      name: 'fechaNacimiento',
      type: ColumnType.DATE,
    },
  ];

  zonaList: ZonaSearchResponse[] = [];
  zonaColumns: ColumnDef[] = [
    {
      label: 'Nombre',
      name: 'descripcion',
    },
    {
      label: 'Latitud',
      name: 'latitud',
    },
    {
      label: 'Longitud',
      name: 'longitud',
    },
    {
      label: 'Sede',
      name: 'sede',
    },
  ];

  constructor(
    private _sedeService: SedeService,
    private _zonaService: ZonaService,
    private _matDialog: MatDialog,
    private _usuarioService: UsuarioService,
    private _notification: NotificationService
  ) {}

  ngOnInit(): void {
    this._initializeData();
  }

  onCreateSede() {
    this._openAddUpdateDialog(SedeRegisterUpdateDialog, null, this._loadSedes);
  }
  onEditSede(data: Sede) {
    this._openAddUpdateDialog(SedeRegisterUpdateDialog, data, this._loadSedes);
  }
  onDeleteSede(data: Sede) {
    this._sedeService
      .delete(data.idSede)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._notification.success('Sede eliminada correctamente');
        this._loadSedes();
      });
  }

  onCreateZona() {
    this._openAddUpdateDialog(ZonaRegisterUpdateDialog, null, this._loadZonas);
  }
  onEditZona(data: Zona) {
    this._openAddUpdateDialog(ZonaRegisterUpdateDialog, data, this._loadZonas);
  }
  onDeleteZona(data: Zona) {
    this._zonaService
      .delete(data.idZona)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._notification.success('Zona eliminada correctamente');
        this._loadZonas();
      });
  }

  onCreateUsuario() {
    this._openAddUpdateDialog(
      UsuarioRegisterUpdateDialog,
      null,
      this._loadUsuarios
    );
  }
  onEditUsuario(data: Usuario) {
    this._openAddUpdateDialog(
      UsuarioRegisterUpdateDialog,
      data,
      this._loadUsuarios
    );
  }
  onDeleteUsuario(data: Usuario) {
    this._usuarioService
      .delete(data.idUsuario)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._notification.success('Usuario eliminado correctamente');
        this._loadUsuarios();
      });
  }
  // TODO: refactor

  private _openAddUpdateDialog<T>(
    dialog: ComponentType<T>,
    data: any,
    callback: () => void
  ) {
    this._matDialog
      .open(dialog, { data, disableClose: true })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((isSuccess) => isSuccess)
      )
      .subscribe(() => callback.call(this));
  }

  private _loadSedes() {
    this._sedeService
      .search()
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.sedeList = data));
  }

  private _loadUsuarios() {
    this._usuarioService
      .search()
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.usuarioList = data));
  }

  private _loadZonas() {
    this._zonaService
      .search()
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.zonaList = data));
  }

  private _initializeData() {
    const sedes$ = this._sedeService.search();
    const zonas$ = this._zonaService.search();
    const usuarios$ = this._usuarioService.search();
    forkJoin([sedes$, zonas$, usuarios$])
      .pipe(untilDestroyed(this))
      .subscribe(([sedes, zonas, usuarios]) => {
        this.sedeList = sedes;
        this.zonaList = zonas;
        this.usuarioList = usuarios;
      });
  }
}
