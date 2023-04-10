import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-user-add-delete',
  templateUrl: './user-add-delete.component.html',
  styleUrls: ['./user-add-delete.component.scss']
})
export class UserAddDeleteComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'dni', 'colaborador','cargo','modalidad','riesgo'];
  selection = new SelectionModel<any>(false, []);

  form: FormGroup;
  title ="";
  borrar: boolean=false;
  integrantes: any=[];

  listaModalidad=[];
  listaRiesgo=[]

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UserAddDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private services : GestionRendimientoService
  ) { }

  ngOnInit(): void {
    this.onProcess(this.data.borrar)
  }

  onProcess(data){
    this.title = this.data.title;
    this.borrar = this.data.borrar;
    this.createForm(this.borrar);
  }

  
  searchIntegrante(){
    if (!this.form.valid) {
      this._notification.error("Se deben ingresar los campos requeridos")
    } else {
      this.services.BuscarPersona(this.form.value.integrante).subscribe((dataItem) => {
        if (dataItem.codigo == 1) {
          this.dataSource = new MatTableDataSource(dataItem.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource=null;
          this._notification.error(dataItem.msj)
        }
      });
    }
  }

  loadIntegrantes(){
    this.services.ListarIntegrantes().subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.integrantes = dataItem.data
      } else {
        this.integrantes = null;
        this._notification.error(dataItem.msj)
      }
    });
  }

  loadModalidad(){
    this.services.ListarModalidad().subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.listaModalidad = dataItem.data
      } else {
        this.listaModalidad = null;
        this._notification.error(dataItem.msj)
      }
    });
  }

  loadRiesgo(){
    this.services.ListarRiesgo().subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.listaRiesgo = dataItem.data
      } else {
        this.listaRiesgo = null;
        this._notification.error(dataItem.msj)
      }
    });
  }

  createForm(borrar : boolean) {
    if (borrar) {
      this.loadIntegrantes();
      this.form = this._fb.group({
        frmIntegrantes: [null, [Validators.required]],
        frmMotivo: [null, [Validators.required]]
      });
    } else {
      this.form = this._fb.group({
        integrante:[null, [Validators.required, Validators.maxLength(100)]],
      });
      this.loadModalidad();
      this.loadRiesgo();
    }
    
  }

  onSave(){
    if(this.borrar){
      if(this.form.valid){
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
        this._notification.error("Se deben seleccionar / ingresar los campos requeridos")
      }
    } else {
      if(this.selection.selected.length > 0){
        for(let x of this.selection.selected){
          let p = new Persona();
          p.dni=x.numeroDni;
          p.idRiesgo=x.idRiesgo;
          p.idModalidad=x.idModalidad;
          this.services.AgregarPersona(p).subscribe((dataItem) => {
            if (dataItem.codigo == 1) {
              this.dialogRef.close();
              this._notification.success(dataItem.msj)
            } else {
              this._notification.error(dataItem.msj)
            }
          });
        }
      } else {
        this._notification.error("Se deben seleccionar una persona para agregar al grupo")
      }
      
    }
  }

  seleccionar(value: any, element: any, modalidad: boolean) {
    if(modalidad){
      element.idModalidad=value;
    }else{
      element.idRiesgo=value;
    }
  }

}

export class Persona {
  dni? : string;
  idModalidad?: number
  idRiesgo?: number
}