import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS, StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vista-previa-proyecto',
  templateUrl: './vista-previa-proyecto.component.html',
  styleUrls: ['./vista-previa-proyecto.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    }, { provide: MatFormFieldControl, useExisting: VistaPreviaProyectoComponent }
  ],
})
export class VistaPreviaProyectoComponent implements OnInit {

  vistaCelular = false;
  displayedColumns: string[] = ['dni', 'nombres', 'cargo', 'celular', 'correo'];
  stepperOrientation: Observable<StepperOrientation>;

  formDatosProyecto: any;
  formImplementacion: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data        : any,
              private _formBuilder                        : FormBuilder,
              private breakpointObserver                  : BreakpointObserver,) { 
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
    this.formDatosProyecto = this._formBuilder.group({
      ctrlFechaImplementacion: [this.data.projectInfo.descripcion.fecha ? this.data.projectInfo.descripcion.fecha : 'Sin Fecha Establecida'],
      ctrlMotivacion: [this.data.projectInfo.descripcion.motivo ? this.data.projectInfo.descripcion.motivo : 'Sin Motivo Establecido'],
      ctrlAccionInnovadora: [this.data.projectInfo.descripcion.descripcion ? this.data.projectInfo.descripcion.descripcion : 'Sin descripcion establecida'],
      ctrlContextoInicial: [this.data.projectInfo.descripcion.contexto ? this.data.projectInfo.descripcion.contexto : 'Sin contexto definido'],
      ctrlInnovador: [this.data.projectInfo.descripcion.innovacion ? this.data.projectInfo.descripcion.innovacion : 'Campo no definido'],
      ctrlIndicadores: [this.data.projectInfo.descripcion.indicador ? this.data.projectInfo.descripcion.indicador : 'Sin Indicadores definidos'],
    });
    this.formImplementacion = this._formBuilder.group({
      ctrlResultado: [this.data.projectInfo.implementacion.resultado ? this.data.projectInfo.implementacion.resultado : 'Sin resultado establecido'],
      ctrlSostenibleFundamento: [this.data.projectInfo.implementacion.sostenibleFundamento ? this.data.projectInfo.implementacion.sostenibleFundamento : 'Sin fundamento establecido'],
      ctrlReplicableFundamento: [this.data.projectInfo.implementacion.replicableFundamento ? this.data.projectInfo.implementacion.replicableFundamento : 'Sin fundamento establecido'],
      ctrlTecnologiaFundamento: [this.data.projectInfo.implementacion.tecnologiaFundamento ? this.data.projectInfo.implementacion.tecnologiaFundamento : 'Sin fundamento establecido'],
      ctrlBeneficio: [this.data.projectInfo.implementacion.beneficio ? this.data.projectInfo.implementacion.beneficio : 'Sin beneficio establecido'],
    });
  
    // console.log(this.data.projectInfo)
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

  showPdf(){
    const blob = this.base64ToBlob(this.data.projectInfo.implementacion.archivoBase64, 'application/pdf');
    const url = URL.createObjectURL(blob);

    // const link = document.createElement('a');
    // link.href = url;
    // link.target = '_blank';
    // link.click();
    window.open(url, '_blank');

    URL.revokeObjectURL(url);
  }
}
