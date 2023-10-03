import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSession } from '@data/models';
import { inscritosResponse } from '@data/models/inscripcion/inscripcion.model';
import { AuthService } from '@data/services';
import { ExportExcelService } from '@data/services/export-excel.service';
import { InscripcionService } from '@data/services/inscripcion.service';

@Component({
  selector: 'app-administrar-inscripcion',
  templateUrl: './administrar-inscripcion.component.html',
  styleUrls: ['./administrar-inscripcion.component.scss']
})
export class AdministrarInscripcionComponent implements OnInit {

  descripcionInsc: string = '';
  user: UserSession;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<inscritosResponse>;
  listInscritos: inscritosResponse[] = [];
  displayedColumns: string[] = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion'];

  headers = ['DNI','APELLIDOS Y NOMBRE','REG LABORAL','CELULAR','CORREO']
  
  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _authService   : AuthService,
    public _servicerExcel: ExportExcelService,
    private inscripcionService: InscripcionService) { }

  ngOnInit(): void {
    this.user = this._authService.getUserSession();
    this.inscripcionService.getUsuariosInscritos(1).subscribe((data)=>{
      this.descripcionInsc = data.descripcion;
      this.listInscritos = data.inscritos;
      if (data.inscritos.length > 0) {
        this.dataSource = new MatTableDataSource(data.inscritos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource=null;
      }
    })
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  exportar(){
    this._servicerExcel.exportExcel('INSCRIPCIÓN CAMPAÑA DE SALUD FEMENINA', this.headers, this.listInscritos)
  }
}
