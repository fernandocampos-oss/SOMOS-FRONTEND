import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserAddDeleteComponent } from './dialogs/user-add-delete/user-add-delete.component'
import { UserTaskComponent } from './dialogs/user-task/user-task.component'
import { GestionRendimientoService } from '../../../../data/services/gestion-rendimiento.service'
import { NotificationService } from '@core/services';
import { UserEditComponent } from './dialogs/user-edit/user-edit.component';
import { UserAddTaskComponent } from './dialogs/user-add-task/user-add-task.component';
import { TaskRejectComponent } from './dialogs/task-reject/task-reject.component';
import { PdfComponent } from './dialogs/pdf/pdf.component';
import { UserDownloadFileComponent } from './dialogs/user-download-file/user-download-file.component';
import { UserDownloadTaskComponent } from './dialogs/user-download-task/user-download-task.component';
import { AssignTaskUserComponent } from './dialogs/assign-task-user/assign-task-user.component';
import { Personal } from '@data/models/gestion-rendimiento/personal';
import { Equipo } from '@data/models/requerimiento/requerimiento.model';
import { EditUserSelectedComponent } from './dialogs/edit-user-selected/edit-user-selected.component';
import { ConstantesGr } from '@data/constants/constantes-gr.constant';

// interface Equipo {
//   item: number;
//   colaborador: string;
//   cargo: string;
// }

@Component({
  selector: 'gestion-rendimiento-mi-equipo',
  templateUrl: './mi-equipo.component.html',
  styleUrls: ['./mi-equipo.component.scss']
})
export class MiEquipoComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  // displayedColumns: string[] = ['item', 'colaborador','cargo', 'tareas','pendientes', 'pendientesAprobacion','acciones'];
  displayedColumns: string[] = ['id', 'nombrePersona', 'cargo', 'acciones'];

  // equipos: Equipo[] = [
  //   { item: 1, colaborador: 'Luis Lopez Gutierrez', cargo: 'Analista de costos' },
  //   { item: 2, colaborador: 'Leandro Zarsosa Manuel', cargo: 'Analista de procesos' },
  //   { item: 3, colaborador: 'Celia Requena Egas', cargo: 'Administrador de BD' },
  //   { item: 4, colaborador: 'Elder Lizana Rodriguez', cargo: 'Tester QA' },
  //   { item: 5, colaborador: 'Maria Lopez Uribe', cargo: 'Analista funcional' },
  // ];
  dataSorteada: Personal[];

  colaboradores: Equipo[] = [];
 // Pruebas para obtener el excel de los datos
  // arrayBuffer:any;
  // file:File;
  // incomingfile(event) 
  //   {
  //   this.file= event.target.files[0]; 
  //   }

  // Upload() {
  //     let fileReader = new FileReader();
  //       fileReader.onload = (e) => {
  //           this.arrayBuffer = fileReader.result;
  //           var data = new Uint8Array(this.arrayBuffer);
  //           console.log(data);
  //           var arr = new Array();
  //           for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //           var bstr = arr.join("");
  //           var workbook = XLSX.read(bstr, {type:"binary"});
  //           console.log(workbook);
  //           var first_sheet_name = workbook.SheetNames[0];
  //           var worksheet = workbook.Sheets[first_sheet_name];
  //           console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
  //           console.log(workbook);
  //           //XLSX.writeFile(workbook, `Formato GDR 2023.xlsx`);
  //       }
  //       fileReader.readAsArrayBuffer(this.file);
        
  // }

  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
    ){ }

  ngOnInit(): void {
    this.loadTable();
    // this.colaboradores = this.services.FauxTablaEquipo();
  }

  showDialogAdd(item) {
    const dialogRef: MatDialogRef<EditUserSelectedComponent> = this.dialog.open(EditUserSelectedComponent, {
      disableClose: false,
      width: '60%',
      autoFocus: false,
      data: {
        obj: item,
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogUser(onDelete: boolean) {
    const dialogRef: MatDialogRef<UserAddDeleteComponent> = this.dialog.open(UserAddDeleteComponent, {
      disableClose: false,
      width: onDelete == true ? '600px' : '70%',
      autoFocus: false,
      data: {
        title: (onDelete == true ? 'Eliminar ' : 'Agregar ') + 'integrante',
        borrar: onDelete
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  showDialogTasks(item) {
    const dialogRef: MatDialogRef<UserTaskComponent> = this.dialog.open(UserTaskComponent, {
      disableClose: false,
      width: '70%',
      autoFocus: false,
      data: {
        obj: item,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  loadTable() {
    let idDependencia = 2;
    this.services.listarPersonalPorDependenciaAsignado(idDependencia, ConstantesGr.ESTADO_PERSONAL_ASIGNADO).subscribe((data: any) => {
      if (data) {      
        this.dataSorteada=data;  
        this.dataSource = new MatTableDataSource(this.dataSorteada);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = null;
        if (this.dataSource = null) {
          this._notification.warning("LISTA VACIA");
        } 
        // if (dataItem.msj == "USTED NO SE ENCUENTRA ASGINADO EN UN EQUIPO DE TRABAJO") {
        //   this._notification.warning(dataItem.msj)
        // } else {
        //   this._notification.error(dataItem.msj)
        // }
      }
    });

  }

  filter(value: string) {
    this.dataSource.filter = value.trim().toUpperCase();
  }

  // Pruebas para obtener el excel de los datos
  downloadGDRPersona(i: number){
  //   //Paso a paso por si acaso

  //   //Información Importante para obtener DATOS
  //   const colaboradorId: number = this.colaboradores[i].id;
  //   const tareasAsignadas: Requerimiento_Integrante[] = this.services.getFauxTablaRequeAsignados(colaboradorId);
  //   var infoRequerimientos: Requerimiento [] = [];
  //   for (let i = 0; i < tareasAsignadas.length; i++) {
  //     infoRequerimientos.push(this.services.getFauxRequerimiento(tareasAsignadas[i].idReq))      
  //   }
  //   console.log(infoRequerimientos);
  //   console.log(tareasAsignadas);
  //   //-----------------------------------------------------------------------
    
  //   //Armado de datos del Excel
  //   var workbook = XLSX.utils.book_new();
  //   var worksheet = XLSX.utils.aoa_to_sheet([]);
  //   XLSX.utils.sheet_add_aoa(worksheet,
  //     [["PRIORIDADES ANUALES DE GESTIÓN DEL ÓRGANO O UNIDAD ORGÁNICA",
  //     'INDICADOR / PRODUCTO',
  //     'VALOR META',
  //     'PESO',
  //     'EVIDENCIA',
  //     'PLAZOS'
  //     ]],
  //     {origin: "B1"})

  //   for (let i = 0; i < tareasAsignadas.length; i++) {
  //     XLSX.utils.sheet_add_aoa(worksheet,
  //       [[infoRequerimientos[i].actividad,
  //       'Número de informes de nuevas funcionalidades implementadas para los sistemas o procesos aseguradores, subsidios y sociales implementados en EsSalud, de acuerdo a las actividades planificadas en el POI',
  //       [3],
  //       '100%',
  //       tareasAsignadas[i].nombreTarea,
  //       tareasAsignadas[i].plazo
  //       ]],
  //       {origin: `B${i+2}`})
  //   }
  //   console.log(worksheet);
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'FORMATO');
  //   XLSX.writeFile(workbook, `Formato GDR 2023 - ${this.colaboradores[i].nombrePersona}.xlsx`);
 }
}
