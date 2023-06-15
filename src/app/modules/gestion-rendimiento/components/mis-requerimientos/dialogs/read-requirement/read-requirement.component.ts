import { Component, Inject, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestionRendimientoService  } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-read-requirement',
  templateUrl: './read-requirement.component.html',
  styleUrls: ['./read-requirement.component.scss']
})
export class ReadRequirementComponent implements OnInit {
  objElement: any;
  form: FormGroup;
  requerimiento: string;
  estadoReq: string;
  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private services: GestionRendimientoService,
  ) { }

  ngOnInit(): void {    
    this.objElement=this.data.obj;
    this.estadoReq = this.data.obj.estado;
    // this.estadoReq = this.data.obj.estadoRequerimiento.descripcion;
    this.requerimiento = this.objElement.nombreRequerimiento;
    this.createForm();
  }
  createForm(){
    this.form = this._fb.group({
      frmTipo: [this.objElement.tipoRequerimiento],
      frmDescripcion: [this.objElement.descripcion],
      frmAreaSolicitante:[this.objElement.gerenciaSolicitante],
      frmAreaDestinatario:[this.objElement.gerenciaReceptor],
      frmMotivo:[this.objElement.motivo],
      frmEstado: [this.objElement.estado]
    });
  }

  // onPoiCreate(){
  //   this.poiList.push({descripcionPoi: this.descripcionPoi});
  //   this.descripcionPoi = "";
  //   this.table.renderRows();
  // }

  // deletePoi(index){
  //   this.poiList.splice(index,1);
  //   this.table.renderRows();
  // }
  
}
