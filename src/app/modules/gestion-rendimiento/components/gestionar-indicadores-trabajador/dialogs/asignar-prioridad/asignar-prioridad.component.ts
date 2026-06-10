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

import moment from 'moment';
import { AlertaPesoComponent } from '../alerta-peso/alerta-peso.component';
import { UpdatePrioridadDto } from '@data/models/gestion-rendimiento/prioridad-exist-indicador.model';

@Component({
  selector: 'app-asignar-prioridad',
  templateUrl: './asignar-prioridad.component.html',
  styleUrls: ['./asignar-prioridad.component.scss']
})
export class AsignarPrioridadComponent implements OnInit {
  expNumero:RegExp = /^[0-9]{1,5}$/;
  expTexto: RegExp = /^[a-zA-Z\u00C1\u00C9\u00CD\u00D3\u00F3\u00FA\u00d1\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa0-9,.\-\/\+\(\) '\"\[\]]{1,200}$/;
  expTextoFrmDescripcionPrioridad: RegExp = /^[a-zA-Z\u00C1\u00C9\u00CD\u00D3\u00F3\u00FA\u00d1\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa0-9,.\-\/\+\(\) '\"\[\]]{1,350}$/;

  //expTexto:RegExp = /^[a-zA-ZÀ-ÿ\u00f1\u00d1,.\- \'\"\(\)\[\]]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
  isLinear = false;
  minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;
  contadorTxtArea: number = 0;
  idIndicador:number = 0;
  idPrioridad:number = 0;
  idEviEditar:number = 0;
  nombrePrioridad:string = "";
  /* Modificación Prioridad - Inicio */
  desPrioridad:string = '';
  flPrioridad:string = '1';
  /* Modificación Prioridad - Fin */
  activaEdicion:boolean = false;
  contador:number = 0;

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  displayedColumns: string[] = ['item', 'evidencia', 'plazo', 'Quitar'];
  listEvidencia: Array<{ descripcion: string, plazo: String, idEvidencia: number, tiene: number}> = [];
  dataSource = this.listEvidencia;

  listActividad!: ActividadResponse[];
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
    frmSentidoIndicador: ['ascendente', Validators.required], // Sentido del indicador
  });

  formEvidencia = this._formBuilder.group({
    frmDescripcion: ['',[Validators.pattern(this.expTextoFrmDescripcionPrioridad), Validators.maxLength(350)]],
    frmPlazo: [''],
    frmPlazoFinal: ['', Validators.required], // Fecha plazo final
  });

  listTipoValorMeta: any[] = [];
  idValorMetaSeleccionado!: number;
  onChangeValueTipoValorMeta!: number;

  confirmDialogRef!: MatDialogRef<ConfirmarPanelComponent> | null;
  pesoTotalIndicadoresTrabajador: number = 0;
  pesoIndicadorOriginal: number = 0;
  showHelpCPlanilla = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AsignarPrioridadComponent>,
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
            this._notification.warning("Lista de tipo valor esperado vacio");
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
    this.desPrioridad = '';
    this.flPrioridad = '1';
    this.pesoIndicadorOriginal = 0;
    let infActividad:any;
    infActividad = this.listActividad.find((dtActi:any)=>dtActi.idActividad == 1);
    this.formPrioridad.controls["frmActividad"].setValue(infActividad);
    
    // Si viene trabajador pre-seleccionado desde "Añadir nueva Prioridad"
    if(this.data.trabajador != undefined && this.data.bloqueado){
      let unTraba:any = this.listEquipo.find((dtEquipo:any)=>dtEquipo.integrante.idVotante == this.data.trabajador.idVotante);
      if(unTraba){
        this.formPrioridad.controls["frmTrabajador"].setValue(unTraba);
        this.formPrioridad.controls["frmTrabajador"].disable(); // Bloquear selector de trabajador
        this.sumaTotalPesoIndicadoresByTrabajador(this.data.trabajador.idVotante);
      }
    }
    
