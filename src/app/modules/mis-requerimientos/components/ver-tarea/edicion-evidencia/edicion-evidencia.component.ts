import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { EvidenciaRequest, Tarea } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-edicion-evidencia',
  templateUrl: './edicion-evidencia.component.html',
  styleUrls: ['./edicion-evidencia.component.scss']
})
export class EdicionEvidenciaComponent implements OnInit {
  titleTarea: string;
  form: FormGroup;

  width: number;
  height: number;
  applicationFile: any = File;
  retrievedImage: any;
  isImageUpdate = false;

  nameImage: string = '';
  sizeImage: number = 0;
  typeImage: string = '';

  selectedIndex = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private _dialogRef: MatDialog,
    private _fb: FormBuilder,
    private _requerimientoService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    // console.log(this.data)
    this.titleTarea = this.data.model.nombreTarea;
    this._createForm();

  }

  private _createForm() {
    this.form = this._fb.group({
      frmDescripcion: [null, [Validators.required, Validators.maxLength(300)]],
      frmPorcentajeAvance: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      // frmAreaSolicitante: 'SGSA',
    });
  }

  onChangeImage(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this._notification.warning('El archivo no es compatible, debe eligir una imagen');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      const imgLoad = new Image();
      this.applicationFile = files[0];
      if (this.applicationFile.size >= 2097152) {
        this._notification.warning('Tamaño de imagen excedido, máximo 2MB');
        return;
      }
      else {
        imgLoad.src = (reader.result as string);
        imgLoad.onload = () => {
          this.width = imgLoad.width;
          this.height = imgLoad.height;
          // console.log(this.width, '||', this.height);
        };
        this.retrievedImage = reader.result;
        // this.formDatosGenerales.controls.ctrlImgGrupo64.setValue(this.retrievedImage.split(',')[1]);
        this.isImageUpdate = true;

        this.nameImage = files[0].name;
        this.sizeImage = files[0].size;
        this.typeImage = files[0].type;
      }
    };
  }

  removeImage() {
    this.retrievedImage = null;
    // this.formDatosGenerales.controls.ctrlImgGrupo64.reset();
    this.applicationFile = null;
    this.isImageUpdate = true;
  }

  async registrarEvidencia() {
    if (this.retrievedImage == undefined || !this.form.valid) {
      this._notification.warning(
        'Complete todos los campos obligatorios e ingrese una imagen'
      );
      this.form.markAllAsTouched();
      return;
    }
    else {
      const model = this._getModel();

      let register = await this._requerimientoService.registrarEvidencia(model).then((data) => {
        this._notification.success("Evidencia registrada correctamente")

      });
      this._dialogRef.closeAll();
    }
  }

  private _getModel(): EvidenciaRequest {
    let t = new Tarea();
    t.idTarea = this.data.model.idTarea;

    let completo = this.nameImage;
    const nombreFile = completo.lastIndexOf('.');
    // archivo.nombre = completo.substring(0, nombreFile);
    // archivo.extension = completo.substring(nombreFile + 1);

    return {
      descripcion: this.form.value.frmDescripcion,
      porcentajeAvance: this.form.value.frmPorcentajeAvance,
      tarea: t,
      imagenBase64: this.retrievedImage.split(',')[1],

      nombreImagen: this.nameImage,
      sizeImagen: this.sizeImage,
      tipoImagen: this.typeImage,
      extension: completo.substring(nombreFile + 1),
      idRequerimiento: this.data.idRequerimiento
    };
  }

  onTabChanged(event) {
    if (event.index == 1 && !this.form.valid) {
      this.selectedIndex = 0;
      this._notification.warning("Ingrese los campos para continuar");
    }
  }

  next() {
    this.selectedIndex = 1;
  }

}
