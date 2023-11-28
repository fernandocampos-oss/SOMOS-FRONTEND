import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppConfig } from '@core/configs';
import { NotificationService } from '@core/services';
import { ActividadResponse, TipoValorMeta } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { ActividadRequest, EvidenciaRequest, IndicadorRequest, PrioridadRequestDto, VotanteRequest } from '@data/models/gestion-rendimiento/indicador-dto.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { ConfirmarPanelComponent } from '@shared/confirmar-panel/confirmar-panel.component';
import * as moment from 'moment';

@Component({
  selector: 'app-asignar-prioridad',
  templateUrl: './asignar-prioridad.component.html',
  styleUrls: ['./asignar-prioridad.component.scss']
})
export class AsignarPrioridadComponent implements OnInit {
  isLinear = false;
  minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;
  contadorTxtArea: number = 0;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  displayedColumns: string[] = ['item', 'evidencia', 'plazo', 'Quitar'];
  listEvidencia: Array<{ descripcion: string, plazo: String }> = [];
  dataSource = this.listEvidencia;

  listActividad: ActividadResponse[];
  listEquipo: any[] = [];

  formPrioridad = this._formBuilder.group({
    frmTrabajador: ['', Validators.required],
    frmActividad: ['', Validators.required],
    frmDescripcionIndicador: ['', Validators.required],
    // frmDetalleIndicador: ['', Validators.required],    
    frmTipoValorMeta: ['', Validators.required],
    frmValorMeta: [''],
    frmPeso: ['', Validators.required],
  });

  formEvidencia = this._formBuilder.group({
    frmDescripcion: [''],
    frmPlazo: [''],
  });

  listTipoValorMeta: any[] = [];
  idValorMetaSeleccionado: number;
  onChangeValueTipoValorMeta: number;

  confirmDialogRef: MatDialogRef<ConfirmarPanelComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private _grService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    this.listarActividades();
    this.listarEquipo();
    this.listarTipoValorMeta();
  }

  onKey(event) {
    this.contadorTxtArea = event.target.value.length;
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
          plazo: moment(this.formEvidencia.value.frmPlazo._d).format('YYYY-MM-DDTHH:mm:ss')
        });
      } else {
        this._notification.warning("Máximo 6 evidencias por Indicador/Producto");
      }
      this.table.renderRows();
    }
  }

  deleteTarea(index) {
    this.listEvidencia.splice(index, 1);
    this.table.renderRows();
  }

  onSelectionChangeTipoValorMeta(event: any) {
    console.log(event.value);
    this.onChangeValueTipoValorMeta = event.value;
  }

  async registrar() {
    // console.log(this.formPrioridad.value.frmTrabajador.integrante.idVotante);
    // console.log(this.formPrioridad.value.frmActividad.idActividad);

    let actividad = new ActividadRequest();
    actividad.idActividad = this.formPrioridad.value.frmActividad.idActividad;
    let votante = new VotanteRequest();
    votante.idVotante = this.formPrioridad.value.frmTrabajador.integrante.idVotante;

    let tipoValorMeta = new TipoValorMeta();
    tipoValorMeta.idTipoValorMeta = this.formPrioridad.value.frmTipoValorMeta;

    let indicador = new IndicadorRequest();
    indicador.descripcion = this.formPrioridad.value.frmDescripcionIndicador;
    indicador.peso = this.formPrioridad.value.frmPeso;
    indicador.tipoValorMeta = tipoValorMeta;
    indicador.valorMeta = this.formPrioridad.value.frmValorMeta;

    let evidencias: EvidenciaRequest[] = [];
    for (let i of this.listEvidencia) {
      let e = new EvidenciaRequest();
      e.descripcion = i.descripcion;
      e.plazo = i.plazo;

      evidencias.push(e);
    }

    let prioridadDto = new PrioridadRequestDto();
    prioridadDto.actividad = actividad;
    prioridadDto.votante = votante;
    prioridadDto.indicador = indicador;
    prioridadDto.listEvidencia = evidencias;
    // console.log(prioridadDto)

    this.confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de continuar?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {

        this._grService.registrarIndicador(prioridadDto).then(data => {
          this._notification.success("Se registró correctamente");
          // this.dialogRef.closeAll();
        });
        this._dialog.closeAll();

      }
      this.confirmDialogRef = null;
    });

  }

}
