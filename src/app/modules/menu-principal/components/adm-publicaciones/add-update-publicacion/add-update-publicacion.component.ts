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
  listRedes : any[] = [
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
    // if(this.data.funcion == 2){
    //   this.getListRed();
    // }else{
    //   this.selected ='opcion_2';    
    // }
    this.getListRedesAsignadas();
  }

  // async getListRed() {
  //   let listRed = await this._menuService.getListRed().then((data) => {
  //     if (data) {
  //       this.listRedes = data;
  //       //2
  //       // this.listRedes2 = data;
  //       // let redesDescripcion = data.map((data) => data.descripcion);
  //       // console.log(redesDescripcion);
  //       // this.listRedes = redesDescripcion;
  //     } else {
  //       this._notification.warning('Lista de redes asistenciales vacia');
  //     }
  //   });
  // }

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