import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { NotificationService } from '@core/services';
import { MenuEncuestaShow, encuestaRespuesta } from '@data/models/menu-principal/menu-encuesta.model';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { ConfirmRegisterEncuestaComponent } from './dialogs/confirm-register-encuesta/confirm-register-encuesta.component';

@Component({
  selector: 'app-register-datos-encuesta',
  templateUrl: './register-datos-encuesta.component.html',
  styleUrls: ['./register-datos-encuesta.component.scss']
})
export class RegisterDatosEncuestaComponent implements OnInit {

  encuestaDescripcion: string;

  identificadorEncuesta: number;
  datosSedes = new Array;
  datosGrupoPersonal = new Array;
  datosCargoPersonal = new Array;
  datosTiempoServicio = new Array;

  preguntasEncuesta = new Array;

  form: FormGroup;
  selectedIndex=0;

  constructor(private _notification   : NotificationService,
              private _fb             : FormBuilder,
              private _menuService    : MenuPrincipalService,
              private dialog          : MatDialog,) { }

  ngOnInit(): void {
    this._createForm();
    this._menuService.getEncuestaActiva().subscribe(data => {
      this.identificadorEncuesta = data.idEncuesta;
      this.encuestaDescripcion = data.descripcion;
      this.datosSedes = Object(data.datosDemograficos).sedes;
      this.datosGrupoPersonal = Object(data.datosDemograficos).gruposPersonales;
      this.datosCargoPersonal = Object(data.datosDemograficos).areasPersonales;
      this.datosTiempoServicio = Object(data.datosDemograficos).tiemposDeServicios;
      this.preguntasEncuesta = Object(data.preguntas);
      });
  }
  
  onTabChanged(event){
    if(event.index==1 && !this.form.valid){
      this.selectedIndex=0;
      this._notification.error("Se deben ingresar los datos para continuar");
    }
    
    if(this.form.value.frmRespuestas[43] == undefined)
      this.form.value.frmRespuestas[43] = undefined;
  }
  

  private _createForm() {
    this.form = this._fb.group({
      frmSede             : [null,[Validators.required]],
      frmGrupoPersonal    : [null,[Validators.required]],
      frmAreaPersonal     : [null,[Validators.required]],
      frmTiempoServicio   : [null,[Validators.required]],
      frmRespuestas       : this._fb.array([
      ]),
    });
  }
  
  next(){
    this.selectedIndex=1;
  }
  sendInfo(){
    const dialogRef: MatDialogRef<ConfirmRegisterEncuestaComponent> = this.dialog.open(ConfirmRegisterEncuestaComponent, {
      disableClose: false,
      autoFocus: false,
      data: {
        idEncuesta: this.identificadorEncuesta,
        encuesta: this._getModel()
      }
    });
  }

  changeSelection(index: number,data: MatRadioChange){
    var idPregunta = index + 1;
    var idAlternativa = parseInt(data.value);
    this.form.value.frmRespuestas[index] = {idPregunta,idAlternativa};
  }

  validarEncuesta(): boolean{
    if (this.form.value.frmRespuestas.length == 44) {
      if (this.form.value.frmRespuestas.includes(undefined)) {
        return false;        
      }
      else{
        return true;
      }
    }
    else{
      return false;
    }
  }

  private _getModel(): encuestaRespuesta{
    return {
      idSede: this.form.value.frmSede,
      idGrupoPersonal: this.form.value.frmGrupoPersonal,
      idAreaPersonal: this.form.value.frmAreaPersonal,
      idTiempoServicio: this.form.value.frmTiempoServicio,
      respuestas: this.form.value.frmRespuestas,
    };
  }
}
