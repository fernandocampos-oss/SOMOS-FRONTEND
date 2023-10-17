import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSession } from '@data/models';
import { inscritosResponse } from '@data/models/inscripcion/inscripcion.model';
import { AuthService } from '@data/services';
import { ExportExcelService } from '@data/services/excel-export-services/export-excel-inscripciones.service';
import { InscripcionService } from '@data/services/inscripcion.service';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { ImageOptionsComponent } from '@shared/image-options/image-options.component';

@Component({
  selector: 'app-administrar-inscripcion',
  templateUrl: './administrar-inscripcion.component.html',
  styleUrls: ['./administrar-inscripcion.component.scss']
})
export class AdministrarInscripcionComponent implements OnInit {

  selectFormControl = new FormControl('');
  idIns: number;
  descripcionInsc: string = '';
  esVotacion: boolean;
  esVotacionActivo: boolean;
  user: UserSession;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<inscritosResponse>;
  listInscritos: inscritosResponse[] = [];
  grupos: any = [];

  displayedColumns: string[] = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion'];

  headers = ['DNI','APELLIDOS Y NOMBRE','REG LABORAL','CELULAR','CORREO']
  
  tipo: number = 2;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _authService   : AuthService,
    public _servicerExcel: ExportExcelService,
    private inscripcionService: InscripcionService) { }

  ngOnInit(): void {
    this.user = this._authService.getUserSession();
    this.getData();
    this.selectFormControl.valueChanges.subscribe((data)=>{
      this.grupos = [];
      this.tipo = data;
      this.getData();
    })
  }

  getData(){
    this.inscripcionService.getUsuariosInscritos(this.tipo).subscribe((data)=>{
      // console.log(data)
      this.idIns = data.idInscripcion;
      this.descripcionInsc = data.descripcion;
      this.listInscritos = data.inscritos;
      this.esVotacion = data.votacion;
      this.esVotacionActivo = data.votoActivo;
      if (data.inscritos.length > 0) {
        this.dataSource = new MatTableDataSource(data.inscritos);
        // if(this.tipo == 2) this.displayedColumns.push('acciones');
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource=null;
      }

      if(this.tipo == 2){
        let idGrupo = 0;
        this.listInscritos.sort(function (a, b) {
            return a.fechaInscripcion.localeCompare(b.fechaInscripcion) || a.idLider.toLocaleString().localeCompare(b.idLider.toLocaleString());
        });
        this.listInscritos.forEach((x)=>{
          if(idGrupo != x.idLider && x.idLider == x.idUsuario){
            idGrupo = x.idLider;
            this.grupos.push({grupo: x.idLider, descripcion: x.descripcion, imagen: x.rutaImagen, integrantes:this.listInscritos.filter((z)=>{return x.idLider == z.idLider})});
          }
        })
        // console.log(this.grupos)
      }
    })
  }

  showImg(infoGrupo: any){
    const dialogRef: MatDialogRef<ImageOptionsComponent> = this.dialog.open(ImageOptionsComponent, {
      disableClose: false,
      maxWidth: '728px',
      minHeight: '20%',
      maxHeight: '780px',
      data:{
        encabezado: 'Grupo inscrito en: ' + this.descripcionInsc,
        idInscripcion: this.tipo,
        imagenBase64: infoGrupo.imagen,
        descripcion: infoGrupo.descripcion,
        descargar: true
      }
    });
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  exportar(){
    if(this.tipo == 2){
      this.headers.splice(0,0,'GRUPO');
    }
    else{
      this.headers = ['DNI','APELLIDOS Y NOMBRE','REG LABORAL','CELULAR','CORREO']
    }
    this._servicerExcel.exportExcel(this.descripcionInsc, this.headers, this.listInscritos)
  }

  activarVotacion(){
    console.log(this.idIns, this.esVotacionActivo)
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      autoFocus: false,
      data:{
        type:0,
        title:'¿Está seguro de ' + (this.esVotacionActivo ? 'desactivar': 'activar') + ' esta votación?',
        message: 'Campaña: '+ this.descripcionInsc,
      }
    });

    dialogRef.afterClosed().subscribe((data)=>{
      if(data == true){
        this.esVotacionActivo = !this.esVotacionActivo;
        this.inscripcionService.activarInscripcionPorId(this.idIns,this.esVotacionActivo).subscribe((data)=>{
          // console.log(data);
    this.inscripcionService.getUsuariosInscritos(this.tipo).subscribe((data)=>{console.log(data)})
        })
      }
    })
  }
}
