import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services';
import { AuthService } from '@data/services';
import { ExportExcelEncuestasService } from '@data/services/excel-export-services/export-excel-encuestas.service';
import { MenuPrincipalService } from '@data/services/menu-principal.service';

@Component({
  selector: 'app-administrar-encuestas',
  templateUrl: './administrar-encuestas.component.html',
  styleUrls: ['./administrar-encuestas.component.scss']
})
export class AdministrarEncuestasComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;

  encuestaData: any = Object();

  displayedColumns: string[] = ['dni', 'nombres', 'red', 'regimen', 'celular', 'correo', 'eleccion'];

  constructor(private menuServices         : MenuPrincipalService,
              private _router              : Router,
              private authService          : AuthService,
              private notificationService  : NotificationService,
              private route                : ActivatedRoute,
              private excelService         : ExportExcelEncuestasService) { }

  ngOnInit(): void {
    if(this.authService.getUserSession().id == 11511){
      this.menuServices.getReporteEncuesta(1).subscribe((data)=>{
        this.encuestaData = data;
        if(this.encuestaData.usuarios){
          this.dataSource = new MatTableDataSource(this.encuestaData.usuarios);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.dataSource.sort = this.sort;
        }else {
          this.dataSource=null;
        }
        if (this.encuestaData.preguntas.length == 1) {
          this.encuestaData.usuarios.forEach(element => {
            for (let i = 0; i < this.encuestaData.preguntas[0].alternativas.length; i++) {
              if (this.encuestaData.preguntas[0].alternativas[i].usuariosEleccion.includes(element.idUsuarioEncuesta)) {
                element.eleccion = this.encuestaData.preguntas[0].alternativas[i].descripcion;
              }      
            }
          });
        }
  
      })
    }
    else{
      this.authService.logout();
      this.notificationService.error('Acceso no autorizado')
      sessionStorage.removeItem("_roles");
    }
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  exportExcel(){
    this.excelService.exportExcel(this.encuestaData);
  }

}
