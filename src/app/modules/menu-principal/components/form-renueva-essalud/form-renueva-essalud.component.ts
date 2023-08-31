import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS, StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services';
import { AuthService, UsuarioService } from '@data/services';
import { Observable, of } from 'rxjs';
import { MatFormFieldControl } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { DatosIntegranteComponent } from './datos-integrante/datos-integrante.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RenuevaEssaludService } from '@data/services/renueva-essalud.service';
import { DatosGrupo, DescripcionProyecto, Implementacion, InscripcionRenueva } from '@data/models/proyecto/proyecto.model';
import * as moment from 'moment';
import { ConfirmInscripcionComponent } from './confirm-inscripcion/confirm-inscripcion.component';

@Component({
  selector: 'app-form-renueva-essalud',
  templateUrl: './form-renueva-essalud.component.html',
  styleUrls: ['./form-renueva-essalud.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    }, { provide: MatFormFieldControl, useExisting: FormRenuevaEssaludComponent }
  ],
})
export class FormRenuevaEssaludComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  stepperOrientation: Observable<StepperOrientation>;

  vistaCelular = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombresApellidos', 'dni', 'accion'];
  estadoInscripcion = false;

  equipoList = new Array;
  dataSource_3 = this.equipoList;

  selectedValueL: string;
  selectedValueN: string;
  selectedValueO: string;

  hayDatos = false;
  idProyecto: number;

  msgErrores = false;
  // <!---------------------------------------------------- Primer paso: Descripción de los datos del grupo e integrantes --------------------------------------------------->
  idProyectoGrupo: number;

  formDatosGenerales = this._formBuilder.group({
    ctrlCategoria: ['', Validators.required],
    ctrlNomGrupo: ['', Validators.required],
    ctrlJefeNombre: ['', Validators.required],
    ctrlRed: [''],
    // ctrlImgGrupo64: ['', Validators.required],
  });

  // get imagenGrupoField() {
  //   return this.formDatosGenerales.get('ctrlImgGrupo64');
  // }
  
  integranteControl = new FormControl('');
  jefeControl = new FormControl('');
  filteredOptions: Observable<any[]>;
  filteredOptionsJefe: Observable<any[]>;
  listaUsuariosRed = [];
  listaPosiblesJefes = [];
  personalSeleccionadoTmp: any;
  jefeSeleccionadoTmp: any;

  listaIntegrantes = new Array;

  applicationFile: any = File;
  retrievedImage: any;
  width: number;
  height: number;
  isImageUpdate = false;

  // <!----------------------------------------------------------- Segundo paso: Describir los datos del proyecto ----------------------------------------------------------->
  idProyectoDescripcion: number;

  formDatosProyecto = this._formBuilder.group({
    ctrlFechaImplementacion: [null, Validators.required],
    ctrlMotivacion: [null, [Validators.required, Validators.maxLength(600)]],
    ctrlAccionInnovadora: [null, [Validators.required, Validators.maxLength(1200)]],
    ctrlContextoInicial: [null, [Validators.required, Validators.maxLength(750)]],
    ctrlInnovador: [null, [Validators.required, Validators.maxLength(750)]],
    ctrlIndicadores: [null, Validators.required],
  });

  // <!------------------------------------------------------- Tercer paso: Datos sobre como se implementó el proyecto ------------------------------------------------------>
  idProyectoImplementacion: number;

  opcionesMultiples = [
    {value: 'Enfoque de género (promueve desde su concepción e implementación la participación y la mejora de acceso a oportunidades y beneficios para las mujeres)', activado: false},
    {value: 'Discapacidad (promueve desde su concepción e implementación la participación y la mejora de acceso a oportunidades y beneficios para las personas con discapacidad)', activado: false},
    {value: 'Interculturalidad (promueve desde su concepción e implementación la participación y la mejora de acceso a oportunidades y beneficios para grupos excluidos cultural o socialmente y/o revalorar sus conocimientos o identidad cultural)', activado: false}
  ];

  retrievedPdf: any;
  nombrePdf = '';
  isPdfUpdate = false;

  formImplementacion = this._formBuilder.group({
    ctrlResultado: ['', [Validators.required, Validators.maxLength(900)]],
    ctrlSostenible: [null, Validators.required],
    ctrlSostenibleFundamento: [null],
    ctrlReplicable: [null, Validators.required],
    ctrlReplicableFundamento: [null],
    ctrlTecnologia: [null, Validators.required],
    ctrlTecnologiaFundamento: [null],
    ctrlBeneficio: [null, Validators.required],
    ctrlArchivoBase64: [null, Validators.required],
  });

  get archivoPdfField() {
    return this.formImplementacion.get('ctrlArchivoBase64');
  }

  constructor(
    private dialogRef: MatDialog,
    private _router: Router,
    private route: ActivatedRoute,
    private _notification: NotificationService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private userService: UsuarioService,
    private renuevaService: RenuevaEssaludService,
    private _formBuilder: FormBuilder) {
      this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
      breakpointObserver
      .observe('(min-width: 600px)')
      .pipe(map(({matches})=> (matches ? true : false))).subscribe((data)=>{
        this.vistaCelular = data;
      });
    }

  ngOnInit(): void {
    this.cargarUsuariosRed();
    this.cargarLider();
    this.renuevaService.getProyecto().subscribe((data) => {
      const dataObj = Object(data[0]);console.log(data)
      if (data[0]){
        this.hayDatos = true;
        this.idProyecto = dataObj.idProyecto;
        this.idProyectoDescripcion = dataObj.descripcion.idProyectoDescripcion;
        this.idProyectoGrupo = dataObj.grupo.idProyectoGrupo;
        this.idProyectoImplementacion = dataObj.implementacion.idProyectoImplementacion;
        this.cargarDataProyecto(dataObj);
      }
    });
    // red
    this.filteredOptions = this.integranteControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : (value.nombres + ' ' + value.apellidos)),
        map(nombresCompletos => nombresCompletos ? this._filterPersonal(nombresCompletos) : this.listaUsuariosRed.slice())
      );
    // jefe
    this.jefeControl.valueChanges.subscribe((data)=>{
      if(typeof data === 'string' && data.trim().length == 0){
        this.formDatosGenerales.controls.ctrlJefeNombre.reset()
      }
    })
    this.filteredOptionsJefe = this.jefeControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : (value.nombres + ' ' + value.apellidos)),
        map(nombresCompletos => nombresCompletos ? this._filterJefe(nombresCompletos) : this.listaPosiblesJefes.slice())
      );
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  cargarDataProyecto(data: any) {
    this.estadoInscripcion = data.enviado;
    console.log(data)

    // Data grupo
    this.formDatosGenerales.controls.ctrlNomGrupo.setValue(data.grupo.nombre);
    this.formDatosGenerales.controls.ctrlRed.setValue(data.grupo.sede);
    this.formDatosGenerales.controls.ctrlJefeNombre.setValue(data.grupo.jefe);
    this.formDatosGenerales.controls.ctrlCategoria.setValue(data.grupo.categoria);
    // this.formDatosGenerales.controls.ctrlImgGrupo64.setValue(data.grupo.imagenBase64);
    const jefesFiltrados: any[] = this._filterJefe(data.grupo.jefe);
    if (jefesFiltrados.length > 0) {
      this.jefeControl.setValue({ nombres: jefesFiltrados[0].nombres, apellidos: jefesFiltrados[0].apellidos });
    }
    data.grupo.miembros.forEach(m => {
      if (m.idUsuario === this.authService.getUserSession().id) {
        this.listaIntegrantes[0] = m;
      } else {
        this.listaIntegrantes.push(m);
      }
    });
    this.table.renderRows();
    if (data.grupo.imagenBase64) {
      this.retrievedImage = `data:image/png;base64,${data.grupo.imagenBase64}`;
    }

    // Data descripcion
    if (data.descripcion.fecha) {
      this.formDatosProyecto.controls.ctrlFechaImplementacion.setValue(moment(data.descripcion.fecha, 'YYYY-MM-DD'));
    }
    this.formDatosProyecto.controls.ctrlMotivacion.setValue(data.descripcion.motivo);
    this.formDatosProyecto.controls.ctrlAccionInnovadora.setValue(data.descripcion.descripcion);
    this.formDatosProyecto.controls.ctrlContextoInicial.setValue(data.descripcion.contexto);
    this.formDatosProyecto.controls.ctrlInnovador.setValue(data.descripcion.innovacion);
    this.formDatosProyecto.controls.ctrlIndicadores.setValue(data.descripcion.indicador);

    // Data implementacion
    this.formImplementacion.controls.ctrlResultado.setValue(data.implementacion.resultado);
    this.formImplementacion.controls.ctrlSostenible.setValue(data.implementacion.sostenible);
    this.formImplementacion.controls.ctrlSostenibleFundamento.setValue(data.implementacion.sostenibleFundamento);
    this.formImplementacion.controls.ctrlReplicable.setValue(data.implementacion.replicable);
    this.formImplementacion.controls.ctrlReplicableFundamento.setValue(data.implementacion.replicableFundamento);
    this.formImplementacion.controls.ctrlTecnologia.setValue(data.implementacion.tecnologia);
    this.formImplementacion.controls.ctrlTecnologiaFundamento.setValue(data.implementacion.tecnologiaFundamento);
    this.formImplementacion.controls.ctrlBeneficio.setValue(data.implementacion.beneficio);
    this.formImplementacion.controls.ctrlArchivoBase64.setValue(data.implementacion.archivoBase64);
    this.selectedValueN = data.implementacion.replicable;
    this.selectedValueL = data.implementacion.sostenible;
    this.selectedValueO = data.implementacion.tecnologia;
    this.opcionesMultiples = this.opcionesMultiples.map(item => {
      if (data.implementacion.enfoques.includes(item.value)) {
        item.activado = true;
      }
      return item;
    });
    if (data.implementacion.archivoBase64) {
      this.retrievedPdf = `data:application/pdf;base64,${data.implementacion.archivoBase64}`;
    }
      
    if(this.selectedValueL === 'Si'){
      this.formImplementacion.controls.ctrlSostenibleFundamento.setValidators([Validators.required]);
      this.formImplementacion.controls['ctrlSostenibleFundamento'].updateValueAndValidity();
    }

    if(this.selectedValueN === 'Si'){
      this.formImplementacion.controls.ctrlReplicableFundamento.setValidators([Validators.required, Validators.maxLength(900)]);
      this.formImplementacion.controls['ctrlReplicableFundamento'].updateValueAndValidity();
    }

    if(this.selectedValueO === 'Si'){
      this.formImplementacion.controls.ctrlTecnologiaFundamento.setValidators([Validators.required, Validators.maxLength(600)]);
      this.formImplementacion.controls['ctrlTecnologiaFundamento'].updateValueAndValidity();
    }

    if (data.enviado) {
      this.deshabilitarFormulario();
    }
  }

  deshabilitarFormulario() {
    this.formDatosGenerales.disable();
    this.formDatosProyecto.disable();
    this.formImplementacion.disable();
    this.jefeControl.disable();
    this.integranteControl.disable();
  }

  // <!---------------------------------------------------- Primer paso: Descripción de los datos del grupo e integrantes --------------------------------------------------->
  cargarLider(){
    this.userService.get(this.authService.getUserSession().id).subscribe((data) => {
      this.formDatosGenerales.controls.ctrlRed.setValue(data.red);
      this.formDatosGenerales.controls.ctrlRed.disable();
      this.listaIntegrantes.push({
        apellidos: data.apellidos,
        cargo: data.cargo,
        codigoPlanilla: data.codigoPlanilla,
        correo: data.correo,
        fechaNacimiento: data.fechaNacimiento,
        idUsuario: data.idUsuario,
        nombres: data.nombres,
        numeroCelular: data.numeroCelular,
        numeroDocumento: data.numeroDocumento,
        red: data.red
      });
      this.table.renderRows();
    });
  }
  async cargarUsuariosRed() {
    const listPersonal = await this.renuevaService.getUsuariosMismaRed().then((data) => {
      if (data) {
        this.listaUsuariosRed = data;
        this.listaPosiblesJefes = data;
      }
    });
  }
  // personal
  private _filterPersonal(value: string) {
    return this.listaUsuariosRed.filter(persona => (persona.nombres + ' ' + persona.apellidos).toLowerCase().includes(value.toLowerCase()));
  }
  displayFnPersonal(selectedpersona) {
    return selectedpersona ? (selectedpersona.nombres + ' ' + selectedpersona.apellidos) : undefined;
  }
  onSelectionChangePersonal(event: any) {
    this.personalSeleccionadoTmp = event.option.value;
  }

  // Jefe
  private _filterJefe(value: string) {
    return this.listaPosiblesJefes.filter(persona => (persona.nombres + ' ' + persona.apellidos).toLowerCase().includes(value.toLowerCase()));
  }
  displayFnJefe(selectedpersona) {
    return selectedpersona ? (selectedpersona.nombres + ' ' + selectedpersona.apellidos) : undefined;
  }
  onSelectionChangeJefe(event: any) {
    this.jefeSeleccionadoTmp = event.option.value;
    this.formDatosGenerales.controls.ctrlJefeNombre.setValue((event.option.value.nombres + ' ' + event.option.value.apellidos));
  }

  aniadirIntegrante(){ // Añade integrantes al listado visual del equipo
    if (this.personalSeleccionadoTmp != undefined){
      if (this.listaIntegrantes.length == 5){
        this._notification.warning('El grupo debe ser de máximo 5 personas (incluyendo al líder)');
      }
      else{
        let registrado = false;
        this.listaIntegrantes.forEach(i => {
          if (i.idUsuario === this.personalSeleccionadoTmp.idUsuario) {
            this._notification.warning('Ya es miembro del grupo');
            registrado = true;
          }
        });
        if (!registrado) {
          this.listaIntegrantes.push(this.personalSeleccionadoTmp);
          this.table.renderRows();
        }
      }
      this.integranteControl.reset('');
      this.personalSeleccionadoTmp = undefined;
    }
    else{
      this._notification.warning('Por favor busque un nombre');
    }
  }

  deleteMiembro(miembroIndex: number) {
    this.listaIntegrantes.splice(miembroIndex, 1);
    this.table.renderRows();
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
    console.log(files)
    reader.onload = _event => {
      const imgLoad = new Image();
      this.applicationFile = files[0];
      if (this.applicationFile.size >= 2097152){
        this._notification.warning('Tamaño de imagen excedido, máximo 2MB');
        return;
      }
      else{
        imgLoad.src = (reader.result as string);
        imgLoad.onload = () => {
          this.width = imgLoad.width;
          this.height = imgLoad.height;
        };
        this.retrievedImage = reader.result;
        // this.formDatosGenerales.controls.ctrlImgGrupo64.setValue(this.retrievedImage.split(',')[1]);
        this.isImageUpdate = true;
      }
    };
  }
  removeImage() {
    this.retrievedImage = null;
    // this.formDatosGenerales.controls.ctrlImgGrupo64.reset();
    this.applicationFile = null;
    this.isImageUpdate = true;
  }

  infoIntegrante(usuario: any){

    const dialogRef: MatDialogRef<DatosIntegranteComponent> = this.dialogRef.open(DatosIntegranteComponent, {
      disableClose: true,
      autoFocus: false,
      width: '60%',
      data: {
        integrante: usuario,
        enviado: this.estadoInscripcion
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaIntegrantes = this.listaIntegrantes.map(m => {
          if (usuario.idUsuario === m.idUsuario) {
            m.correo = result.correo;
            m.numeroCelular = result.celular;
          }
          return m;
        });
      }
    });
  }

  getPrimerPaso(): DatosGrupo {
    let datosImagen = this.retrievedImage;
    if (datosImagen){
      datosImagen = datosImagen.split(',')[1];
    }
    return {
      nombre: this.formDatosGenerales.controls.ctrlNomGrupo.value,
      sede: this.formDatosGenerales.controls.ctrlRed.value,
      jefe: this.formDatosGenerales.controls.ctrlJefeNombre.value,
      categoria: this.formDatosGenerales.controls.ctrlCategoria.value,
      imagenBase64: datosImagen,
      miembros: this.listaIntegrantes
    };
  }

  guardaCambios1ro(){
    this.renuevaService.saveProyecto(this.getInscripcion()).subscribe((proyecto: any) => {
      this._notification.info('Se guardaron los cambios hechos en los datos del grupo');
      this.idProyecto = proyecto.idProyecto;
    });
  }
  // <!----------------------------------------------------------- Segundo paso: Describir los datos del proyecto ----------------------------------------------------------->

  getSegundoPaso(): DescripcionProyecto{
    let fechaDato: string = null;
    if (this.formDatosProyecto.controls.ctrlFechaImplementacion.value) {
      fechaDato = this.formDatosProyecto.controls.ctrlFechaImplementacion.value.format('YYYY-MM-DD');
    }
    return {
      fecha: fechaDato,
      motivo: this.formDatosProyecto.controls.ctrlMotivacion.value,
      descripcion: this.formDatosProyecto.controls.ctrlAccionInnovadora.value,
      contexto: this.formDatosProyecto.controls.ctrlContextoInicial.value,
      innovacion: this.formDatosProyecto.controls.ctrlInnovador.value,
      indicador: this.formDatosProyecto.controls.ctrlIndicadores.value
    };
  }

  guardaCambios2do(){
    this.renuevaService.saveProyecto(this.getInscripcion()).subscribe((proyecto: any) => {
      this._notification.info('Se guardaron los cambios hechos en los datos del proyecto');
      this.idProyecto = proyecto.idProyecto;
    });
  }

  // <!------------------------------------------------------- Tercer paso: Datos sobre como se implementó el proyecto ------------------------------------------------------>

  onChangeL(event: MatRadioChange) {
    this.selectedValueL = event.value;
    if(event.value === 'Si'){
      this.formImplementacion.controls.ctrlSostenibleFundamento.setValidators([Validators.required]);
    }
    else{
      this.formImplementacion.controls.ctrlSostenibleFundamento.setValidators([]);
      this.formImplementacion.controls.ctrlSostenibleFundamento.reset();
    }
    this.formImplementacion.controls['ctrlSostenibleFundamento'].updateValueAndValidity();
  }

  onChangeN(event: MatRadioChange) {
    this.selectedValueN = event.value;
    if(event.value === 'Si'){
      this.formImplementacion.controls.ctrlReplicableFundamento.setValidators([Validators.required, Validators.maxLength(900)]);
    }
    else{
      this.formImplementacion.controls.ctrlReplicableFundamento.setValidators([]);
      this.formImplementacion.controls.ctrlReplicableFundamento.reset();
    }
    this.formImplementacion.controls['ctrlReplicableFundamento'].updateValueAndValidity();
  }

  onChangeO(event: MatRadioChange) {
    this.selectedValueO = event.value;
    if(event.value === 'Si'){
      this.formImplementacion.controls.ctrlTecnologiaFundamento.setValidators([Validators.required, Validators.maxLength(600)]);
    }
    else{
      this.formImplementacion.controls.ctrlTecnologiaFundamento.setValidators([]);
      this.formImplementacion.controls.ctrlTecnologiaFundamento.reset();
    }
    this.formImplementacion.controls['ctrlTecnologiaFundamento'].updateValueAndValidity();
  }

  onChangeFile(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    this.nombrePdf = files[0].name;
    if (mimeType.match(/pdf\/*/) == null) {
      this._notification.warning(
        'Por favor seleccione un archivo PDF'
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      const fileApp = files[0];
      if (fileApp.size >= 2097152){
        this._notification.warning('Tamaño de archivo excedido, máximo 2MB');
        return;
      }
      else{
        }
      this.retrievedPdf = reader.result;
      this.formImplementacion.controls.ctrlArchivoBase64.setValue(this.retrievedPdf.split(',')[1]);
      this.isPdfUpdate = true;
      };
  }

  removePdf() {
    this.retrievedPdf = null;
    this.formImplementacion.controls.ctrlArchivoBase64.reset();
    this.isPdfUpdate = false;
  }

  downloadPdf() {
    const blob = this.base64ToBlob(this.retrievedPdf.split(',')[1], 'application/pdf');
    console.log(blob)
    const url = URL.createObjectURL(blob);
    console.log(url)

    const link = document.createElement('a');
    console.log(link)
    link.href = url;
    link.download = 'archivo.pdf';
    link.click();

    URL.revokeObjectURL(url);
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  getTercerPaso(): Implementacion{
    return {
      resultado: this.formImplementacion.controls.ctrlResultado.value,
      sostenible: this.formImplementacion.controls.ctrlSostenible.value,
      sostenibleFundamento: this.formImplementacion.controls.ctrlSostenibleFundamento.value,
      replicable: this.formImplementacion.controls.ctrlReplicable.value,
      replicableFundamento: this.formImplementacion.controls.ctrlReplicableFundamento.value,
      tecnologia: this.formImplementacion.controls.ctrlTecnologia.value,
      tecnologiaFundamento: this.formImplementacion.controls.ctrlTecnologiaFundamento.value,
      beneficio: this.formImplementacion.controls.ctrlBeneficio.value,
      archivoBase64: this.formImplementacion.controls.ctrlArchivoBase64.value,
      enfoques: this.opcionesMultiples.filter(function(a) { return a.activado == true; }).map(item => {
        return item.value; })
    };
  }

  getInscripcion(): InscripcionRenueva{
    return{
      idProyecto: this.idProyecto,
      enviado: this.estadoInscripcion,
      grupo: this.getPrimerPaso(),
      descripcion: this.getSegundoPaso(),
      implementacion: this.getTercerPaso()
    };
  }

  guardaCambios3ro(){
    this.renuevaService.saveProyecto(this.getInscripcion()).subscribe((proyecto: any) => {
      this._notification.info('Se guardaron los cambios hechos sobre la implementación del proyecto');
      this.idProyecto = proyecto.idProyecto;
    });
  }
  enviarDatos(){
    this.msgErrores = true;
    if (this.listaIntegrantes.length < 2) {
      this._notification.error('El grupo debe tener almenos 2 miembros');
    }
    else{
      if(this.formDatosGenerales.valid && this.formDatosProyecto.valid && this.formImplementacion.valid && this.getTercerPaso().enfoques.length>0){

        const dialogRef: MatDialogRef<ConfirmInscripcionComponent> = this.dialogRef.open(ConfirmInscripcionComponent, {
          disableClose: true,
          autoFocus: false,
          data: {
            inscripcion: this.getInscripcion(),
            enviado: this.estadoInscripcion
          }
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
              this._notification.success('Se enviaron los datos de la inscripción');
              this.estadoInscripcion = result.confirmacion;
              this.deshabilitarFormulario();
          }
        });
      }
      else{
        this._notification.error('Faltan completar datos');
        this.formDatosGenerales.markAllAsTouched();
        this.formDatosProyecto.markAllAsTouched();
        this.formImplementacion.markAllAsTouched();
      }
    }
  }
}
