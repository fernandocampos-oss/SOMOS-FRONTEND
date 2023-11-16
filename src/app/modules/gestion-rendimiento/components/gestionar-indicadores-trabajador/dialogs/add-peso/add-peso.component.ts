import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-add-peso',
  templateUrl: './add-peso.component.html',
  styleUrls: ['./add-peso.component.scss']
})
export class AddPesoComponent implements OnInit {

  formPesoSelect = this._formBuilder.group({
    frmPeso: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private _grService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  async asignarPesoIndicador() {
    console.log("peso", this.formPesoSelect.value.frmPeso);
    let actualizar = await this._grService.asignarPesoIndicador(this.formPesoSelect.value.frmPeso, this.data.modal.idIndicador).then((data) => {
      if (data) {
        this._notification.success("Peso asignado correctamente");
        this._dialogRef.closeAll();
      } else {
        this._notification.error("Asignar Peso: Error")
      }
    });
  }

}
