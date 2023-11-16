import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppConfig } from '@core/configs';
import { NotificationService } from '@core/services';
import { Actividad } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-registrar-indicador',
  templateUrl: './registrar-indicador.component.html',
  styleUrls: ['./registrar-indicador.component.scss']
})
export class RegistrarIndicadorComponent implements OnInit {
  listActividad: Actividad[];
  listEquipo: any[] = [];
  minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;

  displayedColumns: string[] = ['N°', 'Evidencia', 'plazo', 'Quitar'];
  listEvidencia: Array<{ nombreEvidencia: string, plazo: String }> = [];
  dataSource = this.listEvidencia;

  formIndicador = this._formBuilder.group({
    frmTrabajador: [''],
    frmPrioridad: ['', Validators.required],
    frmIndicador: [''],
    frmValorMeta: [''],
    frmPeso: [''],
  });

  formTarea = this._formBuilder.group({
    frmDescripcionEvidencia: [''],
    frmPlazoEvidencia: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private _grService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    this.listarActividades();
    this.listarEquipo();
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
      }
    });
  }

  crearTareaSinActividad() {

  }
  
  registrarTareasSinActividad() {

  }

}
