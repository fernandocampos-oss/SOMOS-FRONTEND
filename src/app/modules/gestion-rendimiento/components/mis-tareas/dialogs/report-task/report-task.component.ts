import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services';
import { MatTableDataSource } from '@angular/material/table';
import { Informe, Archivo } from '../../../../../../data/models/gestion-rendimiento/gestion-rendimiento.model'
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-report-task',
  templateUrl: './report-task.component.html',
  styleUrls: ['./report-task.component.scss']
})
export class ReportTaskComponent implements OnInit {

  form: FormGroup;
  objInforme: Informe = new Informe();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'descripcion', 'acciones'];
  selectedIndex=0;
  idObj=0;
  objArchivo = new Archivo();
  loading = false;

  constructor(
    private change: ChangeDetectorRef,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private services: GestionRendimientoService,
    private _dlg: MatDialogRef<ReportTaskComponent>,
  ) { }

  ngOnInit(): void {
    this.objInforme=this.data.obj;
    this.createForm();
  }

  createForm(){
    this.form = this._fb.group({
      frmTarea: [this.objInforme.descripcion],
      frmEstado: [this.objInforme.estado],
      frmDescripcion: [null,[Validators.required, Validators.maxLength(300)]],
      frmAvance: [null,[Validators.required,Validators.min(1),Validators.max(100)]],
    });
  }

  onTabChanged(event){
    if(event.index==1 && !this.form.valid){
      this.selectedIndex=0;
      this._notification.error("Se deben ingresar los datos para continuar");
    }
  }

  next(){
    this.selectedIndex=1;
  }

  onSave(event){
    if(!this.form.valid){
      this._notification.error("Se deben ingresar los campos requeridos")
    } else {
      let i = new Informe();
      i.idTarea = this.objInforme.id;
      i.avance = this.form.value.frmAvance;
      i.descripcion = this.form.value.frmDescripcion;
      this.services.RegistrarInforme(i).subscribe((dataItem) => {
        if (dataItem.codigo == 1) {
          this.idObj=dataItem.data;
          this.uploadFile(event);
          this._notification.success(dataItem.msj);
        } else {
          this._notification.error(dataItem.msj)
        }
      });
    }
  }

  loadTable(){
    this.services.ListarArchivos(this.idObj).subscribe((dataItem) => {
      if (dataItem.codigo == 1) {
        this.dataSource = new MatTableDataSource(dataItem.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource=null;
        if(dataItem.msj=="LISTA VACIA"){
          this._notification.warning(dataItem.msj)
        } else {
          this._notification.error(dataItem.msj)
        }
      }
    });
  }
  
  uploadFile(event){
    const file:File = event.target.files[0];
    const reader = new FileReader();
    this.loading=true;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.objArchivo = new Archivo();
      this.objArchivo.base64=reader.result;
      let completo = file.name;
      const lastDot =completo.lastIndexOf('.');
      this.objArchivo.nombreReal = completo.substring(0, lastDot);
      this.objArchivo.ext = completo.substring(lastDot + 1);
      this.objArchivo.tipo = file.type;
      this.objArchivo.idEvidencia=this.idObj;
      this.services.CargarArchivo(this.objArchivo).subscribe((dataItem) => {
        if (dataItem.codigo == 1) {
          this.loading=false;
          event.target.value = null;
          this.loadTable();
        } else {
          this._notification.error(dataItem.msj)
        }
      });
    }
  }

  onFileSelected(event){
    if(this.idObj==0){
      this.onSave(event);
    }else {
      this.uploadFile(event);
    }
  }

  eliminarArchivo(item){
    this.services.EliminarArchivo(item.id).subscribe({
      next: data => {
        this.loadTable();
      },
      error: error => {
        this._notification.error("Eliminar Archivo: Se produjo un error")
      }
    });
  }

}

