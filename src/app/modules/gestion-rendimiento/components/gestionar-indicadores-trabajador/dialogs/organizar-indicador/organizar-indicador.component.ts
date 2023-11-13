import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { NotificationService } from '@core/services';
import { Actividad, PrioridadDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-organizar-indicador',
  templateUrl: './organizar-indicador.component.html',
  styleUrls: ['./organizar-indicador.component.scss']
})
export class OrganizarIndicadorComponent implements OnInit {
  listActividad: Actividad[];
  listIndicador: any[] = [];

  selectedItems: any[] = [];
  listCheckSeleccionado: any;

  // selectedOptions:any;
  formActividadSelect = this._formBuilder.group({
    frmActividad: ['', Validators.required]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private services: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    this.listarActividades();
    this.listarIndicadores();
  }

  async listarActividades() {
    let listActividades = await this.services.listarActividades().then((data) => {
      if (data.length > 0) {
        this.listActividad = data;
      } else {
        this._notification.warning("Lista de actividades vacia");
      }
    });
  }

  async listarIndicadores() {
    let listActividades = await this.services.listarIndicadorPrincipal().then((data) => {
      if (data.length > 0) {
        this.listIndicador = data;
        console.log("list indicadores", this.listIndicador);
      }
    });
  }

  async registar() {
    console.log("peso", this.formActividadSelect.value.frmActividad.idActividad);

    let arrayIndicadoresSeleccionados: number[] = [];
    console.log("sel-1", this.listCheckSeleccionado)
    if (this.listCheckSeleccionado) {
      for (let a of this.listCheckSeleccionado) {
        arrayIndicadoresSeleccionados.push(a);
      }
    }

    let actividad = new Actividad();
    actividad.idActividad = this.formActividadSelect.value.frmActividad.idActividad;

    let dto = new PrioridadDto();
    dto.actividad = actividad;
    dto.listIdIndicador = arrayIndicadoresSeleccionados;
    console.log("dto", dto)

    let actualizar = await this.services.registrarAsignarPrioridad(dto).then(data => {
      this._notification.success("Los Indicadores/Productos fueron asociados correctamente");
      this.dialogRef.closeAll();
    });
  }

 
}
