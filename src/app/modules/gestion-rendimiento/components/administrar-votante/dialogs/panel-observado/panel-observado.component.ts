import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-panel-observado',
  templateUrl: './panel-observado.component.html',
  styleUrls: ['./panel-observado.component.scss']
})
export class PanelObservadoComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'dni', 'nombres', 'apellidos'];
  listObservados: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.listObservados = this.data.model;
    this.dataSource = new MatTableDataSource(this.listObservados);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
