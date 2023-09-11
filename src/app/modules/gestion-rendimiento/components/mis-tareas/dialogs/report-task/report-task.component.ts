import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services';
import { MatTableDataSource } from '@angular/material/table';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ArchivoNew } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';

@Component({
  selector: 'app-report-task',
  templateUrl: './report-task.component.html',
  styleUrls: ['./report-task.component.scss']
})
export class ReportTaskComponent implements OnInit {

  form: FormGroup;
 
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
    console.log(this.data);
    // this.objInforme = this.data.obj;
    this.createForm();
  }

  createForm() {
    this.form = this._fb.group({
      frmTarea: [this.data.model.descripcion],
      frmEstado: [this.data.model.estado],
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
      
      // this.services.registrarEvidencia(e).then((dataItem) => {
      //   if (dataItem) {
      //     this.uploadFile(event);
      //     this._notification.success("Evidencia registrada correctamente");
      //   } else {
      //     this._notification.error("Error al registrar evidenvia")
      //   }
      // });
    }
  }

  uploadFile(event) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    this.loading = true;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let archivo = new ArchivoNew();
      let completo = file.name;
      const nombreFile = completo.lastIndexOf('.');
      archivo.nombre = completo.substring(0, nombreFile);
      archivo.extension = completo.substring(nombreFile + 1);
      
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
    // this.services.eliminarArchivo(false, item.idEvidenciaArchivo).subscribe({
    //   next: data => {        
    //     // this.loadTable(item.idEvidenciaArchivo); 
    //     this.dataConvert= [];
    //     this.dataSource = new MatTableDataSource(this.dataConvert);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;   
    //     this._notification.success("Archivo Eliminado");    
    //   },
    //   error: error => {
    //     this._notification.error("Eliminar Archivo: Se produjo un error")
    //   }
    // });
  }

  private registrarEvidenciaArchivo() {
    
  }

  loadTable(idEvidenciaArchivo: number) {
    
  }

}

