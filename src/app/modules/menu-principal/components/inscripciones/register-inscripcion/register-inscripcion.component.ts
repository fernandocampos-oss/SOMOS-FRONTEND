import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { InscripcionRequest, InscripcionResponse } from '@data/models/inscripcion/inscripcion.model';
import { AuthService, UsuarioService } from '@data/services';
import { InscripcionService } from '@data/services/inscripcion.service';
import { RenuevaEssaludService } from '@data/services/renueva-essalud.service';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-register-inscripcion',
  templateUrl: './register-inscripcion.component.html',
  styleUrls: ['./register-inscripcion.component.scss']
})
export class RegisterInscripcionComponent implements OnInit {

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild('file', { static: false }) imageInput: any; 
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombresApellidos', 'dni', 'accion'];
  inscripcionRespondida: boolean;
  infoDialog: InscripcionResponse = Object(); // Tipos: 1 = 'Inscripcion directa singular', 2 = 'Inscripcion con descripcion, grupo e imagen'
  tipoInscripcion: number = 2;

  idLider: number;
  descripcionControl = new FormControl('',Validators.required);
  integranteControl = new FormControl('');
  filteredOptions: Observable<any[]>;
  listaUsuariosRed = [];
  personalSeleccionadoTmp: any;

  listaIntegrantes = new Array;

  // Imagen ----
  applicationFile: any = File;
  retrievedImage: any;
  isImageUpdate = false;

  constructor(
    private dialogRef: MatDialogRef<RegisterInscripcionComponent>,
    private dialogRefConfirmation: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private authService: AuthService,
    private userService: UsuarioService,
    private renuevaService: RenuevaEssaludService,
    private inscripcionService: InscripcionService) { }

  ngOnInit(): void {
    // console.log(this.data)
    this.inscripcionService.getInscripcionPorId(this.data.obj).subscribe((data)=>{
      // console.log(data)
      this.infoDialog = data;
      if(data.enviado != true){
        if(this.tipoInscripcion == 2){
          this.idLider = this.authService.getUserSession().id;
          this.cargarLider();
          this.cargarUsuariosRed();
          this.filteredOptions = this.integranteControl.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : (value.nombres + ' ' + value.apellidos)),
              map(nombresCompletos => nombresCompletos ? this._filterPersonal(nombresCompletos) : this.listaUsuariosRed.slice())
            );
          this.integranteControl.setValue('')
        }
      }
    })
  }

  async cargarUsuariosRed() {
    const listPersonal = await this.renuevaService.getUsuariosMismaRed().then((data) => {
      if (data) {
        this.listaUsuariosRed = data;
      }
    });
  }

  private _filterPersonal(value: string) {
    return this.listaUsuariosRed.filter(persona => (persona.nombres + ' ' + persona.apellidos).toLowerCase().includes(value.toLowerCase()));
  }
  displayFnPersonal(selectedpersona) {
    return selectedpersona ? (selectedpersona.nombres + ' ' + selectedpersona.apellidos) : undefined;
  }
  onSelectionChangePersonal(event: any) {
    this.personalSeleccionadoTmp = event.option.value;
  }
  
  cargarLider(){
    this.userService.get(this.idLider).subscribe((data) => {
      if (this.listaIntegrantes.length === 0) {
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
          red: data.red,
          unidad: data.unidad
        });
        this.table.renderRows();
      }
    });
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
    reader.onload = _event => {
      var imgLoad = new Image();
      this.applicationFile = files[0];
      if (this.applicationFile.size >= 2097152) {
        this._notification.warning('Tamaño de imagen excedido, máximo 2MB');
        return;
      }
      else {
        imgLoad.src = <string>reader.result;
        imgLoad.onload = () => { };
        this.retrievedImage = reader.result;
        this.isImageUpdate = true;
      }
    };
  }

  removeImage() {
    this.retrievedImage = null;
    this.applicationFile = null;
    this.isImageUpdate = true;
    this.imageInput.nativeElement.value = '';
  }

  enviarInscripcion(){
    if (this.tipoInscripcion == 1) {
      this.inscripcionService.registerUserToInscripcion(this.getInscripcionTipo1()).subscribe(()=>{
        this._notification.success('¡Se registró su inscripción!');
        this.dialogRef.close("enviado");
      })
    }
    else if(this.tipoInscripcion == 2){
      if(!this.descripcionControl.valid || this.retrievedImage == undefined){
        this._notification.warning('Hay datos faltantes');
      }
      else{
        
        const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialogRefConfirmation.open(ConfirmDialogComponent, {
          disableClose: true,
          autoFocus: false,
          data:{
            type:0,
            title:'Confirmar envío',
            message: 'Una vez confirmado, no se podrá deshacer'
          }
        });

        dialogRef.afterClosed().subscribe((data)=>{
          if(data == true){
            console.log(this.getInscripcionTipo2())
            this.inscripcionService.registerUserToInscripcion(this.getInscripcionTipo2()).subscribe(()=>{
              this._notification.success('¡Se registró su inscripción!');
              this.dialogRef.close("enviado");
            })
          }
        })
      }
    }
  }
  getInscripcionTipo1(): InscripcionRequest{
    return{
      idInscripcion: this.data.obj,
      tipoInscripcion: 1
    }
  }

  getInscripcionTipo2(): InscripcionRequest{
    let arrayId = [];
    this.listaIntegrantes.map((x)=>{
      arrayId.push(x.idUsuario)
    })
    return {
      idInscripcion: this.data.obj,
      tipoInscripcion: 2,
      inscritos: arrayId,
      descripcion: this.descripcionControl.value,
      imagenBase64: this.retrievedImage.split(',')[1]
    };
  }
}
