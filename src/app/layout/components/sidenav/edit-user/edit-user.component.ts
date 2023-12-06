import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@core/services';
import { AuthService } from '@data/services/auth.service';
import { UsuarioService } from '@data/services/usuario.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  distribucionTotal: number = 2;

  applicationFile: any = File;
  retrievedImage: any;
  isImageUpdate = false;
  
  firmaFile: any = File;
  firmaImage: any;
  isFirmaUpdate = false;

  dataUsuario = Object();

  formPerfil = this._fb.group({
    frmCodPlanilla: [null],
    frmCargo: [null],
    frmRed: [null],
    frmUnidad: [null],
    frmCorreo: [null, Validators.required],
    frmCelular: [null, Validators.required]
  })

  constructor(private _authService   : AuthService,
              private _notification  : NotificationService,
              private responsive     : BreakpointObserver,
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
      this.formPerfil.controls.frmCodPlanilla.setValue(data.codigoPlanilla);
      this.formPerfil.controls.frmCargo.setValue(data.cargo);
      this.formPerfil.controls.frmRed.setValue(data.red);
      this.formPerfil.controls.frmUnidad.setValue(data.unidad);
      this.formPerfil.controls.frmCorreo.setValue(data.correo);
      this.formPerfil.controls.frmCelular.setValue(data.numeroCelular);
      console.log(data)
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
    this.isFirmaUpdate = true;
  }

}
