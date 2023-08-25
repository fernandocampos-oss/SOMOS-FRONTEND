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
import { Observable } from 'rxjs';
import { MatFormFieldControl } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { DatosIntegranteComponent } from './datos-integrante/datos-integrante.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RenuevaEssaludService } from '@data/services/renueva-essalud.service';
import { DatosGrupo, DescripcionProyecto, Implementacion, InscripcionRenueva } from '@data/models/proyecto/proyecto.model';

@Component({
  selector: 'app-form-renueva-essalud',
  templateUrl: './form-renueva-essalud.component.html',
  styleUrls: ['./form-renueva-essalud.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },{ provide: MatFormFieldControl, useExisting: FormRenuevaEssaludComponent }
  ],
})
export class FormRenuevaEssaludComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  stepperOrientation: Observable<StepperOrientation>;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombresApellidos', 'dni', 'accion'];
  estadoInscripcion = false;
  
  equipoList = new Array;
  dataSource_3 = this.equipoList;

  selectedValueL: number;
  selectedValueN: number;
  selectedValueO: number;
  
  //<!---------------------------------------------------- Primer paso: Descripción de los datos del grupo e integrantes --------------------------------------------------->

  formDatosGenerales = this._formBuilder.group({
    ctrlCategoria: ['', Validators.required],
    ctrlNomGrupo: ['', Validators.required],
    ctrlJefeNombre: ['', Validators.required],
    ctrlRed: [''],
  });

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
  
  //<!----------------------------------------------------------- Segundo paso: Describir los datos del proyecto ----------------------------------------------------------->
  
  formDatosProyecto = this._formBuilder.group({
    ctrlFechaImplementacion: [null, Validators.required],
    ctrlMotivacion: [null, [Validators.required, Validators.maxLength(600)]],
    ctrlAccionInnovadora: [null, [Validators.required, Validators.maxLength(1200)]],
    ctrlContextoInicial: [null, [Validators.required, Validators.maxLength(750)]],
    ctrlInnovador: [null, [Validators.required, Validators.maxLength(750)]],
    ctrlIndicadores: [null, Validators.required],
  });

  //<!------------------------------------------------------- Tercer paso: Datos sobre como se implementó el proyecto ------------------------------------------------------>
  opcionesMultiples = [
    {value: 'Enfoque de género (promueve desde su concepción e implementación la participación y la mejora de acceso a oportunidades y beneficios para las mujeres)', activado: false},
    {value: 'Discapacidad (promueve desde su concepción e implementación la participación y la mejora de acceso a oportunidades y beneficios para las personas con discapacidad)', activado: false},
    {value: 'Interculturalidad (promueve desde su concepción e implementación la participación y la mejora de acceso a oportunidades y beneficios para grupos excluidos cultural o socialmente y/o revalorar sus conocimientos o identidad cultural)', activado: false}
  ]

  retrievedPdf: any;
  nombrePdf: string = '';
  isPdfUpdate = false;

  formImplementacion = this._formBuilder.group({
    ctrlResultado: ['', [Validators.required, Validators.maxLength(900)]],
    ctrlSostenible: [null],
    ctrlSostenibleFundamento: [null],
    ctrlReplicable: [null],
    ctrlReplicableFundamento: [null, [Validators.required, Validators.maxLength(900)]],
    ctrlTecnologia: [null],
    ctrlTecnologiaFundamento: [null, [Validators.required, Validators.maxLength(600)]],
    ctrlBeneficio: [null],
    ctrlArchivoBase64: [null, Validators.required],
  });

  constructor(
    private dialogRef: MatDialog,
    private _router: Router,
    private route: ActivatedRoute,
    private _notification              : NotificationService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private userService: UsuarioService,
    private renuevaService: RenuevaEssaludService,
    private _formBuilder: FormBuilder) { 
      this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    }

  ngOnInit(): void {
    this.renuevaService.getProyecto().then((data)=>{
      console.log(data);
    })
    this.cargarLider();
    this.cargarUsuariosRed();
    //red
    this.filteredOptions = this.integranteControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : (value.nombres + ' ' + value.apellidos)),
        map(nombresCompletos => nombresCompletos ? this._filterPersonal(nombresCompletos) : this.listaUsuariosRed.slice())
      );
    //jefe
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

  //<!---------------------------------------------------- Primer paso: Descripción de los datos del grupo e integrantes --------------------------------------------------->
  cargarLider(){
    this.userService.get(this.authService.getUserSession().id).subscribe((data)=>{
      this.formDatosGenerales.controls["ctrlRed"].setValue(data.red);
      this.formDatosGenerales.controls["ctrlRed"].disable();
      this.listaIntegrantes.push({
        "apellidos": data.apellidos,
        "cargo": data.cargo,
        "codigoPlanilla": data.codigoPlanilla,
        "correo": data.correo,
        "fechaNacimiento": data.fechaNacimiento,
        "idUsuario": data.idUsuario,
        "nombres":data.nombres,
        "numeroCelular": data.numeroCelular,
        "numeroDocumento": data.numeroDocumento,
        "red": data.red
      });
      this.table.renderRows();
    })
  }
  async cargarUsuariosRed() {
    let listPersonal = await this.renuevaService.getUsuariosMismaRed().then((data) => {
      if (data) {
        this.listaUsuariosRed = data;
        this.listaPosiblesJefes = data;
      } 
    });
  }
  //personal
  private _filterPersonal(value: string) {
    return this.listaUsuariosRed.filter(persona => (persona.nombres + ' ' + persona.apellidos).toLowerCase().includes(value.toLowerCase()));
  }
  displayFnPersonal(selectedpersona) {
    return selectedpersona ? (selectedpersona.nombres + ' ' + selectedpersona.apellidos) : undefined;
  }
  onSelectionChangePersonal(event: any) {
    this.personalSeleccionadoTmp = event.option.value;
  }

  //Jefe
  private _filterJefe(value: string) {
    return this.listaPosiblesJefes.filter(persona => (persona.nombres + ' ' + persona.apellidos).toLowerCase().includes(value.toLowerCase()));
  }
  displayFnJefe(selectedpersona) {
    return selectedpersona ? (selectedpersona.nombres + ' ' + selectedpersona.apellidos) : undefined;
  }
  onSelectionChangeJefe(event: any) {
    this.jefeSeleccionadoTmp = event.option.value;
    this.formDatosGenerales.controls['ctrlJefeNombre'].setValue((event.option.value.nombres + ' ' + event.option.value.apellidos))
  }

  aniadirIntegrante(){ //Añade integrantes al listado visual del equipo
    if(this.personalSeleccionadoTmp != undefined){
      if(this.listaIntegrantes.length == 5){
        this._notification.warning('El grupo debe ser de máximo 5 personas (incluyendo al líder)');
      }
      else{
        if(this.listaIntegrantes.includes(this.personalSeleccionadoTmp)){
          this._notification.warning('Ya registró a esta persona');
        }
        else if(this.personalSeleccionadoTmp.idUsuario == this.authService.getUserSession().id){
          this._notification.warning('No puede registrarse a si mismo');
        }
        else{
          this.listaIntegrantes.push(this.personalSeleccionadoTmp);
          this.table.renderRows();
        }
      }
      this.integranteControl.reset('')
      this.personalSeleccionadoTmp = undefined;
    }
    else{
      this._notification.warning('Por favor busque un nombre');
    }
    console.log(this.listaIntegrantes)
  }

  deleteMiembro(miembroIndex: number) {
    this.listaIntegrantes.splice(miembroIndex, 1);
    this.table.renderRows();
  }

  onChangeImage(files) {
    console.log(files)
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
      if(this.applicationFile.size >= 2097152){
        this._notification.warning('Tamaño de imagen excedido, máximo 2MB');
        return;
      }
      else{
        imgLoad.src = <string>reader.result;
        imgLoad.onload = () =>{
          this.width = imgLoad.width;
          this.height = imgLoad.height;
          console.log(this.width,'||',this.height);
        };
        this.retrievedImage = reader.result;
        this.isImageUpdate = true;
      }
    };
  }
  removeImage() {
    this.retrievedImage = null;
    this.applicationFile = null;
    this.isImageUpdate = true;
  }
  
  infoIntegrante(idPersona: number){
    
    const dialogRef: MatDialogRef<DatosIntegranteComponent> = this.dialogRef.open(DatosIntegranteComponent, {
      disableClose: false,
      autoFocus: false,
      width:'60%',
      data: {
        idPer: idPersona
      }
    });
  }

  getPrimerPaso(): DatosGrupo{
    let datosImagen = this.retrievedImage
    if(datosImagen){
      datosImagen = datosImagen.split(',')[1]
    }
    return {
      nombre: this.formDatosGenerales.controls['ctrlNomGrupo'].value,
      sede: this.formDatosGenerales.controls['ctrlRed'].value,
      jefe: this.formDatosGenerales.controls['ctrlJefeNombre'].value,
      categoria: this.formDatosGenerales.controls['ctrlCategoria'].value,
      imagenBase64:datosImagen,
      miembros: this.listaIntegrantes
    }
  }

  guardaCambios1ro(){
    console.log(this.getInscripcion());
    this.renuevaService.saveProyecto(this.getInscripcion()).subscribe(() => {
      this._notification.info('Se guardaron los cambios hechos en los datos del grupo');
    });
  }
  //<!----------------------------------------------------------- Segundo paso: Describir los datos del proyecto ----------------------------------------------------------->

  getSegundoPaso(): DescripcionProyecto{
    console.log(this.formDatosProyecto.controls['ctrlFechaImplementacion'].value)
    let fechaDato: string = null;
    if(this.formDatosProyecto.controls['ctrlFechaImplementacion'].value){
      fechaDato = this.formDatosProyecto.controls['ctrlFechaImplementacion'].value._i.year 
      + '-' + this.formDatosProyecto.controls['ctrlFechaImplementacion'].value._i.month 
      + '-' + this.formDatosProyecto.controls['ctrlFechaImplementacion'].value._i.date;
    }
    return {
      fecha: fechaDato,
      motivo: this.formDatosProyecto.controls['ctrlMotivacion'].value,
      descripcion: this.formDatosProyecto.controls['ctrlAccionInnovadora'].value,
      contexto: this.formDatosProyecto.controls['ctrlContextoInicial'].value,
      innovacion: this.formDatosProyecto.controls['ctrlInnovador'].value,
      indicador: this.formDatosProyecto.controls['ctrlIndicadores'].value
    }
  }

  guardaCambios2do(){
    console.log(this.getSegundoPaso())
    this._notification.info('Se guardaron los cambios hechos en los datos del proyecto');
  }

  //<!------------------------------------------------------- Tercer paso: Datos sobre como se implementó el proyecto ------------------------------------------------------>

  onChangeL(event: MatRadioChange) {
    this.selectedValueL = event.value;
  }

  onChangeN(event: MatRadioChange) {
    this.selectedValueN = event.value;
  }

  onChangeO(event: MatRadioChange) {
    this.selectedValueO = event.value;
  }

  onChangeFile(files) {
    console.log(files)
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
      let fileApp = files[0];
      if(fileApp.size >= 2097152){
        this._notification.warning('Tamaño de imagen excedido, máximo 2MB');
        return;
      }
      else{
        };
        this.retrievedPdf = reader.result;
        this.formImplementacion.controls['ctrlArchivoBase64'].setValue(this.retrievedPdf.split(',')[1])
        this.isPdfUpdate = true;
      }
  }
  removePdf() {
    this.retrievedPdf = null;
    this.formImplementacion.controls['ctrlArchivoBase64'].reset();
    this.isPdfUpdate = true;
  }

  getTercerPaso(): Implementacion{
    return {
      resultado: this.formImplementacion.controls['ctrlResultado'].value,
      sostenible: this.formImplementacion.controls['ctrlSostenible'].value,
      sostenibleFundamento: this.formImplementacion.controls['ctrlSostenibleFundamento'].value,
      replicable: this.formImplementacion.controls['ctrlReplicable'].value,
      replicableFundamento: this.formImplementacion.controls['ctrlReplicableFundamento'].value,
      tecnologia: this.formImplementacion.controls['ctrlTecnologia'].value,
      tecnologiaFundamento: this.formImplementacion.controls['ctrlTecnologiaFundamento'].value,
      beneficio: this.formImplementacion.controls['ctrlBeneficio'].value,
      archivoBase64: this.formImplementacion.controls['ctrlArchivoBase64'].value,
      enfoques: this.opcionesMultiples.filter(function (a) { return a.activado == true;}).map(item=>{
        return item.value})
    }
  }

  getInscripcion(): InscripcionRenueva{
    return{
      enviado: this.estadoInscripcion,
      grupo: this.getPrimerPaso(),
      descripcion: this.getSegundoPaso(),
      implementacion: this.getTercerPaso()
    }
  }

  guardaCambios3ro(){
    console.log(this.opcionesMultiples.filter(function (a) {
      return a.activado == true;
    }).map(item=>{
      return item.value
    }));
    this._notification.info('Se guardaron los cambios hechos sobre la implementación del proyecto');
  }
  enviarDatos(){
    if (this.listaIntegrantes.length < 2) {
      this._notification.error('El grupo debe tener almenos 2 miembros');
    }
    else{
    this._notification.success('Se enviaron los datos de la inscripción');
    }
  }
}
