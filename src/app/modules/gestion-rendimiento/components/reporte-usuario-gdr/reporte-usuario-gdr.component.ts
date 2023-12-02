import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { NotificationService } from '@core/services';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

  anioElegido: number;
  listData: any[] = [];
  evidenciaResponseDto: any;

  anios: Año[] = [
    { anio: 2023 },
    { anio: 2024 },
  ];

  onChangeValueTipoReporte: string = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'numero_documento', 'en_matriz', 'sectorista', 'nombre_completo', 'organo', 'unidad', 'sub_unidad', 'puesto', 'rol', 'meta', 'mes', 'plazo'];

  listTipoReporte: any[] = [
    { cod: '01', descripcion: 'Cuadro de Seguimiento Carga de Evidencias - GDR' },
    { cod: '02', descripcion: 'Reporte' },
    { cod: '03', descripcion: 'Matriz única de la gestión del rendimiento' },
    { cod: '04', descripcion: 'Reporte Mes de Julio 2023 - Etapa de Seguimiento - Ciclo 2023' }
  ];

  dataSource_seguimientoEvidencia: any[] = [
    {
      dni: "07570389",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "FIGUEROA QUINTANA JULIO CESAR",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Administración de Personal",
      subUnidad: "Sub Gerencia de Compensaciones",
      puesto: "ANALISTA PROGRAMADOR",
      rol: "Evaluado\/a",
      meta: "Meta 1",
      mes: "Agosto",
      plazo: "08\/31\/2023"
    },
    {
      dni: "07570389",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "FIGUEROA QUINTANA JULIO CESAR",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Administración de Personal",
      subUnidad: "Sub Gerencia de Compensaciones",
      puesto: "ANALISTA PROGRAMADOR",
      rol: "Evaluado\/a",
      meta: "Meta 1",
      mes: "Noviembre",
      plazo: "11\/30\/2023"
    },
    {
      dni: "07570389",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "FIGUEROA QUINTANA JULIO CESAR",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Administración de Personal",
      subUnidad: "Sub Gerencia de Compensaciones",
      puesto: "ANALISTA PROGRAMADOR",
      rol: "Evaluado\/a",
      meta: "Meta 2",
      mes: "Agosto",
      plazo: "08\/31\/2023"
    },
    {
      dni: "07570389",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "FIGUEROA QUINTANA JULIO CESAR",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Administración de Personal",
      subUnidad: "Sub Gerencia de Compensaciones",
      puesto: "ANALISTA PROGRAMADOR",
      rol: "Evaluado\/a",
      meta: "Meta 2",
      mes: "Noviembre",
      plazo: "11\/30\/2023"
    },
    {
      dni: "10043625",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "DAVILA LLANOS REBECA BEATRIZ",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Desarrollo de Personal",
      subUnidad: "SGRHyS - IEI Modelo",
      puesto: "TECNICO SERV. ADM. Y APOYO",
      rol: "Evaluado\/a",
      meta: "Meta 1",
      mes: "Setiembre",
      plazo: "09\/30\/2023"
    },
    {
      dni: "10043625",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "DAVILA LLANOS REBECA BEATRIZ",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Desarrollo de Personal",
      subUnidad: "SGRHyS - IEI Modelo",
      puesto: "TECNICO SERV. ADM. Y APOYO",
      rol: "Evaluado\/a",
      meta: "Meta 1",
      mes: "Noviembre",
      plazo: "11\/30\/2023"
    },
    {
      dni: "10043625",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "DAVILA LLANOS REBECA BEATRIZ",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Desarrollo de Personal",
      subUnidad: "SGRHyS - IEI Modelo",
      puesto: "TECNICO SERV. ADM. Y APOYO",
      rol: "Evaluado\/a",
      meta: "Meta 2",
      mes: "Setiembre",
      plazo: "09\/30\/2023"
    },
    {
      dni: "10043625",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "DAVILA LLANOS REBECA BEATRIZ",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Desarrollo de Personal",
      subUnidad: "SGRHyS - IEI Modelo",
      puesto: "TECNICO SERV. ADM. Y APOYO",
      rol: "Evaluado\/a",
      meta: "Meta 2",
      mes: "Noviembre",
      plazo: "11\/30\/2023"
    },
    {
      dni: "10043625",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "DAVILA LLANOS REBECA BEATRIZ",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Desarrollo de Personal",
      subUnidad: "SGRHyS - IEI Modelo",
      puesto: "TECNICO SERV. ADM. Y APOYO",
      rol: "Evaluado\/a",
      meta: "Meta 3",
      mes: "Setiembre",
      plazo: "09\/30\/2023"
    },
    {
      dni: "10043625",
      enMatriz: "#N\/A",
      sectorista: "Luis",
      nombreCompleto: "DAVILA LLANOS REBECA BEATRIZ",
      organo: "Gerencia Central de Gestión de las Personas",
      unidad: "Gerencia de Desarrollo de Personal",
      subUnidad: "SGRHyS - IEI Modelo",
      puesto: "TECNICO SERV. ADM. Y APOYO",
      rol: "Evaluado\/a",
      meta: "Meta 3",
      mes: "Noviembre",
      plazo: "11\/30\/2023"
    }
  ]

  @ViewChild(MatSort) sort_2: MatSort;
  @ViewChild(MatPaginator) paginator_2: MatPaginator;
  dataSource_2: MatTableDataSource<any>;
  displayedColumns_2: string[] = ['item', 'numero_documento', 'nombre_completo', 'organo', 'unidad', 'sub_unidad', 'puesto', 'rol', 'meta', 'mes', 'plazo', 'status'];

  dataSource_ReporteMes: any[] = [
    {
     dni: "41989551",
     sectorista: "Nathaly",
     nombreCompleto: "ÑIQUE OLAYA,LUIS OLIVER",
     organo: "Gerencia Central de Planeamiento y Presupuesto",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "JEFE DE DIVISION",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Junio",
     plazo: "06\/30\/2023",
     status: "No Cumplió"
    },
    {
     dni: "41989551",
     sectorista: "Nathaly",
     nombreCompleto: "ÑIQUE OLAYA,LUIS OLIVER",
     organo: "Gerencia Central de Planeamiento y Presupuesto",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "JEFE DE DIVISION",
     rol: "Evaluado\/a",
     meta: "Meta 2",
     mes: "Junio",
     plazo: "06\/30\/2023",
     status: "No Cumplió"
    },
    {
     dni: "09994320",
     sectorista: "Nathaly",
     nombreCompleto: "NAVARRO PALACIOS MOISES ALBERTO",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "ASESOR II",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Junio",
     plazo: "06\/30\/2023",
     status: "Cumplio"
    },
    {
     dni: "07339783",
     sectorista: "Nathaly",
     nombreCompleto: "PIZARRO CHAVEZ,ENRIQUE EMPERADOR",
     organo: "Gerencia Central de Proyectos de Inversión",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "BACHILLER PROFESIONAL",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Junio",
     plazo: "06\/30\/2023",
     status: "No Cumplió"
    },
    {
     dni: "41927360",
     sectorista: "Nathaly",
     nombreCompleto: "RUBIRA ACOSTA,EDUARDO",
     organo: "Gerencia Central de Proyectos de Inversión",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "GERENTE CENTRAL",
     rol: "Evaluador\/a y evaluado\/a",
     meta: "Meta 3",
     mes: "Julio",
     plazo: "07\/15\/2023",
     status: "No Cumplió"
    },
    {
     dni: "10762323",
     sectorista: "Luis",
     nombreCompleto: "CERNA QUINONES,ANA MARIA",
     organo: "Gerencia Central de Promoción y Gestión de Contratos de Inversiones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "AUXILIAR ADMINISTRATIVO",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/14\/2023",
     status: "No Cumplió"
    },
    {
     dni: "09339280",
     sectorista: "Luis",
     nombreCompleto: "BLONDET MOLINA,ERIKA",
     organo: "Gerencia Central de Promoción y Gestión de Contratos de Inversiones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "ASISTENTE DE GERENCIA",
     rol: "Evaluado\/a",
     meta: "Meta 2",
     mes: "Julio",
     plazo: "07\/14\/2023",
     status: "No Cumplió"
    },
    {
     dni: "09339280",
     sectorista: "Luis",
     nombreCompleto: "BLONDET MOLINA,ERIKA",
     organo: "Gerencia Central de Promoción y Gestión de Contratos de Inversiones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "ASISTENTE DE GERENCIA",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/14\/2023",
     status: "No Cumplió"
    },
    {
     dni: "41899392",
     sectorista: "Luis",
     nombreCompleto: "PALACIOS DOMINGUEZ,PATRICIA DONNA",
     organo: "Gerencia Central de Promoción y Gestión de Contratos de Inversiones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "TECNICO SERV. ADM. Y APOYO",
     rol: "Evaluado\/a",
     meta: "Meta 2",
     mes: "Julio",
     plazo: "07\/14\/2023",
     status: "No Cumplió"
    },
    {
     dni: "25491707",
     sectorista: "Luis",
     nombreCompleto: "SEGURA SENADOR,SILVIA",
     organo: "Gerencia Central de Tecnologías de Información y Comunicaciones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "TECNICO SERV. ADM. Y APOYO",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/14\/2023",
     status: "Cumplio"
    },
    {
     dni: "10433882",
     sectorista: "Luis",
     nombreCompleto: "LOPEZ SANTANDER,JORGE GUILLERMO",
     organo: "Gerencia Central de Tecnologías de Información y Comunicaciones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "BACH. PROFES.CALIFICADO",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/14\/2023",
     status: "Cumplio"
    },
    {
     dni: "09092683",
     sectorista: "Luis",
     nombreCompleto: "BELLEZA CARRASCO,NORMA CONSUELO",
     organo: "Gerencia Central de Tecnologías de Información y Comunicaciones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "TECNICO DE PROC. AUT. DATOS",
     rol: "Evaluado\/a",
     meta: "Meta 2",
     mes: "Julio",
     plazo: "07\/07\/2023",
     status: "Cumplio"
    },
    {
     dni: "09092683",
     sectorista: "Luis",
     nombreCompleto: "BELLEZA CARRASCO,NORMA CONSUELO",
     organo: "Gerencia Central de Tecnologías de Información y Comunicaciones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "TECNICO DE PROC. AUT. DATOS",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/07\/2023",
     status: "Cumplio"
    },
    {
     dni: "07947650",
     sectorista: "Luis",
     nombreCompleto: "PARRA DIEGUEZ,BEATRIZ RITA",
     organo: "Gerencia Central de Tecnologías de Información y Comunicaciones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "SECRETARIA",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/07\/2023",
     status: "No Cumplió"
    },
    {
     dni: "06065975",
     sectorista: "Luis",
     nombreCompleto: "QUISPE HERRERA,SATURNINO ANTONIO",
     organo: "Gerencia Central de Tecnologías de Información y Comunicaciones",
     unidad: "Despacho",
     subUnidad: "-",
     puesto: "PROFESIONAL",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/14\/2023",
     status: "No Cumplió"
    },
    {
     dni: "06993757",
     sectorista: "Nathaly",
     nombreCompleto: "CARRIZALES NAVARRO,LUIS ANGEL",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "PROFESIONAL",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    },
    {
     dni: "41153998",
     sectorista: "Nathaly",
     nombreCompleto: "RAMIREZ ROSALES HECTOR RODOLFO",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "TECNICO DE PROC. AUT. DATOS",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    },
    {
     dni: "10139924",
     sectorista: "Nathaly",
     nombreCompleto: "GUTIERREZ PLASENCIA CESAR ALBERTO",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "TECNICO SERV. ADM. Y APOYO",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    },
    {
     dni: "32818003",
     sectorista: "Nathaly",
     nombreCompleto: "SILVA VARGAS GLADYS ESTHER",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "ASISTENTE ADMINISTRATIVO",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    },
    {
     dni: "7845873",
     sectorista: "Nathaly",
     nombreCompleto: "CABALLERO LLANOS ELIZABETH DELIA",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "ASISTENTE ADMINISTRATIVO",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    },
    {
     dni: "08118218",
     sectorista: "Nathaly",
     nombreCompleto: "ARRUNATEGUI TORRES ANGELA",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "ASISTENTE DE GERENCIA",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    },
    {
     dni: "72739865",
     sectorista: "Nathaly",
     nombreCompleto: "MATOS ROJAS MARLON VICTOR",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "BACHILLER PROFESIONAL",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    },
    {
     dni: "09539838",
     sectorista: "Nathaly",
     nombreCompleto: "PATILLA CHINCHAY IVONNE MARLENE",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "BACHILLER PROFESIONAL",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    },
    {
     dni: "41148858",
     sectorista: "Nathaly",
     nombreCompleto: "NUÑEZ GUERE ROSALYNN MAYBEE",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "PROFESIONAL",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    },
    {
     dni: "7872664",
     sectorista: "Nathaly",
     nombreCompleto: "ESCATE FLORES NATALIA ELVIRA",
     organo: "Gerencia Central de Seguros y Prestaciones Económicas",
     unidad: "Oficina de Apoyo y Seguimiento",
     subUnidad: "-",
     puesto: "PROFESIONAL",
     rol: "Evaluado\/a",
     meta: "Meta 1",
     mes: "Julio",
     plazo: "07\/05\/2023",
     status: "Cumplio"
    }
   ]
   

  constructor(
    private _fb: FormBuilder,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    // this.form.controls.frmMesElegido.setValue(this.today.getMonth()+1);
    this.form.controls.frmAnioElegido.setValue(this.today.getFullYear());
  }

  createForm() {
    this.form = this._fb.group({
      frmAnioElegido: [null],
      frmTipoReporte: [null],
    });
  }

  onSelectionChangeTipoReporte(event: any) {
    console.log("look", event.value);
    this.onChangeValueTipoReporte = event.value;
  }

  async generarReporte() {
    // let result = await this._grService.reporteGeneralRequerimientos(this.form.value.frmAnioElegido).then((data) => {
    //   if (data.length > 0) {
    //     this.listData = data;
    //     for (let i of this.listData) {
    //       this.procesarExcel(i);
    //     }
    //   } else {
    //     this._notification.warning("No se encontró requerimientos finalizados para el año " + this.form.value.frmAnioElegido);
    //   }
    // });
  }

  async procesarExcel(element) {

  }

}
