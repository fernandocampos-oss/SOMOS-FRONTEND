import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-edicion-evidencia',
  templateUrl: './edicion-evidencia.component.html',
  styleUrls: ['./edicion-evidencia.component.scss']
})
export class EdicionEvidenciaComponent implements OnInit {
  titleTarea: string;

  applicationFile: any = File;
  retrievedImage: any;
  width: number;
  height: number;
  isImageUpdate = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.titleTarea = this.data.model.nombreTarea;
  }

  onChangeImage(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this._notification.warning(
        'Por favor seleccione un archivo de tipo imagen'
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    console.log(files)
    reader.onload = _event => {
      const imgLoad = new Image();
      this.applicationFile = files[0];
      if (this.applicationFile.size >= 2097152){
        this._notification.warning('Tamaño de imagen excedido, máximo 2MB');
        return;
      }
      else{
        imgLoad.src = (reader.result as string);
        imgLoad.onload = () => {
          this.width = imgLoad.width;
          this.height = imgLoad.height;
        };
        this.retrievedImage = reader.result;
        // this.formDatosGenerales.controls.ctrlImgGrupo64.setValue(this.retrievedImage.split(',')[1]);
        this.isImageUpdate = true;
      }
    };
  }

  removeImage() {
    this.retrievedImage = null;
    // this.formDatosGenerales.controls.ctrlImgGrupo64.reset();
    this.applicationFile = null;
    this.isImageUpdate = true;
  }

}
