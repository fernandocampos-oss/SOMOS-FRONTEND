import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnDef, ColumnType } from '@shared/table/table.component';
import { DjConflictoRegisterUpdateComponent } from './components/dialogs/dj-conflicto-register-update/dj-conflicto-register-update.component';
import { ComponentType } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DjConflicto } from '../../data/models/dj-conflicto/dj-conflicto.model';
import { DjConflictoService } from '@data/services/dj-conflicto.service';
import { ScriptService } from '../../data/services/script.service';
import { forkJoin } from 'rxjs';
import { AuthService, UsuarioService } from '@data/services';
import { UserSession, Usuario } from '@data/models';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
declare let pdfMake: any ;

@Component({
  selector: 'app-dj-conflicto-interes',
  templateUrl: './dj-conflicto-interes.component.html',
  styleUrls: ['./dj-conflicto-interes.component.scss']
})
export class DjConflictoInteresComponent implements OnInit {

  marcado     : any ='';
  desmarcado  : any ='';
  logo        : any ='';
  footer      : any ='';
  user        : UserSession;
  usuario     : Usuario;
  userCodPlanilla: String = '';

  constructor(
    private _matDialog: MatDialog,
    private _router: Router,
    private route: ActivatedRoute,
    private _djConflictoService: DjConflictoService,
    private _userService: UsuarioService,
    private scriptService: ScriptService,
    private _authService: AuthService,
  ) {
    this.scriptService.load('pdfMake', 'vfsFonts');
   }

  ngOnInit() {
    this._loadImages();
    this._loadData();
  }

  djConflictoItem: DjConflicto = null;
  djConflictoList: DjConflicto[] = [];
  djConflictoColumns: ColumnDef[] = [
    {
      label: 'Nombre',
      name: 'dgNombresApellidos',
    },
    {
      label: 'Fecha Creación',
      name: 'fechaCreacion',
      type: ColumnType.DATETIME,
    },
    {
      label: 'Tipo',
      name: 'dgTipo',
    }
  ];

  onCreateDjConflicto() {
    this._openAddUpdateDialog(
      DjConflictoRegisterUpdateComponent,
      null,
      this._loadData
    );
  }

  onDownload(data: DjConflicto) {
    this.getDj(data.idDjConflictoInteres);
  }

  private _openAddUpdateDialog<T>(
    dialog: ComponentType<T>,
    data: any,
    callback: () => void
  ) {
    this._matDialog
      .open(dialog, { data, disableClose: true,width: '1200px' })
      .afterClosed()
      // .pipe(
      //   untilDestroyed(this),
      //   filter((isSuccess) => isSuccess)
      // )
      .subscribe(() => callback.call(this));
  }

  private _loadData() {
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe( data =>{
        this.usuario = data;
        const dj$ = this._djConflictoService.getbyCodigoPlanilla(this.usuario.codigoPlanilla);
        forkJoin([dj$])
          .subscribe(([dj]) => {
            this.djConflictoList = dj;
          });
    });
  }

  private async _loadImages() {
    this.logo = await this.toDataURL('assets/images/logo.jpg');
    this.marcado = await this.toDataURL('assets/images/marcado.jpg');
    this.desmarcado = await this.toDataURL('assets/images/desmarcado.jpg');
    this.footer = await this.toDataURL('assets/images/footer.jpg');
  }

  generatePdf() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).open(); //print, download
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
  
  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
}
