import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services';
import { MatTableDataSource } from '@angular/material/table';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Archivo, ArchivoNew } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';

@Component({
  selector: 'app-report-task',
  templateUrl: './report-task.component.html',
  styleUrls: ['./report-task.component.scss']
})
export class ReportTaskComponent implements OnInit {

  form: FormGroup;
  // objInforme: Informe = new Informe();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'descripcion', 'acciones'];
  selectedIndex = 0;
  idEvidencia: number = 0;
  idArchivo: number = 0;
  loading = false;
  // objArchivo = new Archivo();
  dataConvert = [];

  constructor(
    private change: ChangeDetectorRef,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private services: GestionRendimientoService,
    private _dlg: MatDialogRef<ReportTaskComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.data.obj);
    // this.objInforme = this.data.obj;
    this.createForm();
  }

  createForm() {
    this.form = this._fb.group({
      frmTarea: [this.data.obj.descripcion],
      frmEstado: [this.data.obj.estadoTarea.descripcion],
      frmDescripcion: [null, [Validators.required, Validators.maxLength(300)]],
      frmAvance: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
    });
  }

  onTabChanged(event) {
    if (event.index == 1 && !this.form.valid) {
      this.selectedIndex = 0;
      this._notification.warning("Se deben ingresar los datos para continuar");
    }
  }

  next() {
    this.selectedIndex = 1;
  }

  onSave(event) {
    if (!this.form.valid) {
      this._notification.warning("Se deben ingresar los campos requeridos")
    } else {
      let e //= new Evidencia();
      e.descripcion = this.form.value.frmDescripcion;
      e.avance = this.form.value.frmAvance;
      e.estado = true;
      let t// = new Tarea();
      t.idTarea = this.data.obj.idTarea;
      e.tarea = t;
      this.services.registrarEvidencia(e).subscribe((dataItem) => {
        if (dataItem.idEvidencia > 0) {
          this.idEvidencia = dataItem.idEvidencia;
          this.uploadFile(event);
          this._notification.success("Evidencia registrada correctamente");
        } else {
          this._notification.error("Error al registrar evidenvia")
        }
      });
    }
  }

  uploadFile(event) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    this.loading = true;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // this.objArchivo = new Archivo();
      let archivo = new ArchivoNew();
      // a.base64 = reader.result;
      let completo = file.name;
      const nombreFile = completo.lastIndexOf('.');
      archivo.nombre = completo.substring(0, nombreFile);
      archivo.nombreRegistro = "----";
      archivo.ruta = "--";
      archivo.tipo = file.type;
      archivo.extension = completo.substring(nombreFile + 1);
      archivo.estado = true;
      // this.objArchivo.idEvidencia = this.idObj;
      this.services.registrarArchivo(archivo).subscribe((dataItem) => {
        if (dataItem.idArchivo > 0) {
          this.idArchivo = dataItem.idArchivo;
          this.loading = false;
          event.target.value = null;
          this.registrarEvidenciaArchivo();
          // this.loadTable();
        } else {
          this._notification.error(dataItem.msj)
        }
      });
      archivo = null;
    }
  }

  onFileSelected(event) {
    if (this.idEvidencia == 0) {
      this.onSave(event);
    } else {
      this.uploadFile(event);
    }
  }

  eliminarArchivo(item) {
    this.services.eliminarArchivo(false, item.idEvidenciaArchivo).subscribe({
      next: data => {        
        // this.loadTable(item.idEvidenciaArchivo); 
        this.dataConvert= [];
        this.dataSource = new MatTableDataSource(this.dataConvert);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;   
        this._notification.success("Archivo Eliminado");    
      },
      error: error => {
        this._notification.error("Eliminar Archivo: Se produjo un error")
      }
    });
  }

  private registrarEvidenciaArchivo() {
    let evidenciaArchivo// = new EvidenciaArchivo();
    let e //= new Evidencia();
    e.idEvidencia = this.idEvidencia;
    let a = new Archivo();
    a.idArchivo = this.idArchivo;
    evidenciaArchivo.evidencia = e;
    evidenciaArchivo.archivo = a;
    evidenciaArchivo.estado = true;
    this.services.registrarEvidenciaArchivo(evidenciaArchivo).subscribe((dataItem) => {
      if (dataItem.idEvidenciaArchivo > 0) {
        this.loading = false;
        this.loadTable(dataItem.idEvidenciaArchivo);
      } else {
        this._notification.error(dataItem.msj)
      }
    });
    evidenciaArchivo = null;
    e = null;
    a = null;
  }

  loadTable(idEvidenciaArchivo: number) {
    this.services.listarArchivoPorEstadoActivo(idEvidenciaArchivo).subscribe((dataObj: any) => {
      if (dataObj.idEvidenciaArchivo > 0) {
        this.dataConvert.push(dataObj);
        this.dataSource = new MatTableDataSource(this.dataConvert);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = null;
        // if (dataItem.msj == "LISTA VACIA") {
        this._notification.warning("LISTA VACIA")
        // } else {
        //   this._notification.error(dataItem.msj)
        // }
      }
    });
  }

}

