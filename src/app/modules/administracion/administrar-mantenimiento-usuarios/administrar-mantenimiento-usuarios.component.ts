import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '@data/services';
import { Usuario } from '@data/models';
import { NotificationService } from '@core/services';
import { RequestUsuarioUpdateData } from '@data/models/usuario/usuario-update.model';

@Component({
  selector: 'app-administrar-mantenimiento-usuarios',
  templateUrl: './administrar-mantenimiento-usuarios.component.html',
  styleUrls: ['./administrar-mantenimiento-usuarios.component.scss']
})
export class AdministrarMantenimientoUsuariosComponent implements OnInit {

  numeroDocumento: string;
  dataUsuario: Usuario;

  formPerfil = this._fb.group({
    frmCodPlanilla: [{value: null, disabled: true}],
    frmCargo: [{value: null, disabled: true}],
    frmRed: [{value: null, disabled: true}],
    frmUnidad: [{value: null, disabled: true}],
    frmCorreo: [null, Validators.required],
    frmCelular: [null, Validators.required]
  });

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    public _fb: FormBuilder,
    private _notification: NotificationService,
    private _userService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  buscarUsuario() {
    if (this.numeroDocumento) {
      this._userService.findByNumeroDocumento(this.numeroDocumento.trim()).subscribe( data => {
        if (data && data.idUsuario) {
          this.dataUsuario = data;
          this.formPerfil.controls.frmCodPlanilla.setValue(data.codigoPlanilla);
          this.formPerfil.controls.frmCargo.setValue(data.cargo);
          this.formPerfil.controls.frmRed.setValue(data.red);
          this.formPerfil.controls.frmUnidad.setValue(data.unidad);
          this.formPerfil.controls.frmCorreo.setValue(data.correo);
          this.formPerfil.controls.frmCelular.setValue(data.numeroCelular);
          this.formPerfil.controls.frmCorreo.valueChanges.subscribe(val => {
            this.formPerfil.controls.frmCorreo.setValue(val.replace(/\s/g, ''), { emitEvent: false });
          });
        } else {
          this._notification.warning('No se encontraron resultados');
          this.limpiar();
        }
      });
    }
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }

  guardarCambios() {
    if (this.formPerfil.valid && this.dataUsuario && this.dataUsuario.idUsuario){
      this._userService.updateDataUserAdmin(this.dataUsuario.idUsuario, this.getModelUpdate()).subscribe(data=> {
          this._notification.success('Datos actualizados exitosamente');
      });
    }
  }

  limpiar() {
    this.dataUsuario = new Usuario();
    this.formPerfil.controls.frmCodPlanilla.setValue('');
    this.formPerfil.controls.frmCargo.setValue('');
    this.formPerfil.controls.frmRed.setValue('');
    this.formPerfil.controls.frmUnidad.setValue('');
    this.formPerfil.controls.frmCorreo.setValue('');
    this.formPerfil.controls.frmCelular.setValue('');
  }

  getModelUpdate(): RequestUsuarioUpdateData {
    return {
      correo: this.formPerfil.controls.frmCorreo.value,
      numeroCelular: this.formPerfil.controls.frmCelular.value,
      imagenPerfilBase64: '',
      imagenFirmaBase64: ''
    };
  }
}
