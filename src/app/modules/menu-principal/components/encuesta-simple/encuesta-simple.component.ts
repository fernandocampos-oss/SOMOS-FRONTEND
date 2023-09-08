import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MenuEncuestaShow } from '@data/models/menu-principal/menu-encuesta.model';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { ConfirmEncuestaSimpleComponent } from './confirm-encuesta-simple/confirm-encuesta-simple.component';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-encuesta-simple',
  templateUrl: './encuesta-simple.component.html',
  styleUrls: ['./encuesta-simple.component.scss']
})
export class EncuestaSimpleComponent implements OnInit {

  datosEncuesta: MenuEncuestaShow;

  candidatos = {firstCategoria: [{nombre: 'Nombre Candidato 1', selected: false, cat: 0}, {nombre: 'Nombre Candidato 2', selected: false, cat: 0}, {nombre: 'Nombre Candidato 3', selected: false, cat: 0}, {nombre: 'Ninguna opción', selected: false, cat: 0}],
  secondCategoria: [{nombre: 'Nombre Candidato 1', selected: false, cat: 1}, {nombre: 'Nombre Candidato 2', selected: false, cat: 1}, {nombre: 'Ninguna opción', selected: false, cat: 1}],
  thirdCategoria: [{nombre: 'Nombre Candidato 1', selected: false, cat: 2}, {nombre: 'Nombre Candidato 2', selected: false, cat: 2}, {nombre: 'Nombre Candidato 3', selected: false, cat: 2}, {nombre: 'Ninguna opción', selected: false, cat: 2}]}

  alternativas = [{valor:0, idAlternativa: 0, descripcion:''},{valor:0, idAlternativa: 0, descripcion:''}]
  toggle = false;
  toggle2 = false;
  status = 'Enable'; 
  status2 = 'Enable';
  seleccion: number = 0;
  mostrar = true;
  
  constructor(private _notification   : NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _serviceMenu: MenuPrincipalService,
              private dialog          : MatDialog,) { }

  ngOnInit(): void {
    this._serviceMenu.getEncuestaActiva().subscribe((data)=>{
      if(data == null){
        this.mostrar = false;
      }
      else{
        console.log(data);
        const dataObj = Object(data);
        this.datosEncuesta = data;
        this.alternativas = dataObj.preguntas[0].alternativas;
      }
    })
    
  }
  enableDisableRule(option) {
    if(option == 1){
      this.toggle = true;
      this.status = this.toggle ? 'Enable' : 'Disable';
      this.toggle2 = false;
      this.seleccion = 1;
    }
    if(option == 2){
      this.toggle2 = true;
      this.status2 = this.toggle2 ? 'Enable' : 'Disable';
      this.toggle = false;
      this.seleccion = 2;
    }
  }

  selectCand(index, categoria){
    switch (categoria) {
      case 0:
        this.candidatos.firstCategoria.map(x=>x.selected = false);
        this.candidatos.firstCategoria[index].selected = true
        break;
      case 1:
        this.candidatos.secondCategoria.map(x=>x.selected = false);
        this.candidatos.secondCategoria[index].selected = true
        break;
      case 2:
        this.candidatos.thirdCategoria.map(x=>x.selected = false);
        this.candidatos.thirdCategoria[index].selected = true
        break;
    }
  }

  sendConfirmation(option) {
    if(false){
      this._notification.warning("Debe elegir una opción");
    }
    else{
      const dialogRef: MatDialogRef<ConfirmEncuestaSimpleComponent> = this.dialog.open(ConfirmEncuestaSimpleComponent, {
        disableClose: false,
        autoFocus: false,
        data: {
          opcion: option
          // idEncuesta: this.identificadorEncuesta,
          // encuesta: this._getModel()
        }
      });
    }
  }
}
