import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSession } from '@data/models';
import { AuthService, UsuarioService, ZonaService } from '@data/services';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-requerimiento-register-update',
  templateUrl: './requerimiento-register-update.component.html',
  styleUrls: ['./requerimiento-register-update.component.scss']
})
export class RequerimientoRegisterUpdateComponent implements OnInit {
  user: UserSession;
  form: FormGroup;
  zona: string='';
  constructor(private _authService: AuthService,
              private _userService: UsuarioService,
              private _zonaService: ZonaService,
              private _fb: FormBuilder) { 
  }

  ngOnInit(): void {
    this._createForm();
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe( data =>{
      this._zonaService.get(data.idZonaControl).subscribe(info=>{
        this.zona = info.descripcion;
      })
    }
    )
  }
  private _createForm() {
    this.form = this._fb.group({
      frmNombre: [null, [Validators.required]],
      frmDescripcion: [null, [Validators.required]],
      frmTipo: [null, [Validators.required]],
      frmAreaSolicitante: [null, [Validators.required]],
      frmAreaReceptora: [null, [Validators.required]],
    });
  }
}
