import { Component, OnInit } from '@angular/core';
import { MarcacionService } from '@data/services';
import { ColumnDef, ColumnType } from '@shared/table/table.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-mis-marcaciones',
  templateUrl: './mis-marcaciones.component.html',
  styleUrls: ['./mis-marcaciones.component.scss'],
})
export class MisMarcacionesComponent implements OnInit {
  data = [];
  columns: ColumnDef[] = [
    {
      label: 'Sede',
      name: 'sede',
    },
    {
      label: 'Zona',
      name: 'zona',
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

  constructor(private _marcacionService: MarcacionService) {}

  ngOnInit(): void {
    this._marcacionService
      .searchMisMarcaciones({})
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.data = data));
  }
}
