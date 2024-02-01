import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { AuthService, UsuarioService } from '@data/services';

@Component({
  selector: 'app-update-correo-user',
  templateUrl: './update-correo-user.component.html',
  styleUrls: ['./update-correo-user.component.scss']
})
export class UpdateCorreoUserComponent implements OnInit {

  ctrlToken = new FormControl(null, Validators.required);

  constructor(@Inject(MAT_DIALOG_DATA) public data  : any,
              private _notification                 : NotificationService,
              private _usuarioService               : UsuarioService,
              private dialogRef                     : MatDialog,
              private _authService                  : AuthService,) { }

  ngOnInit(): void {
    
  }

  confirmChange(){
    if (this.ctrlToken.valid){
      this._usuarioService.updateCorreoChange(this._authService.getUserSession().id, {token: this.ctrlToken.value, nuevoCorreo: this.data.correo}).subscribe((data)=>{
        this._notification.success('Se realizó el cambio de correo electrónico correctamente');
        this.dialogRef.closeAll()
      })
    }

  }
}
