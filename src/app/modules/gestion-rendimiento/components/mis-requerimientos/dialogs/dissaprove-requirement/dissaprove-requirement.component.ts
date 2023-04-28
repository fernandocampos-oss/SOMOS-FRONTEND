import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dissaprove-requirement',
  templateUrl: './dissaprove-requirement.component.html',
  styleUrls: ['./dissaprove-requirement.component.scss']
})
export class DissaproveRequirementComponent implements OnInit {

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

