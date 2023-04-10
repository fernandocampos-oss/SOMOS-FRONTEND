import { Component, OnInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';

import { FileUtil } from '@core/utils';
import { TipoQr } from '@data/enums';
import { MarcacionSearchResponse, Programacion } from '@data/models';
import {
  ProgramacionService,
  MarcacionService,
  ReportService,
} from '@data/services';
import { MarcacionRegisterUpdateDialog } from './dialogs/marcacion-register-update/marcacion-register-update.dialog';
import { ProgramacionRegisterUpdateDialog } from './dialogs/programacion-register-update/programacion-register-update.dialog';
import { ColumnDef, ColumnType } from '@shared/table/table.component';
import { NotificationService } from '@core/services';

@UntilDestroy()
@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss'],
})
export class ConfiguracionesComponent implements OnInit {
  programacionList: Programacion[] = [];
  programacionColumns: ColumnDef[] = [
    {
      label: 'Sede',
      name: 'sede',
    },
    {
      label: 'Zona',
      name: 'zona',
    },
    {
      label: 'Descripción',
      name: 'descripcion',
    },
    {
      label: 'Intervalo Actualización (Segundos)',
      name: 'secondRefresh',
    },
    {
      label: 'Fecha Inicio',
      name: 'fechaInicio',
      type: ColumnType.DATETIME,
    },
    {
      label: 'Fecha Fin',
      name: 'fechaFin',
      type: ColumnType.DATETIME,
    },
    {
      label: 'Tipo QR',
      name: 'tipoQr',
    },
    {
      label: 'Marcaciones',
      name: 'cantidadMarcaciones',
    },
  ];

  marcacionList: MarcacionSearchResponse[] = [];
  marcacionColumns: ColumnDef[] = [
    {
      label: 'Sede',
      name: 'sede',
    },
    {
      label: 'Zona',
      name: 'zona',
    },
    {
      label: 'Usuario',
      name: 'usuario',
    },
    {
      label: 'Fecha Marcación',
      name: 'fechaMarcacion',
      type: ColumnType.DATETIME,
    },
    {
      label: 'Tipo Marcación',
      name: 'tipoMarcacion',
    },
  ];

  constructor(
    private _programacionService: ProgramacionService,
    private _marcacionService: MarcacionService,
    private _reportService: ReportService,
    private _notification: NotificationService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._initializeData();
  }

  onCreateProgramacion() {
    this._openAddUpdateDialog(
      ProgramacionRegisterUpdateDialog,
      null,
      this._loadProgramaciones
    );
  }
  filterDownloadFunction(row: Programacion) {
    return row.idTipoQr === TipoQr.IMPRESO;
  }
  filterEditFunction(row: Programacion) {
    return row.cantidadMarcaciones === 0;
  }
  onEditProgramacion(data: Programacion) {
    this._openAddUpdateDialog(
      ProgramacionRegisterUpdateDialog,
      data,
      this._loadProgramaciones
    );
  }
  onDeleteProgramacion(data: Programacion) {
    this._programacionService
      .delete(data.idProgramacion)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._notification.success('Programación eliminada correctamente');
        this._loadProgramaciones();
      });
  }
  onDownload(data: Programacion) {
    this._programacionService
      .descargarQrActual(data.idProgramacion)
      .pipe(untilDestroyed(this))
      .subscribe((bytes) => FileUtil.download(bytes, 'codigo-qr.png'));
  }

  onCreateMarcacion() {
    this._openAddUpdateDialog(
      MarcacionRegisterUpdateDialog,
      null,
      this._loadMarcaciones
    );
  }
  onEditMarcacion(data: MarcacionSearchResponse) {
    this._openAddUpdateDialog(
      MarcacionRegisterUpdateDialog,
      data,
      this._loadMarcaciones
    );
  }
  onDeleteMarcacion(data: MarcacionSearchResponse) {
    this._marcacionService
      .delete(data.idMarcacion)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._notification.success('Marcación eliminada correctamente');
        this._loadMarcaciones();
      });
  }

  onExport() {
    this._reportService
      .getMarcaciones()
      .pipe(untilDestroyed(this))
      .subscribe((data) => FileUtil.download(data, 'marcaciones.xlsx'));
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

  private _loadProgramaciones() {
    this._programacionService
      .search()
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.programacionList = data));
  }

  private _loadMarcaciones() {
    this._marcacionService
      .search({})
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.marcacionList = data));
  }

  private _initializeData() {
    const programaciones$ = this._programacionService.search();
    const marcaciones$ = this._marcacionService.search({});
    forkJoin([programaciones$, marcaciones$])
      .pipe(untilDestroyed(this))
      .subscribe(([programaciones, marcaciones]) => {
        this.programacionList = programaciones;
        this.marcacionList = marcaciones;
      });
  }
}
