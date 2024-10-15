import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppConfig } from '@core/configs';
import { NotificationService } from '@core/services';
import { ActividadResponse, TipoValorMeta } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { ActividadRequest, EvidenciaRequest, IndicadorRequest, PrioridadRequestDto, VotanteRequest } from '@data/models/gestion-rendimiento/indicador-dto.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { ConfirmarPanelComponent } from '@shared/confirmar-panel/confirmar-panel.component';

import * as moment from 'moment';
import { AlertaPesoComponent } from '../alerta-peso/alerta-peso.component';
import { UpdatePrioridadDto } from '@data/models/gestion-rendimiento/prioridad-exist-indicador.model';

@Component({
  selector: 'app-asignar-prioridad',
  templateUrl: './asignar-prioridad.component.html',
  styleUrls: ['./asignar-prioridad.component.scss']
})
export class AsignarPrioridadComponent implements OnInit {
  expNumero:RegExp = /^[0-9]{1,3}$/;
  expTexto:RegExp = /^[a-zA-Z\u00C1\u00C9\u00CD\u00D3\u00F3\u00FA\u00d1\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa0-9,.\- \'\"\(\)\[\]]{1,200}$/;
  expTextoFrmDescripcionPrioridad:RegExp = /^[a-zA-Z\u00C1\u00C9\u00CD\u00D3\u00F3\u00FA\u00d1\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa0-9,.\- \'\"\(\)\[\]]{1,285}$/;
  //expTexto:RegExp = /^[a-zA-ZÀ-ÿ\u00f1\u00d1,.\- \'\"\(\)\[\]]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
  isLinear = false;
  minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;
  contadorTxtArea: number = 0;
  idIndicador:number = 0;
  idPrioridad:number = 0;
  idEviEditar:number = 0;
  nombrePrioridad:string = "";
  /* Modificación Prioridad - Inicio */
  desPrioridad:string = null;
  flPrioridad:string = '1';
  /* Modificación Prioridad - Fin */
  activaEdicion:boolean = false;
  contador:number = 0;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  displayedColumns: string[] = ['item', 'evidencia', 'plazo', 'Quitar'];
  listEvidencia: Array<{ descripcion: string, plazo: String, idEvidencia: number, tiene: number}> = [];
  dataSource = this.listEvidencia;

  listActividad: ActividadResponse[];
  listEquipo: any[] = [];

  formPrioridad = this._formBuilder.group({
    frmTrabajador: ['', Validators.required],
    frmActividad: ['', Validators.required],
    frmDescripcionPrioridad: ['', [Validators.required, Validators.pattern(this.expTextoFrmDescripcionPrioridad)]],
    frmDescripcionIndicador: ['', [Validators.required, Validators.pattern(this.expTextoFrmDescripcionPrioridad)]],
    // frmDetalleIndicador: ['', Validators.required],    
    frmTipoValorMeta: ['', Validators.required],
    frmValorMeta: ['',[Validators.pattern(this.expNumero)]],
    frmPeso: ['', [Validators.required]],
  });

  formEvidencia = this._formBuilder.group({
    frmDescripcion: ['',[Validators.pattern(this.expTexto), Validators.maxLength(300)]],
    frmPlazo: [''],
  });

  listTipoValorMeta: any[] = [];
  idValorMetaSeleccionado: number;
  onChangeValueTipoValorMeta: number;

  confirmDialogRef: MatDialogRef<ConfirmarPanelComponent>;
  pesoTotalIndicadoresTrabajador: number;
  showHelpCPlanilla = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private _grService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    /*this.listarActividades();
    this.listarEquipo();
    this.listarTipoValorMeta();*/
    this.flPrioridad = '1';
    this.listaGeneral();
  }

  async listaGeneral(){
    await this._grService.listarActividades().then((data) => {
      if (data.length > 0) {
        this.listActividad = data;
      } else {
        this._notification.warning("Lista de actividades vacia");
      }
      this._grService.listarIntegrantesPorLider().then((data) => {
        if (data.length > 0) {
          this.listEquipo = data;
        } else {
          this._notification.warning("Para crear indicadores primero debes registrar integrantes a tu equipo");
        }
        this._grService.listarTipoValorMeta().then((data) => {
          if (data.length > 0) {
            this.listTipoValorMeta = data;
          } else {
            this._notification.warning("Lista de tipo valor meta vacio");
          }
          this.validarEntrante();
        });
      });
    });
  }

  validarEntrante(){
    this.idIndicador = 0;
    this.idPrioridad = 0;
    this.activaEdicion = false;
    this.desPrioridad = null;
    this.flPrioridad = '1';
    let infActividad:any;
    infActividad = this.listActividad.find((dtActi:any)=>dtActi.idActividad == 1);
    this.formPrioridad.controls["frmActividad"].setValue(infActividad);
    if(this.data.idPersona != undefined){
      this.activaEdicion = true;
      console.log("Data:",this.data);
      //this.idIndicador = this.data.prioridad.listIndicador[0].idIndicador;
      let infIndicador:any = this.data.prioridad.listIndicador.find((dtInd:any)=>dtInd.idIndicador == this.data.idIndicador);
      console.log("Indicador:",infIndicador);
      this.idPrioridad = this.data.prioridad.idPrioridad;
      this.idIndicador = this.data.idIndicador;
      /* Modificación Prioridad - Inicio */
      this.desPrioridad = this.data.nomPrioridad;
      this.flPrioridad = infIndicador.flDesPrioridad;
      console.log("FL 1:",this.flPrioridad);
      if(this.flPrioridad === null){
        this.flPrioridad = '1';
        this.desPrioridad = this.data.descripcion;
      }
      console.log("FL 3:",this.flPrioridad);
      /* Modificación Prioridad - Fin */
      let unTraba:any = this.listEquipo.find((dtEquipo:any)=>dtEquipo.integrante.idVotante == this.data.idPersona);
      this.formPrioridad.controls["frmTrabajador"].setValue(unTraba);
      this.sumaTotalPesoIndicadoresByTrabajador(this.data.idPersona);
      if(this.flPrioridad == '0'){
        infActividad = this.listActividad.find((dtActi:any)=>dtActi.idActividad == this.data.prioridad.idActividad);
      }
      this.formPrioridad.controls["frmActividad"].setValue(infActividad);
      this.formPrioridad.controls["frmDescripcionPrioridad"].setValue(this.data.nomPrioridad);
      this.formPrioridad.controls["frmDescripcionPrioridad"].disable();
      this.formPrioridad.controls["frmDescripcionIndicador"].setValue(infIndicador.nombreIndicador);
      /*this.formPrioridad.controls["frmDescripcionIndicador"].disable();*/
      /*
      this.formPrioridad.controls["frmTipoValorMeta"].setValue(this.data.prioridad.listIndicador[0].idTipoValorMeta);
      this.onChangeValueTipoValorMeta = this.data.prioridad.listIndicador[0].idTipoValorMeta;
      this.formPrioridad.controls["frmPeso"].setValue(this.data.prioridad.listIndicador[0].peso);
      this.formPrioridad.controls["frmValorMeta"].setValue(this.data.prioridad.listIndicador[0].valorMeta);
      //this.listEvidencia = this.data.prioridad.listIndicador[0].listEvidencia;
      this.listEvidencia = [];
      if(this.data.prioridad.listIndicador[0].listEvidencia.length > 0){
        this.data.prioridad.listIndicador[0].listEvidencia.forEach((dtEvi:any)=>{
          let fecha = new Date(dtEvi.plazo);
          this.listEvidencia.push({
            descripcion: dtEvi.descripcion,
            plazo: moment(fecha).format('YYYY-MM-DDTHH:mm:ss'),
            idEvidencia: dtEvi.idEvidencia
          });
        });
        //console.log("Evidencias:",this.listEvidencia);
        this.dataSource = this.listEvidencia;
        this.table.renderRows();
      }
      */
      this.formPrioridad.controls["frmTipoValorMeta"].setValue(infIndicador.idTipoValorMeta);
      this.onChangeValueTipoValorMeta = infIndicador.idTipoValorMeta;
      this.formPrioridad.controls["frmPeso"].setValue(infIndicador.peso);
      this.formPrioridad.controls["frmValorMeta"].setValue(infIndicador.valorMeta);
      //this.listEvidencia = this.data.prioridad.listIndicador[0].listEvidencia;
      this.listEvidencia = [];
      if(infIndicador.listEvidencia.length > 0){
        infIndicador.listEvidencia.forEach((dtEvi:any)=>{
          let fecha = new Date(dtEvi.plazo);
          let tienepdf:number = (dtEvi.sustentoDescripcion == null?0:1);
          this.listEvidencia.push({
            descripcion: dtEvi.descripcion,
            plazo: moment(fecha).format('YYYY-MM-DDTHH:mm:ss'),
            idEvidencia: dtEvi.idEvidencia,
            tiene: tienepdf
          });
        });
        //console.log("Evidencias:",this.listEvidencia);
        this.dataSource = this.listEvidencia;
        this.table.renderRows();
      }
    }
    console.log("Fl 2:",this.flPrioridad);
    this.habEdiTarea();
  }

  async listarActividades() {
    let listActividades = await this._grService.listarActividades().then((data) => {
      if (data.length > 0) {
        this.listActividad = data;
      } else {
        this._notification.warning("Lista de actividades vacia");
      }
    });
  }

  async listarEquipo() {
    let listtrabajadores = await this._grService.listarIntegrantesPorLider().then((data) => {
      if (data.length > 0) {
        this.listEquipo = data;
      } else {
        this._notification.warning("Para crear indicadores primero debes registrar integrantes a tu equipo");
      }
    });
  }

  async listarTipoValorMeta() {
    let listarTipoValorMeta = await this._grService.listarTipoValorMeta().then((data) => {
      if (data.length > 0) {
        this.listTipoValorMeta = data;
      } else {
        this._notification.warning("Lista de tipo valor meta vacio");
      }
    });
  }

  onChangePesoVotante(event: any) {
    // console.log(event.value.integrante.idVotante);
    this.sumaTotalPesoIndicadoresByTrabajador(event.value.integrante.idVotante);
  }

  async sumaTotalPesoIndicadoresByTrabajador(idVotante: number) {
    let peso = await this._grService.sumaTotalPesoAllIndicadorByTrabajador(idVotante).then((data) => {
      if (data != null) {
        this.pesoTotalIndicadoresTrabajador = data;
        this.showAlertaPeso(this.pesoTotalIndicadoresTrabajador);
      }
    });
  }

  async showAlertaPeso(pesoTotalGrabado: number) {
    const dialogRef: MatDialogRef<AlertaPesoComponent> = this._dialog.open(AlertaPesoComponent, {
      disableClose: false,
      width: '25%',
      maxHeight: '100vh',
      autoFocus: false,
      data: {
        peso: pesoTotalGrabado
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTable();
    });
  }

  crearTarea() {
    // console.log(this.formTareasListadas.value);
    if (this.formEvidencia.value.frmDescripcion == undefined || this.formEvidencia.value.frmPlazo == undefined ||
      this.formEvidencia.value.frmDescripcion == '' || this.formEvidencia.value.frmPlazo == '') {
      this._notification.warning("Ingrese todos los campos para continuar");
    } else {
      if (this.listEvidencia.length <= 5) {
        this.listEvidencia.push({
          descripcion: this.formEvidencia.value.frmDescripcion,
          // plazo: this.formTareasListadas.value.frmDateTarea._d.toLocaleDateString()
          plazo: moment(this.formEvidencia.value.frmPlazo._d).format('YYYY-MM-DDTHH:mm:ss'),
          idEvidencia:0,
          tiene:0
        });
        this.dataSource = this.listEvidencia;
      } else {
        this._notification.warning("Máximo 6 evidencias por Indicador/Producto");
      }
      this.table.renderRows();
    }
    console.log("Agregar:",this.listEvidencia);
  }

  deleteTarea(index) {
    this.listEvidencia.splice(index, 1);
    this.table.renderRows();
  }

  onSelectionChangeTipoValorMeta(event: any) {
    this.onChangeValueTipoValorMeta = event.value;
  }

  async registrar() {
    // console.log(this.formPrioridad.value.frmTrabajador.integrante.idVotante);
    // console.log(this.formPrioridad.value.frmActividad.idActividad);

    let actividad = new ActividadRequest();
    if(this.flPrioridad == '0'){
      actividad.idActividad = this.formPrioridad.value.frmActividad.idActividad;
    }else{
      this.flPrioridad = '1';
      actividad.idActividad = 1; 
    }
    let votante = new VotanteRequest();
    votante.idVotante = this.formPrioridad.value.frmTrabajador.integrante.idVotante;

    let tipoValorMeta = new TipoValorMeta();
    tipoValorMeta.idTipoValorMeta = this.formPrioridad.value.frmTipoValorMeta;

    let indicador = new IndicadorRequest();
    indicador.descripcion = this.formPrioridad.value.frmDescripcionIndicador;
    indicador.peso = this.formPrioridad.value.frmPeso;
    indicador.tipoValorMeta = tipoValorMeta;
    /* Modificación Prioridad - Inicio */
    indicador.desPrioridad = this.formPrioridad.value.frmDescripcionPrioridad;
    indicador.flDesPrioridad = this.flPrioridad;
    /* Modificación Prioridad - Fin */

    // se modifica la validacion de poner siempre 100% cuando es tipo meta 3
    // if (this.formPrioridad.value.frmTipoValorMeta == 3) {
    //   indicador.valorMeta = 100;
    // } else {
    //   indicador.valorMeta = this.formPrioridad.value.frmValorMeta;
    // }
    indicador.valorMeta = this.formPrioridad.value.frmValorMeta;

    let evidencias: EvidenciaRequest[] = [];
    for (let i of this.listEvidencia) {
      let e = new EvidenciaRequest();
      e.descripcion = i.descripcion;
      e.plazo = i.plazo;

      evidencias.push(e);
    }

    let prioridadDto:any = null;
    if(this.data.idPersona == undefined){
      prioridadDto = new PrioridadRequestDto();
      prioridadDto.actividad = actividad;
      prioridadDto.votante = votante;
      prioridadDto.indicador = indicador;
      prioridadDto.listEvidencia = evidencias;
      if(indicador.flDesPrioridad == '1'){
        prioridadDto.prioridadNombre = indicador.desPrioridad;
      }
    }else{
      /*prioridadDto = new UpdatePrioridadDto();
      prioridadDto.actividad = actividad;
      let modelTipo = new TipoValorMeta();
      modelTipo.idTipoValorMeta = this.idTipoValorMetaSeleccionado;*/

    }
    console.log("Para grabar: ",indicador.flDesPrioridad);
    this.confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de continuar?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(this.data.idPersona == undefined){
          this._grService.registrarIndicador(prioridadDto).then(data => {
            this._notification.success("Se registró correctamente");
            this._dialog.closeAll();
          });
        }else{
          this._grService.modificarIndicador(this.idIndicador, indicador).then((data) => {
            if (data = 1) {
              this.listEvidencia.forEach((dtEvi:any)=>{
                if(dtEvi.tiene == 0){
                  this._grService.modificarEvidencia(dtEvi.idEvidencia, {descripcion: dtEvi.descripcion, plazo:dtEvi.plazo}).then((dataE) => {
                    /*if (dataE != 1) {
                      this._notification.error("Actualizar Evidencia: Error");
                    }*/
                  });
                }
              });
              this._notification.success("Indicador actualizado");
              this._dialog.closeAll();
            } else {
              this._notification.error("Actualizar Indicador: Error");
            }
          });
        }
        // this._dialog.closeAll();
      }
      this.confirmDialogRef = null;
    });

  }

  /*async modificar(){
    let actividad = new ActividadRequest();
    actividad.idActividad = this.idActividadSeleccionado;
  }*/
  actualizarTarea(){
    if (this.formEvidencia.value.frmDescripcion == undefined || this.formEvidencia.value.frmPlazo == undefined ||
      this.formEvidencia.value.frmDescripcion == '' || this.formEvidencia.value.frmPlazo == '') {
      this._notification.warning("Ingrese todos los campos para continuar");
    } else {
      if (this.listEvidencia.length <= 5) {
        this.listEvidencia.forEach((dtEvi:any)=>{
          if(this.idEviEditar == dtEvi.idEvidencia){
            dtEvi.descripcion = this.formEvidencia.value.frmDescripcion;
            dtEvi.plazo = moment(this.formEvidencia.value.frmPlazo._d).format('YYYY-MM-DDTHH:mm:ss');
          }
        });
        /*this.listEvidencia.push({
          descripcion: this.formEvidencia.value.frmDescripcion,
          // plazo: this.formTareasListadas.value.frmDateTarea._d.toLocaleDateString()
          plazo: moment(this.formEvidencia.value.frmPlazo._d).format('YYYY-MM-DDTHH:mm:ss'),
          idEvidencia:0
        });*/
        this.dataSource = this.listEvidencia;
      } else {
        this._notification.warning("Máximo 6 evidencias por Indicador/Producto");
      }
      this.table.renderRows();
      this.idEviEditar = 0;
    }
  }
  
  editarTarea(idTarea:number){
    this.idEviEditar = idTarea;
    this.activaEdicion = false;
    this.habEdiTarea();
    let infEvi:any = this.listEvidencia.find((dtEvi:any)=>dtEvi.idEvidencia == idTarea);
    this.formEvidencia.controls["frmDescripcion"].setValue(infEvi.descripcion);
    let fecha = new Date(infEvi.plazo);
    //this.minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;
    this.minFechaEvidencia = fecha;
    this.formEvidencia.controls["frmPlazo"].setValue(fecha);
  }

  cancelaEdicion(){
    this.activaEdicion = true;
    this.habEdiTarea();
    this.idEviEditar = 0;
  }

  habEdiTarea(){
    if(this.activaEdicion == true){
      this.formEvidencia.controls["frmDescripcion"].disable();
      this.formEvidencia.controls["frmPlazo"].disable();
    }else{
      this.formEvidencia.controls["frmDescripcion"].enable();
      this.formEvidencia.controls["frmPlazo"].enable();
    }
  }

  validaNumero(event:any){
    const inputValue: string = String.fromCharCode(event.keyCode);
    return this.expNumero.test(inputValue);
  }

  validaTexto(event:any){
    const inputValue: string = String.fromCharCode(event.keyCode);
    return this.expTexto.test(inputValue);
  }

  onKey(event){
    this.contador = event.target.value.length
  }

  valida(){
    console.log("Valida Frm:",this.formPrioridad);
  }
}
