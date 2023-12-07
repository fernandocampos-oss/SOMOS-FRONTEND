import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from '@core/configs';
import { NotificationService } from '@core/services';
import { EvidenciaRequest } from '@data/models/gestion-rendimiento/indicador-dto.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

@Component({
  selector: 'app-edit-master',
  templateUrl: './edit-master.component.html',
  styleUrls: ['./edit-master.component.scss']
})
export class EditMasterComponent implements OnInit {
  minFechaEvidencia = AppConfig.MAX_FECHA_NACIMIENTO;
  evidencia: EvidenciaRequest;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    // public _dialogRef: MatDialogRef<EditMasterComponent>,
    private _dialogRef: MatDialog,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    console.log(">>", this.data);
    this.getModel();
  }

  getModel() {
    this.evidencia = new EvidenciaRequest();
    this.evidencia.descripcion = this.data.model.descripcion;
    this.evidencia.plazo = this.data.model.plazo;
  }

  async modificarEvidencia() {
    if (this.evidencia != null) {
      let update = await this._grService.modificarEvidencia(this.data.model.idEvidencia, this.evidencia).then((data) => {
        if (data = 1) {
          this._notification.success("Evidencia actualizada correctamente");
          this._dialogRef.closeAll();
          // this._dialogRef.close();
        } else {
          this._notification.error("Actualizar Evidencia: Error");
        }
      });
    }
  }

}
