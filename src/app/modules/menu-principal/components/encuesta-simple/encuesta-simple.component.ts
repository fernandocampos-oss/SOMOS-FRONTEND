import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MenuEncuestaShow } from '@data/models/menu-principal/menu-encuesta.model';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { ConfirmEncuestaSimpleComponent } from './confirm-encuesta-simple/confirm-encuesta-simple.component';
import { NotificationService } from '@core/services';
import { EleccionService } from '@data/services/eleccion.service';
import { CandidatosResponse, EleccionActivaResponse } from '@data/models/eleccion/eleccion.model';
import { UsuarioService } from '@data/services';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '@data/models';

@Component({
  selector: 'app-encuesta-simple',
  templateUrl: './encuesta-simple.component.html',
  styleUrls: ['./encuesta-simple.component.scss']
})
export class EncuestaSimpleComponent implements OnInit {

  // datosEncuesta: MenuEncuestaShow;

  candMap = [Object()];

  selectedCandidato: any;
  datosEncuesta: EleccionActivaResponse = Object();

  candidatosBD: CandidatosResponse[];

  alternativas = [{valor:0, idAlternativa: 0, descripcion:''},{valor:0, idAlternativa: 0, descripcion:''}]
  seleccion: number = 0;
  mostrar = true;
  
  constructor(private _notification   : NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _serviceMenu: MenuPrincipalService,
              private userService: UsuarioService,
              private eleccionesService: EleccionService,
              private dialog          : MatDialog,) { }

  ngOnInit(): void {
    this.eleccionesService.getEleccionActiva().subscribe((data)=>{
      console.log(data);
      if(data){
        this.datosEncuesta = data;
        if(data.candidatos.length % 2 == 0 && data.candidatos.length != 6){
          document.documentElement.style.setProperty('--tamanio-array','2');
        }
        else{
          document.documentElement.style.setProperty('--tamanio-array','3');
        }
        this.candidatosBD = data.candidatos;
        this.candMap = data.candidatos.map((x)=> {return {idCandidato: x.idCandidato, idUsuario: x.idUsuario, unidad: '', numeroDocumento: x.numeroDocumento, nombre: x.nombres + ' ' + x.apellidos, selected: false, }})
        for (let i = 0; i < this.candMap.length; i++) {
          this.userService.get(this.candMap[i].idUsuario).subscribe((data)=>{
            if(data){
              this.candMap[i].unidad = data.red;
            }
          })
        }
        this.candMap.push({idCandidato: 0, numeroDocumento:'0', nombre: 'Ningún Candidato', selected: false, })
        console.log(this.candMap)
      }
      else{
        this.mostrar = false;
      }
    });
    // this._serviceMenu.getEncuestaActiva().subscribe((data)=>{
    //   if(data == null){
    //     this.mostrar = false;
    //   }
    //   else{
    //     console.log(data);
    //     const dataObj = Object(data);
    //     this.datosEncuesta = data;
    //     this.alternativas = dataObj.preguntas[0].alternativas;
    //   }
    // })
    
  }

  selectCand(index, cand){
    this.candMap.map(x=>x.selected = false);
    this.candMap[index].selected = true
    this.selectedCandidato = cand;
  }

  sendConfirmation(option) {
    if(!this.selectedCandidato){
      this._notification.warning("Debe elegir una opción");
    }
    else{
      const dialogRef: MatDialogRef<ConfirmEncuestaSimpleComponent> = this.dialog.open(ConfirmEncuestaSimpleComponent, {
        disableClose: false,
        autoFocus: false,
        data: {
          opcion: option,
          idEleccion: this.datosEncuesta.idEleccion,
          idSegmento: this.datosEncuesta.idSegmento
          // idEncuesta: this.identificadorEncuesta,
          // encuesta: this._getModel()
        }
      });
    }
  }
}
