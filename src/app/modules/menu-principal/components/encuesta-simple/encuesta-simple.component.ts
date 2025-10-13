import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { ConfirmEncuestaSimpleComponent } from './confirm-encuesta-simple/confirm-encuesta-simple.component';
import { NotificationService } from '@core/services';
import { EleccionService } from '@data/services/eleccion.service';
import { CandidatosResponse, EleccionActivaResponse } from '@data/models/eleccion/eleccion.model';
import { UsuarioService } from '@data/services';
import { MenuEncuestaShow, encuestaRespuesta } from '@data/models/menu-principal/menu-encuesta.model';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-encuesta-simple',
  templateUrl: './encuesta-simple.component.html',
  styleUrls: ['./encuesta-simple.component.scss']
})
export class EncuestaSimpleComponent implements OnInit {

  datosEncuesta: MenuEncuestaShow = Object();

  visualizarOpciones = true;

  esHora = true;

  candMap = [Object()];

  selectedCandidato: any;
  datosEleccion: EleccionActivaResponse = Object();

  candidatosBD: CandidatosResponse[];
  

  // alternativas = [{valor:0, idAlternativa: 0, descripcion:''},{valor:0, idAlternativa: 0, descripcion:''}]
  seleccion: number;
  mostrar = true;
  
  constructor(private _notification   : NotificationService,
              private dialogRef: MatDialogRef<EncuestaSimpleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _serviceMenu: MenuPrincipalService,
              private userService: UsuarioService,
              private eleccionesService: EleccionService,
              private dialog          : MatDialog,) { }

  ngOnInit(): void {
    this.eleccionesService.getEleccionActiva().subscribe((data)=>{
      if(data){
        this.datosEleccion = data;
        if(data.candidatos.length % 2 == 0 && data.candidatos.length != 6){
          document.documentElement.style.setProperty('--tamanio-array','2');
        }
        else{
          document.documentElement.style.setProperty('--tamanio-array','3');
        }
        this.candidatosBD = data.candidatos;
        this.candMap = data.candidatos.map((x)=> {return {idCandidato: x.idCandidato, idUsuario: x.idUsuario, unidad: '', numeroDocumento: x.numeroDocumento, nombre: x.nombres + ' ' + x.apellidos, selected: false, }})
        for (let i = 0; i < this.candMap.length; i++) {
          this.candMap[0].organoStatic = "Gerencia Central de Tecnologías de Información y Comunicaciones";
          this.candMap[0].unidadStatic = "Subgerencia de Operaciones de Tecnologías de Información";
          this.candMap[1].organoStatic = "Gerencia Central de Asesoría Jurídica";
          this.candMap[1].unidadStatic = "Subgerencia de Asesoramiento Administrativo";
          this.candMap[2].organoStatic = "Gerencia Central de Gestión Financiera";
          this.candMap[2].unidadStatic = "Subgerencia de Control Contable y de Impuestos";
          if (this.candMap[i].idUsuario != 0) {
            this.userService.get(this.candMap[i].idUsuario).subscribe((data) => {
              if (data) {
                this.candMap[i].unidad = data.red;
              }
            })
          }
        }
        this.candMap.push({idCandidato: 0, numeroDocumento:'0', nombre: 'Ningún Candidato', selected: false, });
        // console.log(this.candMap)
      } else {
        this.mostrar = false;
      }
    });
    // this._serviceMenu.getEncuestaActiva().subscribe((data)=>{
    //   if(data == null){
    //     this.mostrar = false;
    //   }
    //   else{
    //     console.log(data);
    //     // const dataObj = Object(data);
    //     this.datosEncuesta = data;
    //     // this.alternativas = dataObj.preguntas[0].alternativas;
    //   }
    // })
    
  }

  selectCand(index, cand){
    this.candMap.map(x=>x.selected = false);
    this.candMap[index].selected = true
    this.selectedCandidato = cand;
  }

  sendConfirmation(){
    if(!this.seleccion){
      this._notification.warning("Debe elegir una opción");
    }
    else{  
      let optElegida = this.datosEncuesta.preguntas[0].alternativas.find((x)=>{return x.valor == this.seleccion})
      const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        autoFocus: false,
        data:{
          type:0,
          title:'Confirmar envío',
          message: 'Una vez confirmado, no se podrá deshacer',
          messageAdicional: `Esta eligiendo la siguiente opción: ${optElegida.descripcion}`
        }
      });

      dialogRef.afterClosed().subscribe((data)=>{
        if(data == true){
          this._serviceMenu.sendEncuesta(1, this.getModelo()).subscribe((dataItem) => {
            // console.log(dataItem)
            this.dialogRef.close("enviado");
          });
        }
      })
    }
    // if(!this.selectedCandidato){
    //   this._notification.warning("Debe elegir una opción");
    // }
    // else{
    //   const dialogRef: MatDialogRef<ConfirmEncuestaSimpleComponent> = this.dialog.open(ConfirmEncuestaSimpleComponent, {
    //     disableClose: false,
    //     autoFocus: false,
    //     data: {
    //       // opcion: option,
    //       // idEleccion: this.datosEncuesta.idEleccion,
    //       // idSegmento: this.datosEncuesta.idSegmento
    //       // idEncuesta: this.identificadorEncuesta,
    //       // encuesta: this._getModel()
    //     }
    //   });
    // }
  }

  confirmarCandidato(option) {
    if (!this.selectedCandidato) {
      this._notification.warning("Debe elegir una opción");
    }
    else {
      const dialogRef: MatDialogRef<ConfirmEncuestaSimpleComponent> = this.dialog.open(ConfirmEncuestaSimpleComponent, {
        disableClose: false,
        autoFocus: false,
        data: {
          opcion: option,
          idEleccion: this.datosEleccion.idEleccion,
          idSegmento: this.datosEleccion.idSegmento
          // idEncuesta: this.identificadorEncuesta,
          // encuesta: this._getModel()
        }
      });
    }
  }

  getTooltip(nroDoc: string): string{
    let toolText;
    switch (nroDoc) {
      case '08443100':
        toolText = 'Red: Sede Central\nUnid. Org: Gerencia de Acceso y Acreditación del asegurado';
        break;
      case '21882665':
        toolText = 'Red: Sede Central\nUnid. Org: Oficina de Seguridad Informática';
        break;
      case '41594662':
        toolText = 'Red: Sede Central\nUnid. Org: Gerencia de Planificación y Evaluación de Inversiones';
        break;
      case '25465670':
        toolText = 'Red: Sede Central\nUnid. Org: Gerencia de Producción';
        break;
    }
    return toolText;
  }

  chooseOption(value){
    this.seleccion = value;
  }

  public getModelo(): encuestaRespuesta{
    return {
      idSede: 1,
      idGrupoPersonal: 1,
      idAreaPersonal: 1,
      idTiempoServicio: 1,
      respuestas: [{
        idPregunta: 1,
        idAlternativa: this.seleccion
      }]
    };
  }
}
