import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { Role } from '@data/enums';
import { PublicacionRequest } from '@data/models/menu-principal/menu-publicacion.model';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { AsignacionRolSectorizacionService } from '@data/services/asignacion-rol-sectorizacion.service';

@Component({
  selector: 'app-editar-publicacion',
  templateUrl: './editar-publicacion.component.html',
  styleUrls: ['./editar-publicacion.component.scss']
})
export class EditarPublicacionComponent implements OnInit {
  width: number;
  height: number;

  applicationFile: any = File;
  retrievedImage: any;
  form: FormGroup;
  isImageUpdate = false;

  rolCentral = Role.ADMIN_CENTRAL;
  rolRed = Role.ADMIN_SEDE;
  rolTemporal_3: any;
  rolTemporal_4: any;
  roles: any;

  selected = 'opcion_1';
  selectedSave = 1;

  listRedes: any[] = [
    { codRed: '0221', descripcion: 'RED ASISTENCIAL HUÁNUCO' },
    { codRed: '0213', descripcion: 'RED ASISTENCIAL ICA' },
    { codRed: '0225', descripcion: 'RED ASISTENCIAL HUANCAVELICA' },
    { codRed: '0206', descripcion: 'RED PRESTACIONAL REBAGLIATI' },
    { codRed: '0204', descripcion: 'RED PRESTACIONAL ALMENARA' },
    { codRed: '0100', descripcion: 'SEDE CENTRAL LIMA-AFESSALUD' },
    { codRed: '0222', descripcion: 'RED ASISTENCIAL PASCO' },
    { codRed: '0231', descripcion: 'RED ASISTENCIAL UCAYALI' },
    { codRed: '0200', descripcion: 'SEDE CENTRAL LIMA-Fondo Salud' },
    { codRed: '0208', descripcion: 'RED PRESTACIONAL SABOGAL' },
    { codRed: '0216', descripcion: 'RED ASISTENCIAL PIURA' },
    { codRed: '0226', descripcion: 'RED ASISTENCIAL PUNO' },
    { codRed: '0236', descripcion: 'RED PRESTACIONAL LAMBAYEQUE' },
    { codRed: '0233', descripcion: 'RED ASISTENCIAL AMAZONAS' },
    { codRed: '0201', descripcion: 'CENTRO NACIONAL DE SALUD RENAL' },
    { codRed: '0202', descripcion: 'INST. NACIONAL CARDIOVASCULAR' },
    { codRed: '0212', descripcion: 'RED ASISTENCIAL JUNIN' },
    { codRed: '0219', descripcion: 'RED ASISTENCIAL AREQUIPA' },
    { codRed: '0215', descripcion: 'RED ASISTENCIAL CUSCO' },
    { codRed: '0211', descripcion: 'RED ASISTENCIAL MADRE DE DIOS' },
    { codRed: '0229', descripcion: 'RED ASISTENCIAL LORETO' },
    { codRed: '0232', descripcion: 'RED ASISTENCIAL LA LIBERTAD' },
    { codRed: '0214', descripcion: 'RED ASISTENCIAL APURIMAC' },
    { codRed: '0220', descripcion: 'RED ASISTENCIAL CAJAMARCA' },
    { codRed: '0228', descripcion: 'RED ASISTENCIAL TACNA' },
    { codRed: '0217', descripcion: 'RED ASISTENCIAL JULIACA' },
    { codRed: '0235', descripcion: 'RED ASISTENCIAL JAEN' },
    { codRed: '0218', descripcion: 'RED ASISTENCIAL TARAPOTO' },
    { codRed: '0230', descripcion: 'RED ASISTENCIAL TUMBES' },
    { codRed: '0227', descripcion: 'RED ASISTENCIAL ANCASH' },
    { codRed: '0224', descripcion: 'RED ASISTENCIAL AYACUCHO' },
    { codRed: '0234', descripcion: 'RED ASISTENCIAL MOYOBAMBA' },
    { codRed: '0210', descripcion: 'RED ASISTENCIAL HUARAZ' },
    { codRed: '0209', descripcion: 'RED ASISTENCIAL MOQUEGUA' },
  ];
  // selectedItems: any[] = [];
  listRedesAsignadas = [];
  redItemSeleccionadoRol_3: any = [];
  redItemSeleccionadoRol_3_4: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditarPublicacionComponent>,
    private _notification: NotificationService,
    private _fb: FormBuilder,
    private _menuService: MenuPrincipalService,
    private _sectorizacionService: AsignacionRolSectorizacionService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this._createForm();
    // console.log(this.selected);
    this.getRoles();
    // if(this.data.funcion == 2){
    //   this.getListRed();
    // }else{
    //   this.selected ='opcion_2';
    // }
    this.getListRedesAsignadas();
  }

  async getListRedesAsignadas() {
    if (this.rolTemporal_3 === 3 && this.rolTemporal_4 === 4) {
      let listRed = await this._sectorizacionService.getListRed().then((data) => {
        if (data) {
          this.listRedesAsignadas = data;
        }
      });
    } else {
      let listRed = await this._menuService.getListRedesAsignadas().then((data) => {
        if (data) {
          this.listRedesAsignadas = data;
        } else {
          this._notification.warning('Lista de redes asistenciales vacia');
        }
      });
    }
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
      if (this.applicationFile.size >= 2097152) {
        this._notification.warning('Tamaño de imagen excedido, máximo 2MB');
        return;
      }
      else {
        imgLoad.src = <string>reader.result;
        imgLoad.onload = () => {
          this.width = imgLoad.width;
          this.height = imgLoad.height;
          console.log(this.width, '||', this.height);
        };
        this.retrievedImage = reader.result;
        this.isImageUpdate = true;
      }
    };
  }

  private _createForm() {
    this.form = this._fb.group({
      frmTitulo: [null, [Validators.required]],
      frmDescripcion: [null, [Validators.required]],
      frmEnlace: [''],
    });

    this.form = this._fb.group({
      frmTitulo: [this.data.obj.titulo, [Validators.required]],
      frmDescripcion: [this.data.obj.descripcion, [Validators.required]],
      frmEnlace: [this.data.obj.urlRedireccion],
    });
    this.retrievedImage = `data:image/jpeg;base64,${this.data.obj.imagenBase64}`;

    if (this.data.obj.tipoAlcance === 1) {
      this.selected = 'opcion_1';
      this.selectedSave = 1;
    } else {
      this.selected = 'opcion_2';
      this.selectedSave = 2;
    }

    if (this.data.obj.redes) {
      for (let i = 0; i < this.data.obj.redes.length; i++) {
        this.redItemSeleccionadoRol_3.push(this.data.obj.redes[i]);
        this.redItemSeleccionadoRol_3_4.push(this.data.obj.redes[i]);
      }
    }

  }

  removeImage() {
    this.retrievedImage = null;
    this.applicationFile = null;
    this.isImageUpdate = true;
  }

  UpdatePublicacion_rol_3() {
    if (this.retrievedImage == undefined || !this.form.valid) {
      this._notification.warning('Por favor complete todos los campos obligatorios e ingrese una imagen');
      this.form.markAllAsTouched();
      return;
    }
    else {
      if(this.selectedSave == 2 && this.redItemSeleccionadoRol_3_4.length == 0){
        this._notification.warning('Seleccione una Red Asistencial para este tipo de alcance');
      }
      else{
        const model = this._getModel_rol_3();
  
        const idPublicacion = this.data.obj.idPublicacion;
        this._menuService.updatePublicacion(idPublicacion, model).subscribe(() => {
          this._notification.success('Publicación actualizada correctamente');
        });
        this.dialogRef.close();
      }
    }
  }
  private _getModel_rol_3(): PublicacionRequest {
    let redes: string[] = [];
    if (this.redItemSeleccionadoRol_3) {
      for (let a of this.redItemSeleccionadoRol_3) {
        redes.push(a);
      }
    }

    return {
      titulo: this.form.value.frmTitulo,
      descripcion: this.form.value.frmDescripcion,
      imagenBase64: this.retrievedImage.split(',')[1],
      urlRedireccion: this.form.value.frmEnlace,
      alcance: 2,
      redes: redes,
    };
  }

  UpdatePublicacion_rol_4_3() {
    if (this.retrievedImage == undefined || !this.form.valid) {
      this._notification.warning('Por favor complete todos los campos obligatorios e ingrese una imagen');
      this.form.markAllAsTouched();
      return;
    }
    else {
      if(this.selectedSave == 2 && this.redItemSeleccionadoRol_3_4.length == 0){
        this._notification.warning('Seleccione una Red Asistencial para este tipo de alcance');
      }
      else{
        const model = this._getModel_rol_4_3();
        const idPublicacion = this.data.obj.idPublicacion;
  
        this._menuService.updatePublicacion(idPublicacion, model).subscribe(() => {
            this._notification.success('Publicación actualizada correctamente');
          });
        this.dialogRef.close();
      }
    }
  }
  private _getModel_rol_4_3(): PublicacionRequest {
    let redes: string[] = [];
    if (this.redItemSeleccionadoRol_3_4) {
      for (let a of this.redItemSeleccionadoRol_3_4) {
        redes.push(a);
      }
    }

    if (this.selectedSave == 1) {
      redes = [];
    }

    return {
      titulo: this.form.value.frmTitulo,
      descripcion: this.form.value.frmDescripcion,
      imagenBase64: this.retrievedImage.split(',')[1],
      urlRedireccion: this.form.value.frmEnlace,
      alcance: this.selectedSave,
      redes: redes,
    };
  }

  DeletePublicacion() {
    const idPublicacion = this.data.obj.idPublicacion;
    this._menuService.deletePublicacion(idPublicacion).subscribe(() => {
      this._notification.success('Publicación eliminada');
    });
    this.dialogRef.close();
  }

  capturaValorGlobal(event: any) {
    if (this.selected === 'opcion_1') {
      this.selectedSave = 1;
    } else {
      this.selectedSave = 2;
    }
  }

  getRoles() {
    let temporal = sessionStorage.getItem('_roles');
    this.roles = temporal ? `${temporal}` : '';
    this.roles = JSON.parse(temporal);
    if (this.roles.length == 1) {
      if (this.roles[0] === 'ROLE_3') {
        this.rolTemporal_3 = 3;
      }
      if (this.roles[0] === 'ROLE_4') {
        this.rolTemporal_3 = 3;
        this.rolTemporal_4 = 4;
      }
    } else {
      if (this.roles[0] === 'ROLE_3') {
        this.rolTemporal_3 = 3;
      }
      if (this.roles[1] === 'ROLE_4') {
        this.rolTemporal_4 = 4;
      }
    }
  }

}
