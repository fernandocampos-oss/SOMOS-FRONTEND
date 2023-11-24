import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppConfig } from '@core/configs';
import { NotificationService } from '@core/services';
import { ActividadResponse, TipoValorMeta } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { EvidenciaExistDto, IndicadorExistDto, PrioridadExistDto, PrioridadExistRequestDto, VotanteExistDto } from '@data/models/gestion-rendimiento/prioridad-exist-indicador.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { ConfirmarPanelComponent } from '@shared/confirmar-panel/confirmar-panel.component';
import * as moment from 'moment';

@Component({
  selector: 'app-asignar-indicador',
  templateUrl: './asignar-indicador.component.html',
  styleUrls: ['./asignar-indicador.component.scss']
})
export class AsignarIndicadorComponent implements OnInit {
  minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;
  contadorTxtArea: number = 0;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  displayedColumns: string[] = ['item', 'evidencia', 'plazo', 'Quitar'];
  listEvidencia: Array<{ descripcion: string, plazo: String }> = [];
  dataSource = this.listEvidencia;

  listActividad: ActividadResponse[];
  listEquipo: any[] = [];

  formPrioridad = this._formBuilder.group({
    frmDescripcionIndicador: ['', Validators.required],
    frmDetalleIndicador: ['', Validators.required],
    frmPeso: ['', Validators.required],
    frmTipoValorMeta: ['', Validators.required],
    frmValorMeta: [''],
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
    console.log(this.data);
    this.listarTipoValorMeta();
  }

  onKey(event) {
    this.contadorTxtArea = event.target.value.length;
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
      this._notification.warning("Ingrese todos los campos obligatorios para continuar");
    } else {
      this.listEvidencia.push({
        descripcion: this.formEvidencia.value.frmDescripcion,
        // plazo: this.formTareasListadas.value.frmDateTarea._d.toLocaleDateString()
        plazo: moment(this.formEvidencia.value.frmPlazo._d).format('YYYY-MM-DDTHH:mm:ss')
      });
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

    let prioridad = new PrioridadExistDto();
    prioridad.idPrioridad = this.data.element.idPrioridad;

    let votante = new VotanteExistDto();
    votante.idVotante = this.data.idVotante;

    let tipoValorMeta = new TipoValorMeta();
    tipoValorMeta.idTipoValorMeta = this.formPrioridad.value.frmTipoValorMeta;

    let indicador = new IndicadorExistDto();
    indicador.descripcion = this.formPrioridad.value.frmDescripcionIndicador;
    indicador.detalle = this.formPrioridad.value.frmDetalleIndicador;
    indicador.peso = this.formPrioridad.value.frmPeso;
    indicador.tipoValorMeta = tipoValorMeta;
    indicador.valorMeta = this.formPrioridad.value.frmValorMeta;

    let evidencias: EvidenciaExistDto[] = [];
    for (let i of this.listEvidencia) {
      let e = new EvidenciaExistDto();
      e.descripcion = i.descripcion;
      e.plazo = i.plazo;

      evidencias.push(e);
      e = null;
    }

    let prioridadExistDto = new PrioridadExistRequestDto();
    prioridadExistDto.prioridad = prioridad;
    prioridadExistDto.votante = votante;
    prioridadExistDto.indicador = indicador;
    prioridadExistDto.listEvidencia = evidencias;
    // console.log(prioridadExistDto)

    this.confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de continuar?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {

        this._grService.registrarIndicadorExistPrioridad(prioridadExistDto).then(data => {
          this._notification.success("Se registró correctamente");
          // this.dialogRef.closeAll();
        });
        // this._dialog.closeAll();
      }
      this.confirmDialogRef = null;
    });

  }

}
