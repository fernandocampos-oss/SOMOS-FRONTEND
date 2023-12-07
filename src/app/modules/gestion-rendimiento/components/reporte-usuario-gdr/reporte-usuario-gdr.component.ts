import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { NotificationService } from '@core/services';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AsignacionRolSectorizacionService } from '@data/services/asignacion-rol-sectorizacion.service';
import { Observable } from 'rxjs';
import { MatrizRequestDto, SeguimientoRequestDto } from '@data/models/gestion-rendimiento/reporte-gdr.model';

interface Año {
  anio: number;
}

@Component({
  selector: 'app-reporte-usuario-gdr',
  templateUrl: './reporte-usuario-gdr.component.html',
  styleUrls: ['./reporte-usuario-gdr.component.scss']
})
export class ReporteUsuarioGdrComponent implements OnInit {
  form: FormGroup;
  today = new Date();

  listAnio: Año[] = [
    { anio: 2023 },
    { anio: 2024 },
  ];
  anioElegido: any;

  onChangeValueTipoReporte: string = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource_seguimiento: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'numero_documento', 'nombre_completo', 'organo', 'unidad', 'sub_unidad', 'puesto', 'rol', 'meta', 'mes',
    'plazo', 'status', 'calificaicon', 'verificacion_evidencia', 'verificacion_fecha', 'notificacion_correo', 'notificacion_correo_fecha',
    'comentario', 'registro_formato_gdr', 'modificacion_meta_plazo'
  ];

  listTipoReporte: any[] = [
    { cod: '01', descripcion: 'Seguimiento' },
    // { cod: '02', descripcion: 'Reporte' },
    { cod: '03', descripcion: 'Matriz' },
    // { cod: '04', descripcion: 'Reporte Mes de Julio 2023 - Etapa de Seguimiento - Ciclo 2023' }
  ];

  @ViewChild(MatSort) sort_2: MatSort;
  @ViewChild(MatPaginator) paginator_2: MatPaginator;
  dataSource_matriz: MatTableDataSource<any>;
  displayedColumns_2: string[] = ['item', 'numero_documento', 'nombre_completo', 'genero', 'fecha_nacimiento', 'regimen_laboral', 'correo',
    'organo', 'unidad', 'puesto', 'segmento', 'rol', 'indicador'];

  listRed: any[] = [];
  redItemSeleccionado: any;

  listUnidad: any[] = [];
  myControlUnidad = new FormControl();
  filteredOptionsUnidad: Observable<any[]>;
  unidadSeleccionadoTmp: any;

  constructor(
    private _fb: FormBuilder,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
    private _sectorizacionService: AsignacionRolSectorizacionService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    // this.form.controls.frmMesElegido.setValue(this.today.getMonth()+1);
    this.form.controls.frmAnioElegido.setValue(this.today.getFullYear());

    this.getListRedesAsignadas();

    this.getListAllUnidadOrganizativa();
    this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.descripcion),
        map(descripcion => descripcion ? this._filterUnidad(descripcion) : this.listUnidad.slice())
      );

  }

  createForm() {
    this.form = this._fb.group({
      frmAnioElegido: [null],
      frmTipoReporte: [null],
      frmUnidadOrganica: [null],
    });
  }

  onSelectionChangeTipoReporte(event: any) {
    console.log("tipo reporte:", event.value);
    this.onChangeValueTipoReporte = event.value;
  }

  //unidad
  private _filterUnidad(value: string) {
    return this.listUnidad.filter(unidad => unidad.descripcion.toLowerCase().includes(value.toLowerCase()));
  }
  displayFnUnidad(selectedunidad) {
    return selectedunidad ? selectedunidad.descripcion : undefined;
  }
  onSelectionChangeUnidad(event: any) {
    this.unidadSeleccionadoTmp = event.option.value;
    console.log("unidad: ", this.unidadSeleccionadoTmp);
  }

  async getListRedesAsignadas() {
    let listRed = await this._sectorizacionService.getListRed().then((data) => {
      if (data != null) {
        this.listRed = data;
      }
    });
  }

  async getListAllUnidadOrganizativa() {
    let listUnidad = await this._grService.listAllUnidadOrganizativa().then((data) => {
      if (data != null) {
        this.listUnidad = data;
      }
    });
  }

  async generarReporte() {
    if (this.onChangeValueTipoReporte === '01') {
      console.log(this.anioElegido.anio);
      console.log(this.redItemSeleccionado[0]);
      console.log(this.unidadSeleccionadoTmp.codUnidad);

      let dto = new SeguimientoRequestDto();
      dto.anio = this.anioElegido.anio;
      dto.codRed = this.redItemSeleccionado[0];
      dto.codUnidad = this.unidadSeleccionadoTmp.codUnidad;

      let listRed = await this._grService.reporteGdrSeguimiento(dto).then((data) => {
        if (data != null) {
          console.log("result seguimiento: ", data)
          this.dataSource_seguimiento = new MatTableDataSource(data);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        }
      });
    } else if (this.onChangeValueTipoReporte === '03') {
      console.log(this.anioElegido.anio);
      console.log(this.redItemSeleccionado[0]);
      console.log(this.unidadSeleccionadoTmp.codUnidad);

      let dto = new MatrizRequestDto();
      dto.anio = this.anioElegido.anio;
      dto.codRed = this.redItemSeleccionado[0];
      dto.codUnidad = this.unidadSeleccionadoTmp.codUnidad;

      let listRed = await this._grService.reporteGdrMatriz(dto).then((data) => {
        if (data != null) {
          console.log("result matriz: ", data)
          this.dataSource_matriz = new MatTableDataSource(data);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        }
      });
    }

  }

  async procesarExcel(element) {

  }

}
