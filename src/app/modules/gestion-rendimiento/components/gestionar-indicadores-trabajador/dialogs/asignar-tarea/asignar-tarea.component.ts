import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { AppConfig } from '@core/configs';
import { ActividadResponse, IndicadorRequest } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import * as moment from 'moment';
import { EvidenciaExistRequestDto, IndicadorExistRequestDto } from '@data/models/gestion-rendimiento/indicador-exist-evidencia.model';
import { ConfirmarPanelComponent } from '@shared/confirmar-panel/confirmar-panel.component';

@Component({
  selector: 'app-asignar-tarea',
  templateUrl: './asignar-tarea.component.html',
  styleUrls: ['./asignar-tarea.component.scss']
})
export class AsignarTareaComponent implements OnInit {
  confirmDialogRef: MatDialogRef<ConfirmarPanelComponent>;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  listEvidencia: Array<{ descripcion: string, plazo: String }> = [];
  dataSource = this.listEvidencia;
  displayedColumns: string[] = ['item', 'tarea', 'plazo', 'Quitar'];

  minFechaTarea = AppConfig.MAX_FECHA_NACIMIENTO;
  listActividad: ActividadResponse[];

  formEvidenciasListadas = this._formBuilder.group({
    frmDescripcionEvidencia: [''],
    frmFechaLimiteEvidencia: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private _grService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
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
            // this.dialogRef.close();
            this._dialog.closeAll();
          } else {
            this._notification.warning("Registrar Evidencia: Se produjo un error");
            this._dialog.closeAll();
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

    let indicador = new IndicadorRequest();
    indicador.idIndicador = this.data.element.idIndicador;

    return {
      indicador: indicador,
      listEvidencia: listEvidencia,
    };
  }

}
