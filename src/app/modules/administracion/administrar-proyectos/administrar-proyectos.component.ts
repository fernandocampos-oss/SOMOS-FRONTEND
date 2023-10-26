import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportPdfProyectosService } from '@data/services/pdf-export-services/export-pdf-proyectos.service';
import { RenuevaEssaludService } from '@data/services/renueva-essalud.service';
import { VistaPreviaProyectoComponent } from './vista-previa-proyecto/vista-previa-proyecto.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '@data/services';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-administrar-proyectos',
  templateUrl: './administrar-proyectos.component.html',
  styleUrls: ['./administrar-proyectos.component.scss']
})
export class AdministrarProyectosComponent implements OnInit {

  proyectos: any[] = [];
  dataProyectos = Object();

  displayedColumns: string[] = ['dni', 'nombres', 'cargo', 'celular', 'correo'];

  constructor( private renuevaService       : RenuevaEssaludService,
               private _router              : Router,
               private dialogRef            : MatDialog,
               private notificationService  : NotificationService,
               private authService          : AuthService,
               private route                : ActivatedRoute,
               private pdfService           : ExportPdfProyectosService
               ) { }

  ngOnInit(): void {
    if(this.authService.getUserSession().idRol == 4 || this.authService.getUserSession().id == 291 || this.authService.getUserSession().id == 12560){
      this.filtrar(0);
    }
    else{
      this.authService.logout();
      this.notificationService.error('Acceso no autorizado')
      sessionStorage.removeItem("_roles");
    }
  }

  filtrar(opt: number){
    this.renuevaService.getRenuevaReporteProyectos().subscribe((data)=>{
      this.dataProyectos = {
        total: data.total,
        enviados: data.enviados,
        pendientes: data.pendientesEnvio
      }
      if(opt == 0){
        this.proyectos = data.proyectos;
      }
      else if(opt == 1){
        this.proyectos = data.proyectos.filter((x)=>{return x.enviado == true});
      }
      else if(opt == 2){
        this.proyectos = data.proyectos.filter((x)=>{return x.enviado == false});
      }
    })
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  getPdfProyecto(element){
    this.pdfService.generatePDF(element);
  }

  showProject(element){
    const dialogRef: MatDialogRef<VistaPreviaProyectoComponent> = this.dialogRef.open(VistaPreviaProyectoComponent, {
      disableClose: false,
      autoFocus: false,
      width: '70%',
      maxHeight: '80vh',
      data:{
        projectInfo: element
      }
    });
  }
}
