import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { PublicacionRequest } from '@data/models/menu-principal/menu-publicacion.model';
import { MenuPrincipalService } from '@data/services/menu-principal.service';

@Component({
  selector: 'app-add-update-publicacion',
  templateUrl: './add-update-publicacion.component.html',
  styleUrls: ['./add-update-publicacion.component.scss']
})
export class AddUpdatePublicacionComponent implements OnInit {

  width: number;
  height: number;

  applicationFile: any = File;
  retrievedImage: any;
  form: FormGroup;
  isImageUpdate = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
               private _matDialog                 : MatDialog,
               private dialogRef                  : MatDialogRef<AddUpdatePublicacionComponent>,
               private _notification              : NotificationService,
               private _fb                        : FormBuilder,
               private _menuService               : MenuPrincipalService) { }

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
      var imgLoad = new Image();
      this.applicationFile = files[0];
      if(this.applicationFile.size >= 2097152){
        this._notification.warning('Tamaño de imagen excedido, máximo 2MB');
        return;
      }
      else{
        imgLoad.src = <string>reader.result;
        imgLoad.onload = () =>{
          this.width = imgLoad.width;
          this.height = imgLoad.height;
          console.log(this.width,'||',this.height);
        };
        this.retrievedImage = reader.result;
        this.isImageUpdate = true;
      }
    };
  }

  private _createForm() {
    if(this.data.funcion == 1){
      this.form = this._fb.group({
        frmTitulo: [null, [Validators.required]],
        frmDescripcion: [null, [Validators.required]],
        frmEnlace: [''],
      });
    }
    if(this.data.funcion == 2){
      this.form = this._fb.group({
        frmTitulo: [this.data.obj.titulo, [Validators.required]],
        frmDescripcion: [this.data.obj.descripcion, [Validators.required]],
        frmEnlace: [this.data.obj.urlRedireccion],
      });
      this.retrievedImage =`data:image/jpeg;base64,${this.data.obj.imagenBase64}`;
    }
  }
  removeImage() {
    this.retrievedImage = null;
    this.applicationFile = null;
    this.isImageUpdate = true;
  }

  NewPublicacion(){
    if(this.retrievedImage == undefined || !this.form.valid){
      this._notification.warning(
        'Por favor complete todos los campos obligatorios e ingrese una imagen'
      );
      this.form.markAllAsTouched();
      return;
    }
    else{
      const model = this._getModel();
      this._menuService
        .newPublicacion(model)
        .subscribe(()=>{
          this._notification.success('Publicación registrada correctamente');
        });
      this.dialogRef.close();
    }
  }
  UpdatePublicacion(){
    if(this.retrievedImage == undefined || !this.form.valid){
      this._notification.warning(
        'Por favor complete todos los campos obligatorios e ingrese una imagen'
      );
      this.form.markAllAsTouched();
      return;
    }
    else{
      const model = this._getModel();
      const idPublicacion = this.data.obj.idPublicacion;
      this._menuService
        .updatePublicacion(idPublicacion,model)
        .subscribe(()=>{
          this._notification.success('Publicación actualizada correctamente');
        });
      this.dialogRef.close();
    }
  }
  DeletePublicacion(){
    const idPublicacion = this.data.obj.idPublicacion;
    this._menuService
      .deletePublicacion(idPublicacion)
      .subscribe(()=>{
        this._notification.success('Publicación eliminada');
      });
    this.dialogRef.close();
  }
  private _getModel(): PublicacionRequest {
    return {
      titulo: this.form.value.frmTitulo,
      descripcion: this.form.value.frmDescripcion,
      imagenBase64: this.retrievedImage.split(',')[1],
      urlRedireccion: this.form.value.frmEnlace,
    };
  }
}