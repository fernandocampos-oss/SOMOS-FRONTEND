import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { EvidenciaSustentoRequestDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';

@Component({
  selector: 'app-registrar-sustento',
  templateUrl: './registrar-sustento.component.html',
  styleUrls: ['./registrar-sustento.component.scss']
})
export class RegistrarSustentoComponent implements OnInit {
  form: FormGroup;

  nameImage: string = '';

  retrievedPdf: any;
  nombrePdf = '';
  isPdfUpdate = false;
  globalBase64: any;
  globalextension: string = '';
  pdfExtension: string = '';
  contadorTxtArea: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private _dialogRef: MatDialog,
    private _fb: FormBuilder,
    private _requerimientoService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    this.form = this._fb.group({
      frmDescripcion: [null, [Validators.required, Validators.min(20), Validators.maxLength(300)]],
      // frmPorcentajeAvance: [(this.data.model.porcentajeInicial > 0 ? 90 : ''), [Validators.required, Validators.min(1), Validators.max(100)]],
      // frmAreaSolicitante: 'SGSA',
    });
  }

  onKey(event) {
    this.contadorTxtArea = event.target.value.length;
  }

  onChangeFilePdf(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    this.nombrePdf = files[0].name;
    if (mimeType.match(/pdf\/*/) == null) {
      this._notification.warning(
        'Por favor seleccione un archivo PDF'
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      const fileApp = files[0];
      if (fileApp.size >= 4194304) {
        this._notification.warning('Tamaño de archivo excedido, máximo 4MB');
        return;
      }
      this.retrievedPdf = reader.result;
      this.pdfExtension = fileApp.type;
      // this.isPdfUpdate = true;
    };
  }

  removePdf() {
    this.retrievedPdf = null;
    this.isPdfUpdate = false;
  }

  async registrarEvidencia() {
    // if (this.retrievedImage == undefined || !this.form.valid) {
    //   this._notification.warning(
    //     'Complete todos los campos obligatorios e ingrese una imagen'
    //   );
    //   this.form.markAllAsTouched();
    //   return;
    // }
    // else {
    const model = this._getModel();

    let register = await this._requerimientoService.crearSustentoEvidencia(model).then((data) => {
      this._notification.success("Evidencia registrada correctamente")
    });
    this._dialogRef.closeAll();
    // }
  }

  private _getModel(): EvidenciaSustentoRequestDto {
    let completo = this.nameImage;
    const nombreFile = completo.lastIndexOf('.');
    // // archivo.nombre = completo.substring(0, nombreFile);
    // // archivo.extension = completo.substring(nombreFile + 1);

    this.globalBase64 = this.retrievedPdf.split(',')[1];
    this.globalextension = this.pdfExtension.split('/')[1];

    return {
      idEvidencia: this.data.model.idEvidencia,
      sustentoDescripcion: this.form.value.frmDescripcion,
      extension: this.globalextension,
      fileBase64: this.globalBase64
    };
  }

}
