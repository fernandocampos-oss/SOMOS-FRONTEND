import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppConfig } from '@core/configs';
import { NotificationService } from '@core/services';
import { ActividadResponse, IndicadorResponse} from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { ConfirmarPanelComponent } from '@shared/confirmar-panel/confirmar-panel.component';

import * as moment from 'moment';
import { EvidenciaExistRequestDto, IndicadorExistRequestDto } from '@data/models/gestion-rendimiento/indicador-exist-evidencia.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

@Component({
  selector: 'app-asignar-evidencia',
  templateUrl: './asignar-evidencia.component.html',
  styleUrls: ['./asignar-evidencia.component.scss']
})
export class AsignarEvidenciaComponent implements OnInit {
  confirmDialogRef: MatDialogRef<ConfirmarPanelComponent>;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  listEvidencia: Array<{ descripcion: string, plazo: String }> = [];
  dataSource = this.listEvidencia;
  displayedColumns: string[] = ['item', 'tarea', 'plazo', 'Quitar'];

  minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;
  listActividad: ActividadResponse[];

  formEvidenciasListadas = this._formBuilder.group({
    frmDescripcionEvidencia: [''],
    frmFechaLimiteEvidencia: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AsignarEvidenciaComponent>,
    private _dialog: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private _grService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
  }

  crearEvidencia() {
    // console.log(this.formTareasListadas.value);
    if (this.formEvidenciasListadas.value.frmDescripcionEvidencia == undefined || this.formEvidenciasListadas.value.frmFechaLimiteEvidencia == undefined ||
      this.formEvidenciasListadas.value.frmDescripcionEvidencia == '' || this.formEvidenciasListadas.value.frmFechaLimiteEvidencia == '') {
      this._notification.warning("Se deben ingresar los datos para continuar");
    } else {
      this.listEvidencia.push({
        descripcion: this.formEvidenciasListadas.value.frmDescripcionEvidencia,
        // plazo: this.formTareasListadas.value.frmDateTarea._d.toLocaleDateString()
        plazo: moment(this.formEvidenciasListadas.value.frmFechaLimiteEvidencia._d).format('YYYY-MM-DDTHH:mm:ss')
      });
      this.table.renderRows();
    }
  }
  deleteEvidencia(index) {
    this.listEvidencia.splice(index, 1);
    this.table.renderRows();
  }

  async registrarEvidencia() {
    this.confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estás seguro de continuar?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const model = this._getModelSinActividad();

        this._grService.registrarEvidenciaExistIndicador(model).then((data: any) => {
          if (data = 1) {
            this._notification.success("Se registró correctament");
            this.dialogRef.close(true);
          } else {
            this._notification.warning("Registrar Evidencia: Se produjo un error");
            this.dialogRef.close(true);
          }
        });

      }
      this.confirmDialogRef = null;
    });
  }

  private _getModelSinActividad(): IndicadorExistRequestDto {
    let listEvidencia: EvidenciaExistRequestDto[] = [];
    for (let i of this.listEvidencia) {
      let e = new EvidenciaExistRequestDto();
      e.descripcion = i.descripcion;
      e.plazo = i.plazo;

      listEvidencia.push(e);
      e = null;
    }

    let indicador = new IndicadorResponse();
    indicador.idIndicador = this.data.element.idIndicador;

    return {
      indicador: indicador,
      listEvidencia: listEvidencia,
    };
  }

}
