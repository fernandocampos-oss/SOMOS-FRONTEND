import { startWith, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserAddDeleteComponent } from './dialogs/user-add-delete/user-add-delete.component'
import { UserTaskComponent } from './dialogs/user-task/user-task.component'
import { GestionRendimientoService } from '../../../../data/services/gestion-rendimiento.service'
import { NotificationService } from '@core/services';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'gestion-rendimiento-mi-equipo',
  templateUrl: './mi-equipo.component.html',
  styleUrls: ['./mi-equipo.component.scss']
})
export class MiEquipoComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['item', 'numero_documento', 'nombre_persona', 'acciones'];

  colaboradores: any[] = []; //Equipo[] = [];

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

  integranteControl = new FormControl('');
  listPersonal = [];
  filteredOptions: Observable<any[]>;
  personalSeleccionadoTmp: any;

  constructor(
    private dialog: MatDialog,
    private services: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
    this.listarPersonalGeneral();

    //filter
    this.filteredOptions = this.integranteControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : (value.nombres + ' ' + value.apellidos)),
        map(nombresCompletos => nombresCompletos ? this._filterPersonal(nombresCompletos) : this.listPersonal.slice())
      );
  }

  async listarPersonalGeneral() {
    let load = await this.services.listarPersonalGeneral().then((data: any) => {
      if (data) {
        this.listPersonal = data;
      } else {
        this._notification.warning("Lista de personal vacia");
      }
    });
  }

  private _filterPersonal(value: string) {
    return this.listPersonal.filter(persona => (persona.nombres + ' ' + persona.apellidos).toLowerCase().includes(value.toLowerCase()));
  }
  displayFnPersonal(selectedpersona) {
    return selectedpersona ? (selectedpersona.nombres + ' ' + selectedpersona.apellidos) : undefined;
  }
  onSelectionChangePersonal(event: any) {
    this.personalSeleccionadoTmp = event.option.value;
  }

  // showDialogAdd(item) {
  //   const dialogRef: MatDialogRef<EditUserSelectedComponent> = this.dialog.open(EditUserSelectedComponent, {
  //     disableClose: false,
  //     width: '60%',
  //     autoFocus: false,
  //     data: {
  //       obj: item,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadTable();
  //   });
  // }

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

  verRequerimientos(element) {
    const dialogRef: MatDialogRef<UserTaskComponent> = this.dialog.open(UserTaskComponent, {
      disableClose: false,
      width: '70%',
      autoFocus: false,
      data: {
        model: element,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  async loadTable() {
    let listPersonal = await this.services.listarPersonalUnidad().then((data) => {
      if (data) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this._notification.warning("Lista de integrantes vacia");
      }
    });
  }

  async agregarColaborador() {
    if (this.personalSeleccionadoTmp != undefined) {
      let add = await this.services.agregarIntegrante(this.personalSeleccionadoTmp.idUsuario).then((data: any) => {
        if (data = 1) {
          this._notification.success("Integrante agregado correctamente");
          this.integranteControl.reset('');
          this.personalSeleccionadoTmp = null;
          this.loadTable();
        } else {
          this._notification.warning("Agregar integrante: Se produjo un error");
        }
      });
    } else {
      this._notification.warning('Ingrese nombre o apellido del integrante');
    }
  }

  eliminarColaborador(element) {
    const dialogRef: MatDialogRef<DeleteDialogComponent> = this.dialog.open(DeleteDialogComponent, {
      disableClose: false,
      width: '30%',
      autoFocus: false,
      data: {
        // funcion: 3,
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });
  }

  filter(value: string) {
    this.dataSource.filter = value.trim().toUpperCase();
  }

  // Pruebas para obtener el excel de los datos
  downloadGDRPersona(i: number) {
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
