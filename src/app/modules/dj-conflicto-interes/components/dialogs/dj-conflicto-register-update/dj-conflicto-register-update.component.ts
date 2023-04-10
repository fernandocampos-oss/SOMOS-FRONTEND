import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '@core/services';
import { UserSession } from '@data/models';
import { DjConflictoRegister } from '@data/models/dj-conflicto/dj-conflicto-register.model';
import { Ipress } from '@data/models/ipress/ipress.model';
import { Red } from '@data/models/red/red.model';
import { AuthService, UsuarioService } from '@data/services';
import { DjConflictoService } from '@data/services/dj-conflicto.service';
import { IpressService } from '@data/services/ipress.service';
import { RedService } from '@data/services/red.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DialogService } from '../../../../../core/services/ui/dialog.service';
import { filter, finalize } from 'rxjs/operators';
import { DjConflicto } from '../../../../../data/models/dj-conflicto/dj-conflicto.model';
import { DatePipe } from '@angular/common';
import { ScriptService } from '../../../../../data/services/script.service';
declare let pdfMake: any ;

@UntilDestroy()
@Component({
  selector: 'app-dj-conflicto-register-update',
  templateUrl: './dj-conflicto-register-update.component.html',
  styleUrls: ['./dj-conflicto-register-update.component.scss']
})
export class DjConflictoRegisterUpdateComponent implements OnInit {

  form                        : FormGroup;
  user                        : UserSession;
  redes                       : Red[] = [];
  private _redes!             : Red[];
  ipress                      : Ipress[] = [];
  private _ipress!            : Ipress[];
  opt_dbjIndVinculo           : Boolean = false; 
  opt_dgjIndConyuge           : Boolean = false;
  opt_vfaIndParientes         : Boolean = false;
  opt_dveIndPropietario       : Boolean = false;
  opt_osIndOtrasSituaciones   : Boolean = false;
  opt_checkInicio             : Boolean = false;
  opt_checkModif              : Boolean = false;
  isSave                      : Boolean = false;
  idDj                        : number;
  ocultar                     : Boolean = false;

