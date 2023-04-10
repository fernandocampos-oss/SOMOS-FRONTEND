import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ComponentType } from 'ngx-toastr';
import { filter, switchMap, tap } from 'rxjs/operators';
import { ColumnDef, ColumnType } from '@shared/table/table.component';
import { Param, Usuario } from '@data/models';
import { DatosPersonalesUpdateComponent } from '../dialogs/datos-personales-update/datos-personales-update.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SedeService, UbigeoService, ZonaService } from '@data/services';
import { forkJoin } from 'rxjs';
import { FormControlUtil } from '@core/utils';
import { HijosRegisterUpdateComponent } from '../dialogs/hijos-register-update copy/hijos-register-update.component';
import { AppConfig } from '@core/configs';
import { EducacionRegisterUpdateComponent } from '../dialogs/educacion-register-update/educacion-register-update.component';
import { IdiomaRegisterUpdateComponent } from '../dialogs/idioma-register-update/idioma-register-update.component';
import { ExperienciaRegisterUpdateComponent } from '../dialogs/experiencia-register-update/experiencia-register-update.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSession } from '../../../../data/models/auth/user-session.model';
import { AuthService } from '../../../../data/services/auth.service';
import { UsuarioService } from '../../../../data/services/usuario.service';

@UntilDestroy()
@Component({
  selector: 'app-ficha-unica-empleado',
  templateUrl: './ficha-unica-empleado.component.html',
  styleUrls: ['./ficha-unica-empleado.component.scss'],
})
export class FichaUnicaEmpleadoComponent implements OnInit {

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];

  startDate = new Date(new Date().getFullYear() - 30, 0, 1);
  maxFechaNacimiento = AppConfig.MAX_FECHA_NACIMIENTO;
  form_dp: FormGroup;
  form_df: FormGroup;
  form_otros: FormGroup;
  estadoCivilSelect!: string;
  estadoCivilDisb!: boolean;
  padreSelect!: string;
  padreDisb!: boolean;
  madreSelect!: string;
  madreDisb!: boolean;
  hijosSelect!: string;
  hijosDisb!: boolean;
  pensionSelect!: string;
  pensionDisb!: boolean;
  enfermedadSelect!: string;
  enfermedadDisb!: boolean;
  departmentCtrl = new FormControl(null);
  provinceCtrl = new FormControl(null);
  departmentCtrlAct = new FormControl(null);
  provinceCtrlAct = new FormControl(null);
  user: UserSession;

  departments: Param[] = [];
  provinces: Param[] = [];
  districts: Param[] = [];

  departmentsAct: Param[] = [];
  provincesAct: Param[] = [];
  districtsAct: Param[] = [];
  
  constructor(
    private _matDialog      : MatDialog,
    private _fb             : FormBuilder,
    private _sedeService    : SedeService,
    private _ubigeoService  : UbigeoService,
    private _router         : Router,
    private route           : ActivatedRoute,
    private _authService    : AuthService,
    private _userService    : UsuarioService,
  ) {}

  ngOnInit(): void {
    this._createForm_dp();

    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe( data =>{
      this.form_dp.controls.dni.setValue(data.numeroDocumento);
      this.form_dp.controls.nombres.setValue(data.nombres);
      this.form_dp.controls.apellidos.setValue(data.apellidos);
    });

    this._createForm_df();
    this._createForm_otros();
    this._loadParams();
    this._setupUbigeoControls();
    this._setupUbigeoControlsAct();

    
  }

  usuarioList: Usuario[] = [];
  hijosColumns: ColumnDef[] = [
    {
      label: 'Nombres',
      name: 'nombres',
    },
    {
      label: 'Ape. Paterno',
      name: 'apepaterno',
    },
    {
      label: 'Ape. Materno',
      name: 'apematerno',
    },
    {
      label: 'Fecha Nacimiento',
      name: 'fechaNacimiento',
      type: ColumnType.DATE,
    },
    {
      label: 'Grado Isntruc.',
      name: 'grado',
    },
    {
      label: 'Sexo',
      name: 'sexo',
    },
    {
      label: 'Discapacidad',
      name: 'discapacidad',
    },
  ];

  educacionColumns: ColumnDef[] = [
    {
      label: 'Título/Carrera',
      name: 'titulo',
    },
    {
      label: 'Tipo de Estudio',
      name: 'tipo_estudio',
    },
    {
      label: 'Institución',
      name: 'institución',
    },
    {
      label: 'Estado',
      name: 'estado',
    },
    {
      label: 'Fecha Inicio',
      name: 'fechaInicio',
      type: ColumnType.DATE,
    },
    {
      label: 'Fecha Finalización',
      name: 'fechafin',
      type: ColumnType.DATE,
    },
  ];

  idiomaColumns: ColumnDef[] = [
    {
      label: 'Idioma',
      name: 'idioma',
    },
    {
      label: 'Nivel Escrito',
      name: 'nivelEscrito',
    },
    {
      label: 'Nivel Oral',
      name: 'nivelOral',
    },
  ];

  experienciaColumns: ColumnDef[] = [
    {
      label: 'Empresa',
      name: 'empresa',
    },
    {
      label: 'Puesto',
      name: 'puesto',
    },
    {
      label: 'Nivel de Experiencia',
      name: 'nivelExp',
    },
    {
      label: 'Fecha Inicio',
      name: 'fechaInicio',
      type: ColumnType.DATE,
    },
    {
      label: 'Fecha Finalización',
      name: 'fechafin',
      type: ColumnType.DATE,
    },
    {
      label: 'Descripción',
      name: 'descripcion',
    },
    {
      label: 'Nro Persona a cargo',
      name: 'personasCargo',
    },
  ];

  get idUbigeoField() {
    return this.form_dp.get('idUbigeo');
  }

  get idUbigeoActField() {
    return this.form_dp.get('idUbigeoAct');
  }
  
  private _getProvinces$(codDepartment: string) {
    return this._ubigeoService.getProvincias(codDepartment);
  }

  private _getDistricts$(codDepartment: string, codProvince: string) {
    return this._ubigeoService.getDistritos(codDepartment, codProvince);
  }

  private _setupUbigeoControls() {
    const departmentChanges$ = this.departmentCtrl.valueChanges.pipe(
      tap(() => {
        this.provinces = [];
        this.districts = [];
        FormControlUtil.resetWithoutEvent(this.provinceCtrl);
        FormControlUtil.resetWithoutEvent(this.idUbigeoField);
      })
    );

    const provincesByDepartment$ = departmentChanges$.pipe(
      switchMap((value) => this._getProvinces$(value))
    );

    provincesByDepartment$
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.provinces = data));

    const provinceChanges$ = this.provinceCtrl.valueChanges.pipe(
      tap(() => {
        this.districts = [];
        FormControlUtil.resetWithoutEvent(this.idUbigeoField);
      })
    );
    const districtsByProvince$ = provinceChanges$.pipe(
      switchMap((codProvince) => {
        const codDepartment = this.departmentCtrl.value;
        return this._getDistricts$(codDepartment, codProvince);
      })
    );

    districtsByProvince$
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.districts = data));
  }

  private _setupUbigeoControlsAct() {
    const departmentChangesAct$ = this.departmentCtrlAct.valueChanges.pipe(
      tap(() => {
        this.provincesAct = [];
        this.districtsAct = [];
        FormControlUtil.resetWithoutEvent(this.provinceCtrlAct);
        FormControlUtil.resetWithoutEvent(this.idUbigeoActField);
      })
    );

    const provincesByDepartmentAct$ = departmentChangesAct$.pipe(
      switchMap((value) => this._getProvinces$(value))
    );

    provincesByDepartmentAct$
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.provincesAct = data));

    const provinceChangesAct$ = this.provinceCtrlAct.valueChanges.pipe(
      tap(() => {
        this.districtsAct = [];
        FormControlUtil.resetWithoutEvent(this.idUbigeoActField);
      })
    );
    const districtsByProvinceAct$ = provinceChangesAct$.pipe(
      switchMap((codProvinceAct) => {
        const codDepartmentAct = this.departmentCtrlAct.value;
        return this._getDistricts$(codDepartmentAct, codProvinceAct);
      })
    );

    districtsByProvinceAct$
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.districtsAct = data));
  }

  private _loadParams() {
    const departments$ = this._ubigeoService.getDepartamentos();
    const sedes$ = this._sedeService.search();
    forkJoin([departments$, sedes$])
      .pipe(untilDestroyed(this))
      .subscribe(([departments, sedes]) => {
        this.departments = departments;
        this.departmentsAct = departments;
      });
  }

  private _createForm_dp() {
    this.form_dp = this._fb.group({
      dni                 : [''],
      ruc                 : [''],
      nombres             : [''],
      apellidos           : [''],
      sexo                : [''],
      fechaNacimiento     : [''],
      email               : [''],
      celular             : [''],
      telefono_fijo       : [''],
      direccion_dni       : [''],
      idUbigeo            : [''],
      direccion_actual    : [''],
      idUbigeoAct         : [''],
      tipo_direccion      : [''],
      condicion_direccion : [''],
    });
  }

  private _createForm_df() {
    this.form_df = this._fb.group({
      dependientes: [null],
      estado_civil: [null],
      dni_pareja: [null],
      nombres_pareja: [null],
      paterno_pareja: [null],
      materno_pareja: [null],
      padre_vive: [null],
      dni_padre: [null],
      nombres_padre: [null],
      paterno_padre: [null],
      materno_padre: [null],
      madre_vive: [null],
      dni_madre: [null],
      nombres_madre: [null],
      paterno_madre: [null],
      materno_madre: [null],
      tiene_hijos: [null],
    });
  }

  private _createForm_otros() {
    this.form_otros = this._fb.group({
      discapacidad: [null],
      enfermedad: [null],
      enfermedad_detalle: [null],
      pension: [null],
      pension_concepto: [null],
      talla_camisa: [null],
      talla_pantalon: [null],
      talla_vestido: [null],
      talla_calzado: [null],
    });
  }

  selectedEstadoCivil(e: any): void {
    this.estadoCivilSelect = e.value;
    if (this.estadoCivilSelect === "2" || this.estadoCivilSelect === "3") {
      this.estadoCivilDisb = true;
      this.form_df.controls['dni_pareja'].setValue("");
      this.form_df.controls['nombres_pareja'].setValue("");
      this.form_df.controls['paterno_pareja'].setValue("");
      this.form_df.controls['materno_pareja'].setValue("");
    }else{ this.estadoCivilDisb = false; }
  }

  selectedPadre(e: any): void {
    this.padreSelect = e.value;
    if (this.padreSelect === "1") {
      this.padreDisb = true;
      this.form_df.controls['dni_padre'].setValue("");
      this.form_df.controls['nombres_padre'].setValue("");
      this.form_df.controls['paterno_padre'].setValue("");
      this.form_df.controls['materno_padre'].setValue("");
    }else{ this.padreDisb = false; }
  }

  selectedMadre(e: any): void {
    this.madreSelect = e.value;
    if (this.madreSelect === "1") {
      this.madreDisb = true;
      this.form_df.controls['dni_madre'].setValue("");
      this.form_df.controls['nombres_madre'].setValue("");
      this.form_df.controls['paterno_madre'].setValue("");
      this.form_df.controls['materno_madre'].setValue("");
    }else{ this.madreDisb = false; }
  }

  selectedHijos(e: any): void {
    this.hijosSelect = e.value;
    if (this.hijosSelect === "1") {
      this.hijosDisb = true;
    }else{ this.hijosDisb = false; }
  }

  selectedPension(e: any): void {
    this.pensionSelect = e.value;
    if (this.pensionSelect === "1") {
      this.pensionDisb = true;
    }else{ this.pensionDisb = false; }
  }

  selectedEnfermedad(e: any): void {
    this.enfermedadSelect = e.value;
    if (this.enfermedadSelect === "1") {
      this.enfermedadDisb = true;
    }else{ this.enfermedadDisb = false; }
  }

  onCreateHijo() {
    this._openAddUpdateDialog(
      HijosRegisterUpdateComponent,
      null,
      null
    );
  }

  onCreateEducacion() {
    this._openAddUpdateDialog(
      EducacionRegisterUpdateComponent,
      null,
      null
    );
  }

  onCreateIdioma() {
    this._openAddUpdateDialog(
      IdiomaRegisterUpdateComponent,
      null,
      null
    );
  }

  onCreateExperiencia() {
    this._openAddUpdateDialog(
      ExperienciaRegisterUpdateComponent,
      null,
      null
    );
  }
  
  private _openAddUpdateDialog<T>(
    dialog: ComponentType<T>,
    data: any,
    callback: () => void
  ) {
    this._matDialog
      .open(dialog, { data, disableClose: true })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((isSuccess) => isSuccess)
      )
      .subscribe(() => callback.call(this));
  }

  onUpdatePersonalData() {
    this._openAddUpdateDialog(DatosPersonalesUpdateComponent, null, null);
  }
  
  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
}
