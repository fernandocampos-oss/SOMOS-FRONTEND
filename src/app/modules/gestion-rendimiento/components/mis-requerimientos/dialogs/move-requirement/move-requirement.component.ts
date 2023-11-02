import { startWith, map } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService, NotificationService } from '@core/services';
import { ConstantesGr } from '@data/constants/constantes-gr.constant';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-move-requirement',
  templateUrl: './move-requirement.component.html',
  styleUrls: ['./move-requirement.component.scss']
})
export class MoveRequirementComponent implements OnInit {
  selectedIndex = 0;
  form_cambio: FormGroup;
  objElement: any;

  //Unidad Org
  listUnidades = [];
  myControlUnidad = new FormControl();
  filteredOptionsUnidad: Observable<any[]>;
  unidadSeleccionadoTmp: any;

  constructor(
    private _dialogService: DialogService,
    private _formBuilder: FormBuilder,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // console.log(this.data)
    this.createForm();
    // this.listarTodosUnidadOrganizativa();
  }

  private _filter(value: string) {
    if (value != undefined) {
      return this.listUnidades.filter(u => u.descripcion.toLowerCase().includes(value.toLowerCase()));
    }
    return this.listUnidades;
  }
  displayFnUnidad(selectedoption) {
    return selectedoption ? selectedoption.descripcion : undefined;
  }
  onSelectionChangeUnidad(event: any) {
    this.unidadSeleccionadoTmp = event.option.value;
    console.log(this.unidadSeleccionadoTmp);
  }

  // async listarTodosUnidadOrganizativa() {
  //   let listarUnidad = await this.services.listarTodosUnidadOrganizativa().then((data) => {
  //     if (data) {
  //       this.listUnidades = data;
  //       if (this.listUnidades.length > 0) {
  //         this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
  //           .pipe(
  //             startWith(''),
  //             map(value => typeof value === 'string' ? value : value.descripcion),
  //             map(descripcion => descripcion ? this._filter(descripcion) : this.listUnidades.slice())
  //           );
  //       }

  //     } else {
  //       this._notification.warning("Lista de unidades organizacionales vacia")
  //     }
  //   });
  // }

  createForm() {
    this.form_cambio = this._formBuilder.group({
      frmArea: [null, [Validators.required, Validators.maxLength(80)]],
      frmMotivo: [null, [Validators.required, Validators.maxLength(250)]],
    });
  }

  // derivarRequiremento() {
  //   this.data.obj.motivo = this.form_cambio.value.frmMotivo;
  //   this.services.derivarRequerimiento(ConstantesGr.ESTADO_REQUERIMIENTO_DERIVADO, this.data.obj.motivo, this.unidadSeleccionadoTmp.codUnidad, this.data.obj.idRequerimientoUsuario).subscribe(data => {
  //     if (data) {
  //       this._notification.success("Requerimiento derivado correctamente");
  //     } else {
  //       this._notification.error("Error al derivar requerimento")
  //     }
  //   });
  // }
}
