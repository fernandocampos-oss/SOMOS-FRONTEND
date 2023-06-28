import { PersonalFiltroNombreDTO } from './../../../../../../data/models/gestion-rendimiento/personalFiltroNombreDTO';
import { map } from 'rxjs/operators';
import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Personal } from '@data/models/gestion-rendimiento/personal';
import { Cargo } from '@data/models/gestion-rendimiento/cargo';
import { Dependencia } from '@data/models/gestion-rendimiento/dependencia';
import { ConstantesGr } from '@data/constants/constantes-gr.constant';

@Component({
  selector: 'app-user-add-delete',
  templateUrl: './user-add-delete.component.html',
  styleUrls: ['./user-add-delete.component.scss']
})
export class UserAddDeleteComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'dni', 'colaborador', 'cargo', 'modalidad', 'riesgo'];
  selection = new SelectionModel<any>(false, []);

  form: FormGroup;
  title = "";
  borrar: boolean = false;
  integrantes: any = [];

  listaModalidad = [];
  listaRiesgo = [];

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UserAddDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private services: GestionRendimientoService
  ) { }

  ngOnInit(): void {
    this.onProcess(this.data.borrar);
    console.log(this.data);
  }

  onProcess(data) {
    this.title = this.data.title;
    this.borrar = this.data.borrar;
    this.createForm(this.borrar);
  }

  searchIntegrante() {
    let dtoFiltro = new PersonalFiltroNombreDTO(this.form.value.integrante);
    dtoFiltro.nombres =  dtoFiltro.nombres.toLowerCase();
      
    if (!this.form.valid) {
      this._notification.warning("Se deben ingresar los campos requeridos")
    } else {
      this.services.BuscarPersona(dtoFiltro).subscribe((dataItem) => {
        if (dataItem) {
          this.dataSource = new MatTableDataSource(dataItem);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = null;
          // this._notification.error(dataItem.msj)
        }
      });
    }
  }

  // loadIntegrantes() {
  //   this.services.ListarIntegrantes().subscribe((dataItem) => {
  //     if (dataItem.codigo == 1) {
  //       this.integrantes = dataItem.data
  //     } else {
  //       this.integrantes = null;
  //       this._notification.error(dataItem.msj)
  //     }
  //   });
  // }

  loadIntegrantes() {
    console.log("memoria dependencia=2");
    let idDependencia = 2;

    this.services.listarPersonalPorDependenciaAsignado(idDependencia, ConstantesGr.ESTADO_PERSONAL_ASIGNADO).subscribe((data) => {
      if (data) {
        this.integrantes = data
      } else {
        this.integrantes = null;
        this._notification.error("Error al cargar integrantes")
      }
    });
  }

  loadModalidad() {
    this.services.ListarModalidad().subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.listaModalidad = dataItem.data
      } else {
        this.listaModalidad = null;
        this._notification.error(dataItem.msj)
      }
    });
  }

  loadRiesgo() {
    this.services.ListarRiesgo().subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.listaRiesgo = dataItem.data
      } else {
        this.listaRiesgo = null;
        this._notification.error(dataItem.msj)
      }
    });
  }

  createForm(borrar: boolean) {
    if (borrar) {
      this.loadIntegrantes();
      this.form = this._fb.group({
        frmIntegrantes: [null, [Validators.required]],
        frmMotivo: [null, [Validators.required]]
      });
    } else {
      this.form = this._fb.group({
        integrante: [null, [Validators.required, Validators.maxLength(100)]],
      });
      this.loadModalidad();
      this.loadRiesgo();
    }

  }

  onSave() {
    if (this.borrar) {
      if (this.form.valid) {
        this.services.EliminarIntegrante(this.form.value.frmIntegrantes, this.form.value.frmMotivo).subscribe({
          next: data => {
            this.loadIntegrantes();
            this.dialogRef.close();
            this._notification.success("Se eliminó al integrante")
          },
          error: error => {
            this._notification.error("Eliminar integrante: Se produjo un error")
          }
        });
      } else {
        this._notification.warning("Se deben seleccionar / ingresar los campos requeridos")
      }
    } else {
      if (this.selection.selected.length > 0) {
        for (let i of this.selection.selected) {
          let p = new Personal();
          p.numeroDni = i.numeroDni;
          p.nombres = i.nombres;
          p.apellidoPaterno = i.apellidoPaterno;
          p.apellidoMaterno = i.apellidoMaterno;
          p.estado = ConstantesGr.ESTADO_PERSONAL_ASIGNADO;

          let cargo = new Cargo();
          cargo.idCargo = i.cargo.idCargo;
      
          let dependencia = new Dependencia();
          dependencia.idDependencia = i.dependencia.idDependencia;

          p.cargo = cargo;
          p.dependencia = dependencia;
       
          this.services.registrarPersonal(p).subscribe((data) => {
            if (data=1) {
              this.dialogRef.close();
              this._notification.success("Se registró colaborador")
            } else {
              this._notification.error("Error al registrar colaborador")
            }
          });
        }
      } else {
        this._notification.warning("Se deben seleccionar una persona para agregar al grupo")
      }

    }
  }

  seleccionar(value: any, element: any, modalidad: boolean) {
    if (modalidad) {
      element.idModalidad = value;
    } else {
      element.idRiesgo = value;
    }
  }

}

export class Persona {
  dni?: string;
  idModalidad?: number
  idRiesgo?: number
}