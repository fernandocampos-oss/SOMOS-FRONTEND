import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { Role } from '@data/enums';
import { PublicacionRequest } from '@data/models/menu-principal/menu-publicacion.model';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { AsignacionRolSectorizacionService } from '@data/services/asignacion-rol-sectorizacion.service';
import { InscripcionService } from '@data/services/inscripcion.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CreateInscripcionRequest } from '@data/models/inscripcion/inscripcion.model';

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

  
  ctrlCampania = new FormControl(false);
  ctrlCaracteristicas = new FormControl([]);

  showExtraCampania = false;
  
  opcionesCampania = [
    {nombre: '¿Pide imagen?'},
    {nombre: '¿Requiere un texto?'},
    {nombre: '¿Habrá inscripción grupal?'},
    {nombre: '¿Se realizarán votaciones?'},
  ]
  
  showHelpImagen = false;
  showHelpDescripcion = false;

  formDatosCampania = this._fb.group({
    frmTxtImagen:['Imagen'],
    frmTxtDescripcion:['Descripcion'],
    frmLimitGrupo:[2]
  });  

  myControlPersonal = new FormControl();
  filteredOptionsPersonal: Observable<any[]>;
  listPersonal = [];
  personalSeleccionadoTmp: any;
  
  personasResponsablesInscr = [];

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
    private inscripcionService: InscripcionService,
    private _sectorizacionService: AsignacionRolSectorizacionService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data.funcion == 2){
      this.ctrlCampania.valueChanges.subscribe((data)=>{
        this.showExtraCampania = data;
        if (this.showExtraCampania) {
          this.setListenerCampania();
          this.getListPersonal();

          if (this.data.obj.idInscripcion != 0) {
            this.inscripcionService.getDatosInscripcionPorId(this.data.obj.idInscripcion).subscribe((datos)=>{
              let caracteristicas = [];
              if(datos.imagenActiva){
                caracteristicas.push(0);
                this.formDatosCampania.controls.frmTxtImagen.setValue(datos.imagenDescripcion);
              } 
              if(datos.textoActivo){
                caracteristicas.push(1);
                this.formDatosCampania.controls.frmTxtDescripcion.setValue(datos.textoDescripcion);
              }
              if(datos.grupoActivo){
                caracteristicas.push(2);
                this.formDatosCampania.controls.frmLimitGrupo.setValue(datos.grupoLongitud);
              } 
              if(this.data.obj.votacion) caracteristicas.push(3);
              this.ctrlCaracteristicas.setValue(caracteristicas);
              this.personasResponsablesInscr = [];
              for (let i = 0; i < datos.responsables.length; i++) {
                this.personasResponsablesInscr.push(this.listPersonal.find((x)=>{return x.idUsuario == datos.responsables[i]}))
              }
            })
          }
          
          this.filteredOptionsPersonal = this.myControlPersonal.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.nombresCompletos),
            map(nombresCompletos => nombresCompletos ? this._filterPersonal(nombresCompletos) : this.listPersonal.slice())
          );
        }
      })
      this.ctrlCampania.setValue(this.data.obj.anuncio);
  
    }
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
      frmAnuncio: [],
      frmVotacion: []
    });

    this.form = this._fb.group({
      frmTitulo: [this.data.obj.titulo, [Validators.required]],
      frmDescripcion: [this.data.obj.descripcion, [Validators.required]],
      frmEnlace: [this.data.obj.urlRedireccion],
      frmAnuncio: [this.data.obj.anuncio],
      frmVotacion: [this.data.obj.votacion],
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
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  setListenerCampania(){
    this.ctrlCaracteristicas.valueChanges.subscribe((data)=>{
      if(data.includes(0)){
        this.formDatosCampania.controls.frmTxtImagen.setValidators([Validators.required]);
      }
      else{
        this.formDatosCampania.controls.frmTxtImagen.setValidators([]);
        this.formDatosCampania.controls.frmTxtImagen.reset('Imagen');
      }
      this.formDatosCampania.controls['frmTxtImagen'].updateValueAndValidity();

      if(data.includes(1)){
        this.formDatosCampania.controls.frmTxtDescripcion.setValidators([Validators.required]);
      }
      else{
        this.formDatosCampania.controls.frmTxtDescripcion.setValidators([]);
        this.formDatosCampania.controls.frmTxtDescripcion.reset('Descripcion');
      }
      this.formDatosCampania.controls['frmTxtDescripcion'].updateValueAndValidity();

      if(data.includes(2)){
        this.formDatosCampania.controls.frmLimitGrupo.setValidators([Validators.required]);
      }
      else{
        this.formDatosCampania.controls.frmLimitGrupo.setValidators([]);
        this.formDatosCampania.controls.frmLimitGrupo.reset(2);
      }
      this.formDatosCampania.controls['frmLimitGrupo'].updateValueAndValidity();
    })
  }
  
  async getListPersonal() {
    let listPersonal = await this._sectorizacionService.getListPersonal().then((data) => {
      if (data) {
        this.listPersonal = data;
      } 
    });
  }
  private _filterPersonal(value: string) {
    return this.listPersonal.filter(persona => persona.nombresCompletos.toLowerCase().includes(value.toLowerCase()));
  }
  displayFnPersonal(selectedpersona) {
    return selectedpersona ? selectedpersona.nombresCompletos : undefined;
  }
  onSelectionChangePersonal(event: any) {
    this.personalSeleccionadoTmp = event.option.value;
  }

  showEnter(){
    if (typeof this.myControlPersonal.value != 'object' || this.myControlPersonal.value == null) {
      this._notification.warning(`Seleccione una de las opciones desplegables`);
    }
    else{
      if (!this.personasResponsablesInscr.includes(this.personalSeleccionadoTmp)) {
        this.personasResponsablesInscr.push(this.personalSeleccionadoTmp);
        this.personalSeleccionadoTmp = null;
        this.myControlPersonal.reset('');
      }
      else{
        this._notification.warning(`La persona ${this.personalSeleccionadoTmp.nombresCompletos} ya se encuentra asignada`);
        this.myControlPersonal.reset('');
      }
    }
  }

  deleteMiembro(miembroIndex: number) {
    this.personasResponsablesInscr.splice(miembroIndex, 1);
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
      anuncio: this.ctrlCampania.value,
      inscripcionRequest: this.crearDatosInscripcion(),
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
      anuncio: this.ctrlCampania.value,
      inscripcionRequest: this.crearDatosInscripcion(),
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

  crearDatosInscripcion(): CreateInscripcionRequest{
    if(this.ctrlCampania.value){
      let inscripcionRequest: CreateInscripcionRequest = Object();
      if (this.ctrlCaracteristicas.value.includes(0)){
        inscripcionRequest.imagenActiva = true;
        inscripcionRequest.imagenDescripcion = this.formDatosCampania.controls.frmTxtImagen.value;
      }
      else{
        inscripcionRequest.imagenActiva = false;
        inscripcionRequest.imagenDescripcion = null;
      }
      if (this.ctrlCaracteristicas.value.includes(1)){
        inscripcionRequest.textoActivo = true;
        inscripcionRequest.textoDescripcion = this.formDatosCampania.controls.frmTxtDescripcion.value;
      }
      else{
        inscripcionRequest.textoActivo = false;
        inscripcionRequest.textoDescripcion = null;
      }
      if (this.ctrlCaracteristicas.value.includes(2)){
        inscripcionRequest.grupoActivo = true;
        inscripcionRequest.grupoLongitud = this.formDatosCampania.controls.frmLimitGrupo.value;
      }
      else{
        inscripcionRequest.grupoActivo = false;
        inscripcionRequest.grupoLongitud = null;
      }
      if (this.ctrlCaracteristicas.value.includes(3)){
        inscripcionRequest.esVotacion = true;
      }
      else{
        inscripcionRequest.esVotacion = false;
      }
      inscripcionRequest.usuarios = [];
      for (let i = 0; i < this.personasResponsablesInscr.length; i++) {
        inscripcionRequest.usuarios.push(this.personasResponsablesInscr[i].idUsuario) 
      }
  
      return inscripcionRequest;
    }
    else{
      return null;
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
