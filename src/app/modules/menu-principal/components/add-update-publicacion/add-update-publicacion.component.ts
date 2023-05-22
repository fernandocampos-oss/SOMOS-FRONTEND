import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-add-update-publicacion',
  templateUrl: './add-update-publicacion.component.html',
  styleUrls: ['./add-update-publicacion.component.scss']
})
export class AddUpdatePublicacionComponent implements OnInit {

  applicationFile: any = File;
  retrievedImage: any;
  form: FormGroup;
  isImageUpdate = false;

  constructor(private _notification: NotificationService,
              private _fb: FormBuilder) { }

  ngOnInit(): void {
    this._createForm();
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
    reader.onload = _event => {
      this.applicationFile = files[0];
      this.retrievedImage = reader.result;
      this.isImageUpdate = true;
      console.log(this.applicationFile);
      console.log(this.retrievedImage);
    };
  }

  private _createForm() {
    this.form = this._fb.group({
      frmTítulo: [null, [Validators.required]],
      frmEnlace: [null, [Validators.required]],
    });
  }
  removeImage() {
    this.retrievedImage = null;
    this.applicationFile = null;
    this.isImageUpdate = true;
  }
}
