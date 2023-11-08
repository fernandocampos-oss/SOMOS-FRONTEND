import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services';
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
  
  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _authService   : AuthService,
    private _notification   : NotificationService,
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
    let headersTabla = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion'];
    this.inscripcionService.getUsuariosInscritos(this.ctrlInscripcion.value).subscribe((data)=>{
      console.log(data)
      this.dataInscripcion = data;
      this.inscripcionService.getDatosInscripcionPorId(this.ctrlInscripcion.value).subscribe((datosInscripcion)=>{
        // console.log((({ inscritos, ...o }) => o)(this.dataInscripcion));
        console.log(datosInscripcion);
        let idGrupo = 0;

        this.estructuraExtraInscripcion = datosInscripcion;
        if(this.estructuraExtraInscripcion.grupoActivo){
          // this.displayedColumns = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion'];
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
          if(this.estructuraExtraInscripcion.imagenActiva || this.estructuraExtraInscripcion.textoActivo) {headersTabla.push('accion')} // = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion', 'accion'];
          // else this.displayedColumns = ['dni', 'nombres', 'regimen', 'celular', 'correo', 'fechaInscripcion'];
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
      this.displayedColumns = headersTabla;
    })
  }

  comprobarSiUrl(stringEvaluar: string): boolean{
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    // var regexp = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
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
    if (this.dataInscripcion.inscritos.length > 0) {
      let headers = ['DNI','Apellidos y Nombres','Red','Unidad Orgánica','Reg. Laboral','Celular','Correo'];
      
      if(this.estructuraExtraInscripcion.grupoActivo){
        headers.splice(0,0,(this.estructuraExtraInscripcion.textoActivo ? `Grupo (${this.estructuraExtraInscripcion.textoDescripcion})`: 'Líder de grupo'));
        if(this.dataInscripcion.votacionesResultado){
          headers.splice(1,0,'Votos');
        }
      }
      else{
        if(this.estructuraExtraInscripcion.textoActivo){
          headers.push(this.estructuraExtraInscripcion.textoDescripcion)
        }
        if(this.dataInscripcion.votacionesResultado){
          headers.splice(0,0,'Votos');
        }
      }
          
      this._servicerExcel.exportExcel(headers, this.dataInscripcion, this.estructuraExtraInscripcion)
    }
    else{
      this._notification.warning('Aún no hay registro de inscritos');
    }
  }

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