    if(this.data.idPersona != undefined){
      this.activaEdicion = true;
      // console.log("Data:",this.data);
      //this.idIndicador = this.data.prioridad.listIndicador[0].idIndicador;
      let infIndicador:any = this.data.prioridad.listIndicador.find((dtInd:any)=>dtInd.idIndicador == this.data.idIndicador);
      // console.log("Indicador:",infIndicador);
      this.idPrioridad = this.data.prioridad.idPrioridad;
      this.idIndicador = this.data.idIndicador;
      /* Modificación Prioridad - Inicio */
      this.desPrioridad = this.data.nomPrioridad;
      this.flPrioridad = infIndicador.flDesPrioridad;
      // console.log("FL 1:",this.flPrioridad);
      if(this.flPrioridad === null){
        this.flPrioridad = '1';
        this.desPrioridad = this.data.descripcion;
      }
      // console.log("FL 3:",this.flPrioridad);
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
      this.pesoIndicadorOriginal = infIndicador.peso;
      this.formPrioridad.controls["frmValorMeta"].setValue(infIndicador.valorMeta);
      const sentidoActual = (infIndicador.sentido || 'ascendente').toString().toLowerCase();
      this.formPrioridad.controls["frmSentidoIndicador"].setValue(
        sentidoActual === 'descendente' ? 'descendente' : 'ascendente'
      );
      // Cargar fecha de plazo final si existe (usando moment para evitar problemas de timezone)
      if(infIndicador.fechaPlazoFinal){
        // Agregar T12:00:00 para evitar que se interprete como UTC medianoche
        const fechaStr = infIndicador.fechaPlazoFinal.toString().substring(0, 10) + 'T12:00:00';
        this.formEvidencia.controls["frmPlazoFinal"].setValue(new Date(fechaStr));
      }
      //this.listEvidencia = this.data.prioridad.listIndicador[0].listEvidencia;
      this.listEvidencia = [];
      if(infIndicador.listEvidencia.length > 0){
        infIndicador.listEvidencia.forEach((dtEvi:any)=>{
          // Excluir la evidencia final (SUSTENTO FINAL) de la lista editable
          if(dtEvi.descripcion === 'SUSTENTO FINAL') return;
          
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
    // console.log("Fl 2:",this.flPrioridad);
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
        this._notification.warning("Lista de tipo valor esperado vacio");
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
    // console.log("Agregar:",this.listEvidencia);
  }

  deleteTarea(index: any) {
    this.listEvidencia.splice(index, 1);
    this.table.renderRows();
  }

  onSelectionChangeTipoValorMeta(event: any) {
    this.onChangeValueTipoValorMeta = event.value;
  }

  async registrar() {
    // console.log(this.formPrioridad.value.frmTrabajador.integrante.idVotante);
    // console.log(this.formPrioridad.value.frmActividad.idActividad);

    // Usar getRawValue() para obtener también los valores de campos deshabilitados
    const formValues = this.formPrioridad.getRawValue();

    let actividad = new ActividadRequest();
    if(this.flPrioridad == '0'){
      actividad.idActividad = formValues.frmActividad.idActividad;
    }else{
      this.flPrioridad = '1';
      actividad.idActividad = 1; 
    }
    let votante = new VotanteRequest();
    votante.idVotante = formValues.frmTrabajador.integrante.idVotante;

    let tipoValorMeta = new TipoValorMeta();
    tipoValorMeta.idTipoValorMeta = formValues.frmTipoValorMeta;

    let indicador = new IndicadorRequest();
    indicador.descripcion = formValues.frmDescripcionIndicador;
    indicador.peso = formValues.frmPeso;
    indicador.tipoValorMeta = tipoValorMeta;
    /* Modificación Prioridad - Inicio */
    indicador.desPrioridad = formValues.frmDescripcionPrioridad;
    indicador.flDesPrioridad = this.flPrioridad;
    /* Modificación Prioridad - Fin */

    // se modifica la validacion de poner siempre 100% cuando es tipo meta 3
    // if (formValues.frmTipoValorMeta == 3) {
    //   indicador.valorMeta = 100;
    // } else {
    //   indicador.valorMeta = formValues.frmValorMeta;
    // }
    indicador.valorMeta = formValues.frmValorMeta;

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
      prioridadDto.sentidoIndicador = formValues.frmSentidoIndicador; // Agregar sentido
      
      // DEBUG: Verificar valores antes de enviar
      // console.log('=== DEBUG ASIGNAR PRIORIDAD ===');
      // console.log('formValues.frmSentidoIndicador:', formValues.frmSentidoIndicador);
      // console.log('formEvidencia.value.frmPlazoFinal:', this.formEvidencia.value.frmPlazoFinal);
      // console.log('Tipo de frmPlazoFinal:', typeof this.formEvidencia.value.frmPlazoFinal);
      
      // Agregar fecha de plazo final - manejar tanto Moment como Date
      if(this.formEvidencia.value.frmPlazoFinal){
        const fechaValue = this.formEvidencia.value.frmPlazoFinal;
        // Verificar si es un objeto Moment (tiene _d) o un Date nativo
        if (fechaValue._d) {
          prioridadDto.fechaPlazoFinal = moment(fechaValue._d).format('YYYY-MM-DDTHH:mm:ss');
        } else if (fechaValue instanceof Date) {
          prioridadDto.fechaPlazoFinal = moment(fechaValue).format('YYYY-MM-DDTHH:mm:ss');
        } else {
          prioridadDto.fechaPlazoFinal = moment(fechaValue).format('YYYY-MM-DDTHH:mm:ss');
        }
        // console.log('fechaPlazoFinal formateada:', prioridadDto.fechaPlazoFinal);
      }
      if(indicador.flDesPrioridad == '1'){
        prioridadDto.prioridadNombre = indicador.desPrioridad;
      }
      
      // console.log('=== DTO FINAL A ENVIAR ===');
      // console.log('prioridadDto:', JSON.stringify(prioridadDto, null, 2));
    }else{
      /*prioridadDto = new UpdatePrioridadDto();
      prioridadDto.actividad = actividad;
      let modelTipo = new TipoValorMeta();
      modelTipo.idTipoValorMeta = this.idTipoValorMetaSeleccionado;*/

    }
    // console.log("Para grabar: ",indicador.flDesPrioridad);
    this.confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de continuar?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(this.data.idPersona == undefined){
          this._grService.registrarIndicador(prioridadDto).then(data => {
            this._notification.success("Se registró correctamente");
            this.dialogRef.close(true);
          });
        }else{
          this._grService.modificarIndicador(this.idIndicador, indicador).then(async (data) => {
            if (data = 1) {
              await this._grService.actualizarSentidoIndicador(
                this.idIndicador,
                formValues.frmSentidoIndicador
              );
              this.listEvidencia.forEach((dtEvi:any)=>{
                if(dtEvi.tiene == 0){
                  this._grService.modificarEvidencia(dtEvi.idEvidencia, {descripcion: dtEvi.descripcion, plazo:dtEvi.plazo}).then((dataE) => {
                    /*if (dataE != 1) {
                      this._notification.error("Actualizar Evidencia: Error");
                    }*/
                  });
                }
              });
              // Actualizar fecha de plazo final si existe
              if(this.formEvidencia.value.frmPlazoFinal){
                const fechaValue = this.formEvidencia.value.frmPlazoFinal;
                let fechaPlazoStr: string;
                if (fechaValue._d) {
                  fechaPlazoStr = moment(fechaValue._d).format('YYYY-MM-DD');
                } else if (fechaValue instanceof Date) {
                  fechaPlazoStr = moment(fechaValue).format('YYYY-MM-DD');
                } else {
                  fechaPlazoStr = moment(fechaValue).format('YYYY-MM-DD');
                }
                await this._grService.actualizarFechaPlazoFinal(this.idIndicador, fechaPlazoStr);
              }
              this._notification.success("Indicador actualizado");
              this.dialogRef.close(true);
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

  /**
   * Resetea solo los campos de descripción y plazo de evidencia,
   * preservando el valor de frmPlazoFinal
   */
  resetEvidenciaCampos(): void {
    const plazoFinalValue = this.formEvidencia.controls["frmPlazoFinal"].value;
    this.formEvidencia.controls["frmDescripcion"].reset();
    this.formEvidencia.controls["frmPlazo"].reset();
    // Restaurar el valor del plazo final
    if (plazoFinalValue) {
      this.formEvidencia.controls["frmPlazoFinal"].setValue(plazoFinalValue);
    }
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

  onKey(event: any){
    this.contador = event.target.value.length
  }

  valida(){
    // console.log("Valida Frm:",this.formPrioridad);
  }

  onlyNumbersAndDecimal(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;
    
    // Obtener el carácter que se está ingresando
    const char = String.fromCharCode(charCode);
    const newValue = currentValue.substring(0, selectionStart ?? 0) + char + currentValue.substring(selectionEnd ?? 0);
    
    // Permitir punto decimal
    if (charCode === 46) {
      // Verificar que no haya ya un punto decimal
      if (currentValue.indexOf('.') !== -1) {
        return false;
      }
      return true;
    }
    
    // Solo permitir números 0-9
    if (charCode >= 48 && charCode <= 57) {
      // Si el valor actual es "0" y se escribe un dígito diferente de 0, reemplazar el 0
      if (currentValue === '0' && char !== '0') {
        inputElement.value = '';
        setTimeout(() => {
          this.formPrioridad.patchValue({ frmPeso: parseFloat(char) });
        }, 0);
        return false;
      }
      
      // No permitir más ceros si el campo ya es "0"
      if (char === '0' && currentValue === '0') {
        return false;
      }
      
      // Validar que el nuevo valor no supere 100
      const numericValue = parseFloat(newValue);
      if (!isNaN(numericValue) && numericValue > 100) {
        // Si supera 100, establecer automáticamente en 100
        setTimeout(() => {
          this.formPrioridad.patchValue({ frmPeso: 100 });
        }, 0);
        return false;
      }
      
      // Verificar que no se escriba un tercer dígito entero
      // Si ya tengo 2 dígitos antes del punto decimal (o sin punto), no permitir más
      const parteEntera = newValue.split('.')[0];
      if (parteEntera.length > 3 || (parteEntera.length === 3 && parteEntera !== '100')) {
        // Si intenta escribir más de 3 dígitos o 3 dígitos que no sean "100", establecer en 100
        setTimeout(() => {
          this.formPrioridad.patchValue({ frmPeso: 100 });
        }, 0);
        return false;
      }
      
      return true;
    }
    
    // Bloquear todo lo demás (incluyendo el signo menos)
    return false;
  }
}