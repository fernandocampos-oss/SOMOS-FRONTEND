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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<inscritosResponse>;

  ctrlInscripcion = new FormControl('');
  dataInscripcion = Object();
  estructuraExtraInscripcion = Object();


  // idIns: number;
  // descripcionInsc: string = '';
  // esVotacion: boolean;
  // esVotacionActivo: boolean;
  user: UserSession;
  listInscritos: inscritosResponse[] = [];
  grupos: any = [];

  inscripcionesAsignadas = [];

  // resultadosVotacion: any;

  displayedColumns: string[] = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion'];

  headers = ['DNI','APELLIDOS Y NOMBRE','REG LABORAL','CELULAR','CORREO']
  
  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _authService   : AuthService,
    public _servicerExcel: ExportExcelService,
    private inscripcionService: InscripcionService) { }

  ngOnInit(): void {
    this.ctrlInscripcion.valueChanges.subscribe((data)=>{
      this.grupos = [];
      this.getData();
    })
    this.inscripcionService.getInscripcionesAsignadas().subscribe((data)=>{
      this.inscripcionesAsignadas = data;
      this.ctrlInscripcion.setValue(data[0].idInscripcion);
    })
  }
  
  getData(){
    this.inscripcionService.getUsuariosInscritos(this.ctrlInscripcion.value).subscribe((data)=>{
      console.log(data)
      this.dataInscripcion = data;
      this.inscripcionService.getDatosInscripcionPorId(this.ctrlInscripcion.value).subscribe((datosInscripcion)=>{
        console.log(datosInscripcion);
        let idGrupo = 0;

        this.estructuraExtraInscripcion = datosInscripcion;
        if(this.estructuraExtraInscripcion.grupoActivo){
          this.displayedColumns = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion'];
          this.dataInscripcion.inscritos.sort(function (a, b) {
                return b.fechaInscripcion.localeCompare(a.fechaInscripcion) || a.idLider.toLocaleString().localeCompare(b.idLider.toLocaleString());
          });
          console.log(this.dataInscripcion.inscritos)
          this.dataInscripcion.inscritos.forEach((x)=>{
            if(idGrupo != x.idLider && x.idLider == x.idUsuario){
              let cantVotacion = 0;
              idGrupo = x.idLider;
              if(data.votacionesResultado.find((votacionRes)=>{return votacionRes.idLider == x.idLider})){
                cantVotacion = data.votacionesResultado.find((votacionRes)=>{return votacionRes.idLider == x.idLider}).votos;
              }
              this.grupos.push({grupo: x.idLider, descripcion: x.descripcion, imagen: x.rutaImagen, cantVotos: cantVotacion, integrantes:this.dataInscripcion.inscritos.filter((z)=>{return x.idLider == z.idLider})});
            }
          })
          console.log(this.grupos)
        }
        else{
          if(this.estructuraExtraInscripcion.imagenActiva || this.estructuraExtraInscripcion.textoActivo) this.displayedColumns = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion', 'accion'];
          else this.displayedColumns = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion'];
          if (this.dataInscripcion.inscritos.length > 0) {
            this.dataInscripcion.inscritos.sort(function (a, b) {
                  return b.fechaInscripcion.localeCompare(a.fechaInscripcion);
            });
            this.dataSource = new MatTableDataSource(this.dataInscripcion.inscritos);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource=null;
          }
        }
      })
    })
  }

  comprobarSiUrl(stringEvaluar: string): boolean{
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(stringEvaluar);
  }

  showImg(infoImagen: string, infoDescripcion: string){
    const dialogRef: MatDialogRef<ImageOptionsComponent> = this.dialog.open(ImageOptionsComponent, {
      disableClose: false,
      maxWidth: '728px',
      minHeight: '20%',
      maxHeight: '780px',
      data:{
        encabezado: this.estructuraExtraInscripcion.grupoActivo ? 'Grupo inscrito en: ' + this.dataInscripcion.descripcion : 'Inscripcion en: ' + this.dataInscripcion.descripcion,
        idInscripcion: this.ctrlInscripcion.value,
        imagenBase64: infoImagen,
        descripcion: infoDescripcion,
        descargar: true
      }
    });
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  exportar(){
    // if(this.idInscripcionSelected == 2){
    //   this.headers.splice(0,0,'GRUPO');
    //   if(this.esVotacion){
    //     this.headers.splice(1,0,'VOTOS');
    //   }
    // }
    // else{
    //   this.headers = ['DNI','APELLIDOS Y NOMBRE','REG LABORAL','CELULAR','CORREO']
    // }
    this._servicerExcel.exportExcel(this.dataInscripcion.descripcion, this.headers, this.dataInscripcion.inscritos, this.dataInscripcion.votacionesResultado)
  }

      // this.idIns = data.idInscripcion;
      // this.descripcionInsc = data.descripcion;
      // this.listInscritos = data.inscritos;
      // this.esVotacion = data.votacion;
      // this.esVotacionActivo = data.votoActivo;
  activarVotacion(){
    console.log(this.dataInscripcion.idInscripcion, this.dataInscripcion.votoActivo)
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      autoFocus: false,
      data:{
        type:0,
        title:'¿Está seguro de ' + (this.dataInscripcion.votoActivo ? 'desactivar': 'activar') + ' esta votación?',
        message: 'Campaña: '+ this.dataInscripcion.descripcion,
      }
    });

    dialogRef.afterClosed().subscribe((data)=>{
      if(data == true){
        this.dataInscripcion.votoActivo = !this.dataInscripcion.votoActivo;
        this.inscripcionService.activarInscripcionPorId(this.dataInscripcion.idInscripcion,this.dataInscripcion.votoActivo).subscribe((data)=>{
          // console.log(data);
        this.grupos = [];
        this.getData();
        // this.inscripcionService.getUsuariosInscritos(this.idInscripcionSelected).subscribe((data)=>{console.log(data)})
        })
      }
    })
  }
}
