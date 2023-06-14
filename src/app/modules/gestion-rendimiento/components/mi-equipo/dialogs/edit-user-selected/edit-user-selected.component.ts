import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfig } from '@core/configs';
import { Requerimiento, Requerimiento_Integrante } from '@data/models/requerimiento/requerimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-edit-user-selected',
  templateUrl: './edit-user-selected.component.html',
  styleUrls: ['./edit-user-selected.component.scss']
})
export class EditUserSelectedComponent implements OnInit {
  minFechaTarea = AppConfig.MAX_FECHA_NACIMIENTO;

  datosAsignados: Requerimiento_Integrante[] = [];
  requerimientos: Requerimiento[] = [];
  

  formEditar = this._fb.group({
    frmCargo: [this.data.obj.cargo,Validators.required],
    tareas: this._fb.array([])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _gestionRendimientoService  : GestionRendimientoService,
              private _fb                         : FormBuilder,) { }

  ngOnInit(): void {
    this.cargarRequerimientos();
    console.log(this.datosAsignados);
    console.log(this.requerimientos);
  }

  cargarRequerimientos(){
    this.datosAsignados = this._gestionRendimientoService.getFauxTablaRequeAsignados(this.data.obj.id);
    for (let i = 0; i < this.datosAsignados.length; i++) {
      var requerimiento = this._gestionRendimientoService.getFauxRequerimiento(this.datosAsignados[i].idReq);
      this.requerimientos.push(requerimiento);
      this.addTareas(this.datosAsignados[i]);      
    }
  }
  get tareas() {
    return this.formEditar.controls["tareas"] as FormArray;
  }
  addTareas(tarea: Requerimiento_Integrante) {
      const tareasForm = this._fb.group({
          frmTarea: [tarea.nombreTarea, Validators.required],
          frmPlazo: [new Date(+tarea.plazo.split('/')[2],+tarea.plazo.split('/')[1]-1,+tarea.plazo.split('/')[0]), Validators.required]
      });
      this.tareas.push(tareasForm);
  }
  mostrarElemento(element){
    if (element.value.frmPlazo._d != undefined) { // una vez se cambia la fecha
      console.log(element.value.frmPlazo._d.toLocaleDateString());
    }
    else{
      console.log(element.value.frmPlazo.toLocaleDateString());
    }
  }
}
