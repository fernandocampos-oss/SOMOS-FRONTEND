import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-confirm-accept',
  templateUrl: './confirm-accept.component.html',
  styleUrls: ['./confirm-accept.component.scss']
})
export class ConfirmAcceptComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Actividad POI'];
  objElement: any;
  requerimiento: String = '';
  selectedIndex = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.objElement=this.data.obj;
    this.requerimiento = this.objElement.descripcion;

  }

}
