import { Component, OnInit } from '@angular/core';
import { ProgramacionService } from '@data/services/programacion.service';

import { interval, timer } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import * as moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Programacion } from '@data/models';
import { TokenQrService } from '@data/services';
import { TokenQr } from '@data/models';

const INTERVAL_CLOCK_IN_MILISECONDS = 100;
@UntilDestroy()
@Component({
  selector: 'app-panel-marcacion',
  templateUrl: './panel-marcacion.component.html',
  styleUrls: ['./panel-marcacion.component.scss'],
})
export class PanelMarcacionComponent implements OnInit {
  currentDate$ = interval(INTERVAL_CLOCK_IN_MILISECONDS).pipe(
    map(() => new Date())
  );
  programacion: Programacion;
  tokenQr: TokenQr;
  isSameDay = false;
  constructor(
    private _programacionService: ProgramacionService,
    private _tokenQrService: TokenQrService
  ) {}

  ngOnInit(): void {
    this._loadProgramacion();
    console.log("data Programacion1")
  }
  private _loadProgramacion() {
    this._programacionService
      .getActual()
      .pipe(
        untilDestroyed(this),
        filter((x) => x?.secondRefresh > 0)
      )
      .subscribe((data) => {
        this.programacion = data;
        console.log("data Programacion", data)
        this._checkRangeDate(data);
        this._setupQrCode(data);
      });
  }
  private _checkRangeDate(programacion: Programacion) {
    const fechaInicio = moment(programacion.fechaInicio);
    const fechaFin = moment(programacion.fechaFin);
    this.isSameDay = fechaInicio.isSame(fechaFin, 'day');
  }
  private _setupQrCode(data: Programacion) {
    const timer$ = timer(0, data.secondRefresh * 1000).pipe();
    const generarToken$ = this._tokenQrService.generarToken();

    timer$
      .pipe(
        switchMap(() => generarToken$),
        untilDestroyed(this)
      )
      .subscribe((tokenQr) => (this.tokenQr = tokenQr));
  }
}
