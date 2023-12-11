import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { RequestUsuarioUpdateData } from '@data/models/usuario/usuario-update.model';
import { AuthService } from '@data/services/auth.service';
import { UsuarioService } from '@data/services/usuario.service';
import { UpdateCorreoUserComponent } from '../change-passw/update-correo-user/update-correo-user.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  distribucionTotal: number = 2;
  correoComprobacion = '';

  applicationFile: any = File;
  retrievedImage: any;
  isImageUpdate = false;
  
  firmaFile: any = File;
  firmaImage: any;
  isFirmaUpdate = false;

  dataUsuario = Object();

  formPerfil = this._fb.group({
    frmCodPlanilla: [{value: null, disabled: true}],
    frmCargo: [{value: null, disabled: true}],
    frmRed: [{value: null, disabled: true}],
    frmUnidad: [{value: null, disabled: true}],
    frmCorreo: [null, Validators.required],
    frmCelular: [null, Validators.required]
  })

  constructor(private _authService   : AuthService,
              private dialog         : MatDialog,
              private _notification  : NotificationService,
              private responsive     : BreakpointObserver,
              private _dialogRef     : MatDialogRef<void>,
              public _fb             : FormBuilder,
              private _userService   : UsuarioService,) { }

  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
      ])
      .subscribe(result => {
        this.distribucionTotal = 2;

        if (result.matches) {
          this.distribucionTotal = 1;
        }
      });
    this._userService.get(this._authService.getUserSession().id).subscribe(data =>{
      this.dataUsuario = data;
      this.correoComprobacion = data.correo;
      this.formPerfil.controls.frmCodPlanilla.setValue(data.codigoPlanilla);
      this.formPerfil.controls.frmCargo.setValue(data.cargo);
      this.formPerfil.controls.frmRed.setValue(data.red);
      this.formPerfil.controls.frmUnidad.setValue(data.unidad);
      this.formPerfil.controls.frmCorreo.setValue(data.correo);
      this.formPerfil.controls.frmCelular.setValue(data.numeroCelular);
      if (this.dataUsuario.imagenPerfilBase64) {
        this.retrievedImage = `data:image/png;base64,${this.dataUsuario.imagenPerfilBase64}`;
        this.isImageUpdate = true;
      }
      if (this.dataUsuario.imagenFirmaBase64) {
        this.firmaImage = `data:image/png;base64,${this.dataUsuario.imagenFirmaBase64}`;
        this.isFirmaUpdate = true;
      }
    })
    this.formPerfil.controls.frmCorreo.valueChanges.subscribe(val => {
      this.formPerfil.controls.frmCorreo.setValue(val.replace(/\s/g, ""), { emitEvent: false })
    })
  }

  onChangeImage(files, type) {
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
      var comprobacionTamanio;
      if(type == 2){
        this.firmaFile = files[0];
        comprobacionTamanio = this.firmaFile;
      }
      else{
        this.applicationFile = files[0];  
        comprobacionTamanio = this.applicationFile;      
      }
      if (comprobacionTamanio.size >= 2097152) {
        this._notification.warning('Tamaño de imagen excedido, máximo 2MB');
        return;
      }
      else {
        imgLoad.src = <string>reader.result;
        imgLoad.onload = () => {
        };
        if (type == 2) {
          this.firmaImage = reader.result;
          this.isFirmaUpdate = true;
        }
        else{
          this.retrievedImage = reader.result;
          this.isImageUpdate = true;
        }
      }
    };
  }

  removeFirma() {
    this.firmaFile = null;
    this.firmaImage = null;
    this.isFirmaUpdate = false;
  }

  saveChanges(){
    if (this.formPerfil.valid){
      this._userService.updateDataUser(this._authService.getUserSession().id, this.getModelUpdate()).subscribe((data)=>{
        console.log(data);
        if (this.correoComprobacion != this.formPerfil.controls.frmCorreo.value) {
          const dialogRef: MatDialogRef<UpdateCorreoUserComponent> = this.dialog.open(UpdateCorreoUserComponent, {
              disableClose: true,
              autoFocus: false,
              data:{
                correo: this.formPerfil.controls.frmCorreo.value
              }
            });
        }
        else{
          this._notification.success('Datos actualizados Correctamente');
          this._dialogRef.close();
        }
      })
    }
  }

  getModelUpdate(): RequestUsuarioUpdateData{
    let getImagenPerfil = null;
    let getImagenFirma = null;

    if (this.isImageUpdate) getImagenPerfil = this.retrievedImage.split(',')[1];
    if (this.isFirmaUpdate) getImagenFirma = this.firmaImage.split(',')[1];
    

    return {
      correo: this.formPerfil.controls.frmCorreo.value,
      numeroCelular: this.formPerfil.controls.frmCelular.value,
      imagenPerfilBase64: getImagenPerfil,
      imagenFirmaBase64: getImagenFirma
    }
  }
}
