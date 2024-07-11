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
import { SeguimientoRequestDto } from '@data/models/gestion-rendimiento/reporte-gdr.model';
import { ReporteAdministradorService } from '@data/services/gestion-rendimiento/reporte-administrador.service';

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

  listReporteSeguimiento: any[] = [];
  listReporteMatriz: any[] = [];

  constructor(
    private _fb: FormBuilder,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
    private _sectorizacionService: AsignacionRolSectorizacionService,
    private _serviceReporteAdmin: ReporteAdministradorService,
  ) { }

  ngOnInit(): void {
    this.createForm();
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

  onSelectionChange(event:any){
    let selectedValue = event.value;
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
  }

  async getListRedesAsignadas() {
    let listRed = await this._sectorizacionService.getListRed().then((data) => {
      if (data != null) {
        this.listRed = data.filter((item:any)=>item.codRed == '0100');
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
    this.anioElegido = this.form.get('frmAnioElegido').value;
    if (this.onChangeValueTipoReporte !== '' && this.redItemSeleccionado !== undefined && this.unidadSeleccionadoTmp !== undefined) {
      if (this.onChangeValueTipoReporte === '01') {
        let dto = new SeguimientoRequestDto();
        dto.anio = this.anioElegido;
        dto.codUnidad = this.unidadSeleccionadoTmp.codUnidad;
        if (this.redItemSeleccionado === true) {
          dto.allRed = true;
          dto.listCodRed = [];
        } else {
          let redes: string[] = [];
          redes.push(this.redItemSeleccionado);
          dto.listCodRed = redes;
          dto.allRed = false;
        }

        let listRed = await this._grService.reporteGdrSeguimiento(dto).then((data) => {
          if (data.length > 0) {
            this.listReporteSeguimiento = data.filter((item:any)=>item.codRed == '0100');
            this.dataSource_seguimiento = new MatTableDataSource(this.listReporteSeguimiento);
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
          } else {
            this._notification.warning("No se encontró registros");
          }
        });
      } else if (this.onChangeValueTipoReporte === '03') {
        let dto = new SeguimientoRequestDto();
        dto.anio = this.anioElegido;
        dto.codUnidad = this.unidadSeleccionadoTmp.codUnidad;
        if (this.redItemSeleccionado === true) {
          dto.allRed = true;
          dto.listCodRed = [];
        } else {
          let redes: string[] = [];
          redes.push(this.redItemSeleccionado);
          dto.listCodRed = redes;
          dto.allRed = false;
        }

        let listRed = await this._grService.reporteGdrMatriz(dto).then((data) => {
          if (data.length > 0) {
            this.listReporteMatriz = data.filter((item:any)=>item.codRed == '0100');
            this.dataSource_matriz = new MatTableDataSource(this.listReporteMatriz);
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
          } else {
            this._notification.warning("No se encontró registros");
          }
        });
      }
    } else {
      this._notification.warning("Ingrese todos los campos para continuar");
    }
  }

  async generarReporteSeguimientoAdmin() {
    let titulo = "Cuadro de Seguimiento Carga de Evidencias - GDR Ciclo " + this.today.getFullYear();
    let columnas = [
      'DNI',
      'Apellidos y Nombres',
      'Nombre del órgano o unidad orgánica',
      'Nombre de la unidad orgánica',
      'Nombre de la sub unidad orgánica',
      'Puesto',
      'Rol',
      'Meta',
      'Mes',
      'Plazo',
      'Status',
      'Calificación',
      'Verificación de Evidencia',
      'Fecha de Verificación',
      'Notificación por correo',
      'Fecha Notificación por correo',
      'Comentario',
      'Registro en Formato de GDR',
      'Modificación de Meta y/o Plazo',
    ];

    let excel = await this._serviceReporteAdmin.exportExcelSeguimiento(titulo, columnas, this.listReporteSeguimiento);
  }

  async generarReporteMatrizAdmin() {
    let titulo = "MATRIZ ÚNICA DE LA GESTIÓN DEL RENDIMIENTO - CICLO " + this.today.getFullYear();
    let columnas = [
      'Nº documento',
      'Apellidos y Nombres',
      'Género',
      'Fecha de nacimiento',
      'Regimen laboral',
      'Correo electrónico',
      'Tipo de órgano',
      'Nombre del órgano o unidad orgánica',
      'Nombre de la unidad orgánica',
      'Nombre de la sub unidad orgánica',
      'Puesto',
      'Segmento',
      'Rol',
      'Sindicato',
      'Indicador 1',
      'Indicador 2',
      '¿Llegó a la etapa de evaluación? (Si/No)',
      '¿Recibirá calificación? (Si/No)',
      'Puntuación final ',
      'Calificación',
      'Nivel de la mejora implementada',
    ];

    let excel = await this._serviceReporteAdmin.exportExcelMatriz(titulo, columnas, this.listReporteMatriz);
  }

}
