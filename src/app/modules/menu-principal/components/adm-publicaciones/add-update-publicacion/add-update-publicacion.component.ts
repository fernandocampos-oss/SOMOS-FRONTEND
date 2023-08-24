import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { Role } from '@data/enums';
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

  //roles
  rolCentral = Role.ADMIN_CENTRAL;
  rolRed = Role.ADMIN_SEDE;
  rolTemporal_3: any;
  rolTemporal_4: any;
  roles: any;

  //select global
  selected = 'opcion_1';
  selectedSave = 1;

  //check
  listRedes = [];
  selectedItems: any[] = []
  listRedesAsignadas = [];

  //2
  // listRedes2 = [];
  // selectedItems2: any[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddUpdatePublicacionComponent>,
    private _notification: NotificationService,
    private _fb: FormBuilder,
    private _menuService: MenuPrincipalService
  ) { }

  ngOnInit(): void {
    this._createForm();
    // console.log(this.selected);
    this.getRoles();
    this.getListRed();
    this.getListRedesAsignadas();
  }

  async getListRed() {
    let listRed = await this._menuService.getListRed().then((data) => {
      if (data) {
        this.listRedes = data;
        //2
        // this.listRedes2 = data;
        // let redesDescripcion = data.map((data) => data.descripcion);
        // console.log(redesDescripcion);
        // this.listRedes = redesDescripcion;
      } else {
        this._notification.warning('Lista de redes asistenciales vacia');
      }
    });
  }

  async getListRedesAsignadas() {
    let listRed = await this._menuService.getListRedesAsignadas().then((data) => {
      if (data) {
        this.listRedesAsignadas = data;
      } else {
        this._notification.warning('Lista de redes asistenciales vacia');
      }
    });
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
    if (this.data.funcion == 1) {
      this.form = this._fb.group({
        frmTitulo: [null, [Validators.required]],
        frmDescripcion: [null, [Validators.required]],
        frmEnlace: [''],
      });
    }
    if (this.data.funcion == 2) {
      this.form = this._fb.group({
        frmTitulo: [this.data.obj.titulo, [Validators.required]],
        frmDescripcion: [this.data.obj.descripcion, [Validators.required]],
        frmEnlace: [this.data.obj.urlRedireccion],
      });
      this.retrievedImage = `data:image/jpeg;base64,${this.data.obj.imagenBase64}`;
    }
  }
  removeImage() {
    this.retrievedImage = null;
    this.applicationFile = null;
    this.isImageUpdate = true;
  }

  NewPublicacion() {
    // console.log(this.selectedItems)
    if (this.retrievedImage == undefined || !this.form.valid) {
      this._notification.warning(
        'Por favor complete todos los campos obligatorios e ingrese una imagen'
      );
      this.form.markAllAsTouched();
      return;
    }
    else {
      const model = this._getModel();
      this._menuService
        .newPublicacion(model)
        .subscribe(() => {
          this._notification.success('Publicación registrada correctamente');
        });
      this.dialogRef.close();
    }
  }

  UpdatePublicacion() {
    if (this.retrievedImage == undefined || !this.form.valid) {
      this._notification.warning(
        'Por favor complete todos los campos obligatorios e ingrese una imagen'
      );
      this.form.markAllAsTouched();
      return;
    }
    else {
      const model = this._getModel();
      const idPublicacion = this.data.obj.idPublicacion;
      this._menuService
        .updatePublicacion(idPublicacion, model)
        .subscribe(() => {
          this._notification.success('Publicación actualizada correctamente');
        });
      this.dialogRef.close();
    }
  }

  DeletePublicacion() {
    const idPublicacion = this.data.obj.idPublicacion;
    this._menuService
      .deletePublicacion(idPublicacion)
      .subscribe(() => {
        this._notification.success('Publicación eliminada');
      });
    this.dialogRef.close();
  }

  private _getModel(): PublicacionRequest {

    let redes: string[] = [];
    for (let a of this.selectedItems) {
      redes.push(a);
    }
    if (this.selectedSave == 1) {
      redes = [];
    }

    // //2
    // let redes2: string[] = [];
    // for (let i of this.selectedItems2) {
    //   console.log('i',i);
    //   const resultado = this.listRedes2.find((red) => red.descripcion === i);
    //   console.log(resultado);
    //   redes2.push(resultado.codRed);
    // }
    // console.log(redes2);

    return {
      titulo: this.form.value.frmTitulo,
      descripcion: this.form.value.frmDescripcion,
      imagenBase64: this.retrievedImage.split(',')[1],
      urlRedireccion: this.form.value.frmEnlace,
      alcance: this.selectedSave,
      redes: redes,
    };
  }

  //select
  capturaValorGlobal(event: any) {
    // console.log(event.source.value);
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