  djConflictoItem             : DjConflicto = null;
  marcado                     : any ='';
  desmarcado                  : any ='';
  logo                        : any ='';
  footer                      : any ='';

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    private _dlg            : MatDialogRef<DjConflictoRegisterUpdateComponent>,
    private _dialogService  : DialogService,
    private matIconRegistry : MatIconRegistry,
    private domSanitizer    : DomSanitizer,
    private _formBuilder    : FormBuilder,
    private _userService    : UsuarioService,
    private _redService     : RedService,
    private _ipressService  : IpressService,
    private _notification   : NotificationService,
    private _djConflictoService: DjConflictoService,
    private _authService    : AuthService,
    private scriptService   : ScriptService,
  ) { 
    this.scriptService.load('pdfMake', 'vfsFonts');
    this.matIconRegistry.addSvgIcon("cancel",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/cancel.svg"));
   }

  ngOnInit(): void {
    this._createForm();
    this._loadParams();
    this._loadImages();
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe( data =>{
      this.form.controls.dgCodPlanilla.setValue(data.codigoPlanilla);
      this.form.controls.dgNombresApellidos.setValue(data.nombres+' '+data.apellidos);
      this.form.controls.numeroDni.setValue(data.numeroDocumento);
    })
  }

  private _loadParams() {
    this._redService.getAll().subscribe(data => {
        this.redes = data;
        this._redes = data;
    });
    this._ipressService.getAll().subscribe(data => {
      this.ipress = data;
      this._ipress = data;
    });
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      dgIndVinculoLaboralContractual  : [''],
      dgIndCasoConflicto              : [''],
      dgCodPlanilla                   : ['', Validators.required],
      dgNombresApellidos              : ['', Validators.required],
      dgRedidred                      : ['', Validators.required],
      dgIpressidipress                : ['', Validators.required],
      dgCargo                         : ['', Validators.required],
      dgArea                          : ['', Validators.required],
      dgIndAutenticos                 : ['', Validators.required],
      dbjIndVinculo                   : ['', Validators.required],
      dbjIndVinculoDet                : [''],
      dgjIndConyuge                   : ['', Validators.required],
      dgjIndConyugeDet                : [''],
      vfaIndParientes                 : ['', Validators.required],
      vfaIndParientesDet              : [''],
      dveIndPropietario               : ['', Validators.required],
      dveIndPropietarioDet            : [''],
      osIndOtrasSituaciones           : ['', Validators.required],
      osIndOtrasSituacionesDet        : [''],
      numeroDni                       : ['', Validators.required]
    });
  }

  private async _loadImages() {
    this.logo = await this.toDataURL('assets/images/logo.jpg');
    this.marcado = await this.toDataURL('assets/images/marcado.jpg');
    this.desmarcado = await this.toDataURL('assets/images/desmarcado.jpg');
    this.footer = await this.toDataURL('assets/images/footer.jpg');
  }

  toDataURL = async (url) => {    
    var res = await fetch(url);
    var blob = await res.blob();

    const result = await new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })

    return result
  };

  onSave(){
    if(!this.form.valid){
      this._notification.warning("Favor Complete el formulario")
    } else {
      const model: DjConflictoRegister = this.form.value; 
      
      this._djConflictoService
          .register(model)
          .subscribe((dataItem) => {
              if (dataItem.codigo == 1) {
                this._notification.success(dataItem.msj);
                this.isSave = true;
                this.idDj = dataItem.data;
              } else {
                this._notification.error(dataItem.msj)
              }
          });
    }
  }

  listaRedes(e: any): void {
    this._ipressService.getByIdRed(e.value).subscribe( data =>{
      this.ipress = data;
      this._ipress = data;
    });
  }

  buscarRed(filtro: any) {
    const value = filtro.target.value ? filtro.target.value : '';
    this.redes = this._redes.filter(x => {
      const nombre: string = x.nombre.toLocaleLowerCase();
      return nombre.indexOf(value) > -1;
    });
  }

  buscarIpress(filtro: any) {
    const value = filtro.target.value ? filtro.target.value : '';
    this.ipress = this._ipress.filter(x => {
      const nombre: string = x.nombre.toLocaleLowerCase();
      return nombre.indexOf(value) > -1;
    });
  }

  confirmSave(){
    if(!this.form.valid){
      this._notification.warning("Favor Complete el formulario")
    }else{
      this._dialogService
      .openConfirm('¿Está seguro de registrar su Declaración Jurada?', 'Centro de Mensajes')
      .pipe(filter((isConfirmed) => isConfirmed))
      .subscribe(() => this.onSave());
    }
  }

  showDetalle(option: string) {
    switch (option) {
      case 'dbjIndVinculo'        : this.opt_dbjIndVinculo = true; break;
      case 'dgjIndConyuge'        : this.opt_dgjIndConyuge = true; break;
      case 'vfaIndParientes'      : this.opt_vfaIndParientes = true; break;
      case 'dveIndPropietario'    : this.opt_dveIndPropietario = true; break;
      case 'osIndOtrasSituaciones': this.opt_osIndOtrasSituaciones = true; break;
    }
  }

  hideDetalle(option: string) {
    switch (option) {
      case 'dbjIndVinculo'        : this.opt_dbjIndVinculo = false; break;
      case 'dgjIndConyuge'        : this.opt_dgjIndConyuge = false; break;
      case 'vfaIndParientes'      : this.opt_vfaIndParientes = false; break;
      case 'dveIndPropietario'    : this.opt_dveIndPropietario = false; break;
      case 'osIndOtrasSituaciones': this.opt_osIndOtrasSituaciones = false; break;
    }
  }

  oncheckInicio(e){
    if(e.checked){
      this.opt_checkInicio = true;
      if(this.opt_checkModif)
        this.opt_checkModif = false;
    }else{
      this.opt_checkInicio = false;
    }
  }

  oncheckModif(e){
    if(e.checked){
      this.opt_checkModif = true;
      if(this.opt_checkInicio)
        this.opt_checkInicio = false;
    }else{
      this.opt_checkModif = false;
    }
  }

  imprimirDj(){
    if(this.idDj)
      this.getDj(this.idDj);
    else
      this._notification.error('No se encontró Declaración Jurada');
  }

  generatePdf() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).open(); //print, download
  }

  getDj(id: number){
    this._djConflictoService.getById(id)
    .pipe( finalize( ()=>this.generatePdf() ))
    .subscribe( (item)=>{
      this.djConflictoItem = item;
      console.log('obtener data');
    });
  }
  
  private getDocumentDefinition() {
    const datepipe: DatePipe = new DatePipe('en-US')
    let fecha = datepipe.transform(this.djConflictoItem.fechaCreacion, 'dd/mm/YYYY HH:mm');
    
    return {
      pageMargins: [ 40, 80, 40, 60 ],
      header: {
        columns: [
          { image: this.logo, width: 120, alignment : 'left', margin: [20, 20, 0, 20] },
          { width: '*', text: '"Año del Fortalecimiento de la Soberanía Nacional"',
            style: 'text', 
            alignment : 'center',
            fontSize: 9,
            margin: [0, 45, 0, 20]
          },
          { width: 120, text: '', alignment : 'left', margin: [20, 20, 0, 20] },
        ]
      },
      footer: {
        columns: [
          { image: this.footer, height: 60, width: 600, alignment : 'center', margin: [10, 0, 0, 0] }
        ]
      },

      content: [
        // { qr: 'declaracion', alignment: 'right', fit: '80', margin: [0, -40, 0, 0]},
        {
          text: 'Declaración Jurada de Conflicto de Interés',
          bold: true,
          fontSize: 13,
          alignment: 'center',
          margin: [0, 0, 0, 20],
          decoration: 'underline'
        },
        { columns: [
            { width: '30%', text: 'Nombres y Apellidos:', style: 'textbold' },
            { width: '*', text: this.djConflictoItem.dgNombresApellidos, style: 'text'},
          ]
        },
        { columns: [
          { width: '30%', text: 'Área:', style: 'textbold' },
          { width: '*', text: this.djConflictoItem.dgArea, style: 'text'},
          ]
        },
        { columns: [
          { width: '30%', text: 'Cargo:', style: 'textbold' },
          { width: '*', text: this.djConflictoItem.dgCargo, style: 'text'},
          ]
        },
        { columns: [
          { width: '30%', text: 'Entidad:', style: 'textbold' },
          { width: '*', text: 'EsSalud', style: 'text'},
          ]
        },
        { columns: [
          { width: '30%', text: 'Fecha:', style: 'textbold' },
          { width: '*', text: fecha, style: 'text'},
          ]
        },
        { columns: [
          { width: '30%', text: 'Tipo:', style: 'textbold' },
          { width: '*', text: this.djConflictoItem.dgTipo, style: 'text'},
          ]
        },
        { columns: [
          { width: '30%', text: 'Red:', style: 'textbold' },
          { width: '*', text: this.djConflictoItem.dgNombreRed, style: 'text'},
          ]
        },
        { columns: [
          { width: '30%', text: 'Hospital/Unidad Orgánica:', style: 'textbold' },
          { width: '*', text: this.djConflictoItem.dgNombreIpress, style: 'text'},
          ]
        },
        {
          text: 'Por medio de la presente, en virtud del Principio de Veracidad, declaro bajo juramento que:',
          fontSize: 10,
          alignment: 'left',
          margin: [0, 10, 0, 10]
        },
        {
          text: 'I. Sobre la documentación del legajo personal, títulos y hoja de vida:',
          style: 'textTitle'
        },
        {
          text: 'El que suscribe el presente documento declara bajo juramento que todos los documentos presentados y consignados en mi legajo personal y hoja de vida (currículo vitae) son auténticos.',
          style: 'text'
        },
        this.getMarca(this.djConflictoItem.dgIndAutenticos),
        {
          text: '__________________________________________________________________________________________________________________',
          fontSize: 10,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Por medio de la presente, en virtud del Principio de Presunción de Veracidad, declaro bajo juramento que, tengo conocimiento de lo siguiente:',
          fontSize: 10,
          alignment: 'justify',
          margin: [0, 0, 0, 5]
        },
        {
          text: 'II. Vínculos Laborales entre trabajadores de EsSalud:',
          style: 'textTitle'
        },
        {
          text: 'El suscrito, mi cónyuge o conviviente, tenemos o hemos tenido vínculo, directo o indirecto, comercial, económico, laboral o de servicio en los 2 últimos años con alguna de las empresas, contratistas o personas naturales que brindan servicios y/o bienes a la entidad.',
          style: 'text'
        },
        this.getMarca(this.djConflictoItem.dbjIndVinculo),
        this.getDetalle_dbjIndVinculo(this.djConflictoItem.dbjIndVinculo),
        {
          text: 'Soy cónyuge o conviviente o pariente dentro del cuarto grado de consanguinidad o segundo de afinidad con alguno los servidores de EsSalud, cualquiera fuere su modalidad de contratación.',
          style: 'text'
        },
        this.getMarca(this.djConflictoItem.dgjIndConyuge),
        this.getDetalle_dgjIndConyuge(this.djConflictoItem.dgjIndConyuge),
        {
          text: 'III. Vínculos familiares y afectivos:',
          style: 'textTitle'
        },
        {
          text: 'El suscrito, mi cónyuge o conviviente, somos parientes dentro del cuarto grado de consanguinidad o segundo de afinidad, o tenemos amistad o enemistad manifiesta, con alguno de los accionistas principales, gerentes, apoderados, asesores, abogados, consultores, ejecutivos con poder de decisión u otros de naturaleza similar de las empresas, contratistas o personas naturales que brindan servicios y/o bienes a la entidad.',
          style: 'text'
        },
        this.getMarca(this.djConflictoItem.vfaIndParientes),
        this.getDetalle_vfaIndParientes(this.djConflictoItem.vfaIndParientes),
        {
          text: 'IV. Declaración de vínculo empresarial:',
          style: 'textTitle'
        },
        {
          text: 'El suscrito declara ser propietario, accionista, tener participaciones u otros derechos sobre las siguientes empresas, asociaciones o personas jurídicas:',
          style: 'text'
        },
        this.getMarca(this.djConflictoItem.dveIndPropietario),
        this.getDetalle_dveIndPropietario(this.djConflictoItem.dveIndPropietario),
        {
          text: 'V. Tengo otras situaciones que podrían constituir conflicto de interés:',
          style: 'textTitle'
        },
        this.getMarca(this.djConflictoItem.osIndOtrasSituaciones),
        this.getDetalle_osIndOtrasSituaciones(this.djConflictoItem.osIndOtrasSituaciones),
        {
          text: 'Quedo notificado que, de ser falsa la información otorgada en dicha Declaración jurada o incompleta, asumiré la responsabilidad administrativa, civil y penal correspondiente.',
          style: 'text'
        },
        {
          layout: 'Borders', // optional
          table: {
            widths: [ '*', 150, 150 ],
    
            body: [
              [ { text: '', },
                { text: this.djConflictoItem.dgNombresApellidos, fontSize: 13, alignment: 'center', bold: true, margin: [0, 20, 0, 20], },
                { text: this.djConflictoItem.numeroDni, fontSize: 13, alignment: 'center', bold: true, margin: [0, 20, 0, 20], },
              ],
              [ 
                { text: 'Firma del Servidor', fontSize: 10, alignment: 'center' }, 
                { text: 'Nombre del Servidor', fontSize: 10, alignment: 'center' }, 
                { text: 'DNI', fontSize: 10, alignment: 'center' }, 
              ],
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline'
        },
        textbold: {
          fontSize: 10,
          bold: true,
          margin: [0, 3, 0, 10],
        },
        text: {
          fontSize: 10,
          bold: false,
          alignment: 'justify',
          margin: [0, 3, 0, 10],
        },
        textTitle: {
          fontSize: 13,
          bold: false,
          alignment: 'left',
          decoration: 'underline',
          margin: [0, 0, 0, 5]
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true
        },
        tableHeader: {
          bold: true,
        }
      },
    };
  }

  getMarca(valor: String) {
    if (valor=='SI') {
      return {
        columns: [
          { image: this.marcado, width: 20, height: 20, alignment : 'left' },
          { width: '5%', text: 'SI', style: 'text' },
          { image: this.desmarcado, width: 20, height: 20, alignment : 'left' },
          { width: '*', text: 'NO', style: 'text'},
        ],
        columnGap: 5
      };
    }else{
      return{
        columns: [
          { image: this.desmarcado, width: 20, height: 20, alignment : 'left' },
          { width: '5%', text: 'SI', style: 'text' },
          { image: this.marcado, width: 20, height: 20, alignment : 'left' },
          { width: '*', text: 'NO', style: 'text'},
        ],
        columnGap: 5
      }
    }
  }

  getDetalle_dbjIndVinculo(valor: string){
    if(valor=='SI'){ return { text: this.djConflictoItem.dbjIndVinculoDet, style: 'text' } }
  }

  getDetalle_dgjIndConyuge(valor: string){
    if(valor=='SI'){ return { text: this.djConflictoItem.dgjIndConyugeDet, style: 'text' } }
  }

  getDetalle_vfaIndParientes(valor: string){
    if(valor=='SI'){ return { text: this.djConflictoItem.vfaIndParientesDet, style: 'text' } }
  }

  getDetalle_dveIndPropietario(valor: string){
    if(valor=='SI'){ return { text: this.djConflictoItem.dveIndPropietarioDet, style: 'text' } }
  }

  getDetalle_osIndOtrasSituaciones(valor: string){
    if(valor=='SI'){ return { text: this.djConflictoItem.osIndOtrasSituacionesDet, style: 'text' } }
  }

  cancelar(){
    this._dlg.close();
  }
}
