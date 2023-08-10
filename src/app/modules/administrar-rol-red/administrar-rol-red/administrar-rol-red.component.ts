import { startWith, map, filter } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { DialogService, NotificationService } from '@core/services';
import { Observable, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { EventEmitter } from '@angular/core';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmarDialogoComponent } from './confirmar-dialogo/confirmar-dialogo.component';
import { EditarRedComponent } from '../components/editar-red/editar-red.component';

///♫
// export class ItemList {
//   constructor(public item: string, public selected?: boolean) {
//     if (selected === undefined) selected = false;
//   }
// }

@Component({
  selector: 'app-administrar-rol-red',
  templateUrl: './administrar-rol-red.component.html',
  styleUrls: ['./administrar-rol-red.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: AdministrarRolRedComponent }]
})
export class AdministrarRolRedComponent implements OnInit {
  showFilter = true;
  fechaActual: any;

  //swtich
  color = 'accent';
  checked = false;

  isChecked = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['personal', 'red', 'fechaAsignacion'];

  asignados = [
    { personal: "ELENA YVONNE DEL CASTILLO GABRIEL", red: "SEDE CENTRAL LIMA-Fondo Salud" },
    { personal: "LAURA AMPARO MERCADO YUPANQUI", red: "RED PRESTACIONAL SABOGAL" }
  ];

  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  options = [
    { cod: ' ', descripcion: '-- TODOS --' },
    { cod: '0221', descripcion: 'RED ASISTENCIAL HUÁNUCO' },
    { cod: '0213', descripcion: 'RED ASISTENCIAL ICA' },
    { cod: '0225', descripcion: 'RED ASISTENCIAL HUANCAVELICA' },
    { cod: '0206', descripcion: 'RED PRESTACIONAL REBAGLIATI' },
    { cod: '0204', descripcion: 'RED PRESTACIONAL ALMENARA' },
    { cod: '0100', descripcion: 'SEDE CENTRAL LIMA-AFESSALUD' },
    { cod: '0222', descripcion: 'RED ASISTENCIAL PASCO' },
    { cod: '0231', descripcion: 'RED ASISTENCIAL UCAYALI' },
    { cod: '0200', descripcion: 'SEDE CENTRAL LIMA-Fondo Salud' },
    { cod: '0208', descripcion: 'RED PRESTACIONAL SABOGAL' },
    { cod: '0216', descripcion: 'RED ASISTENCIAL PIURA' },
    { cod: '0226', descripcion: 'RED ASISTENCIAL PUNO' },
    { cod: '0236', descripcion: 'RED PRESTACIONAL LAMBAYEQUE' },
    { cod: '0233', descripcion: 'RED ASISTENCIAL AMAZONAS' },
    { cod: '0201', descripcion: 'CENTRO NACIONAL DE SALUD RENAL' },
    { cod: '0202', descripcion: 'INST. NACIONAL CARDIOVASCULAR' },
    { cod: '0212', descripcion: 'RED ASISTENCIAL JUNIN' },
    { cod: '0219', descripcion: 'RED ASISTENCIAL AREQUIPA' },
    { cod: '0215', descripcion: 'RED ASISTENCIAL CUSCO' },
    { cod: '0211', descripcion: 'RED ASISTENCIAL MADRE DE DIOS' },
    { cod: '0229', descripcion: 'RED ASISTENCIAL LORETO' },
    { cod: '0232', descripcion: 'RED ASISTENCIAL LA LIBERTAD' },
    { cod: '0214', descripcion: 'RED ASISTENCIAL APURIMAC' },
    { cod: '0220', descripcion: 'RED ASISTENCIAL CAJAMARCA' },
    { cod: '0228', descripcion: 'RED ASISTENCIAL TACNA' },
    { cod: '0217', descripcion: 'RED ASISTENCIAL JULIACA' },
    { cod: '0235', descripcion: 'RED ASISTENCIAL JAEN' },
    { cod: '0218', descripcion: 'RED ASISTENCIAL TARAPOTO' },
    { cod: '0230', descripcion: 'RED ASISTENCIAL TUMBES' },
    { cod: '0227', descripcion: 'RED ASISTENCIAL ANCASH' },
    { cod: '0224', descripcion: 'RED ASISTENCIAL AYACUCHO' },
    { cod: '0234', descripcion: 'RED ASISTENCIAL MOYOBAMBA' },
    { cod: '0210', descripcion: 'RED ASISTENCIAL HUARAZ' },
    { cod: '0209', descripcion: 'RED ASISTENCIAL MOQUEGUA' },
  ];

  myControlPersonal = new FormControl();
  filteredOptionsPersonal: Observable<any[]>;
  listPersonal = [
    { dni: '70946713', nombre: 'ELENA YVONNE DEL CASTILLO GABRIEL' },
    { dni: '20108518', nombre: 'FRANCISCO	BAZAN MATOS' },
    { dni: '43361143', nombre: 'GONZALO MARIANO	CUENTAS CANAL' },
    { dni: '45611148', nombre: 'STHYWEN JAVIER RUIZ MUNOZ' },
    { dni: '42564700', nombre: 'ROSARIO JULISSA	CHOLAN AGUERO' },
    { dni: '03700150', nombre: 'PAULO CESAR	SANTAMARIA TEQUE' },
    { dni: '07461911', nombre: 'LUIS EMILIO	SANDOVAL SIFUENTES' },
    { dni: '21534142', nombre: 'YORY ALDORADIN TEJEDA' },
    { dni: '72437355', nombre: 'DIEGO ALBERTO	PAZ MEDINA' },
    { dni: '41902485', nombre: 'PABLO ABEL LERMO CHUQUILLANQUI' },
    { dni: '15845763', nombre: 'LUCIO EDUARDO	GAMARRA BALBUENA' },
    { dni: '05272670', nombre: 'MIGUELINA VICTORA	ACOSTA DA SILVA' },
    { dni: '42747686', nombre: 'LAURA AMPARO MERCADO YUPANQUI' },
    { dni: '08101455', nombre: 'JULIAN MAXIMILIANO BERROCAL FLORES' },
  ];

  //tmp
  listPersonalTemporal: any[];
  redSeleccionadoTmp: any;
  personalSeleccionadoTmp: any;

  ///♫
  // @ViewChild('inputTrigger', { read: MatAutocompleteTrigger }) inputTrigger: MatAutocompleteTrigger;
  // itemControl = new FormControl();
  // stateChanges = new Subject<void>();
  // private _placeholder: string;
  // static nextId = 0;
  // @HostBinding() id = `input-ac-${AdministrarRolRedComponent.nextId++}`;
  // @HostBinding('attr.aria-describedby') describedBy = '';
  // setDescribedByIds(ids: string[]) {
  //   this.describedBy = ids.join(' ');
  // }
  // @Input() set value(value: any) {
  //   if (value) {
  //     this.selectedItems = value;
  //   }
  //   this.stateChanges.next();
  // }
  // get value() {
  //   return this.selectedItems;
  // }
  // @Input()
  // get placeholder() {
  //   return this._placeholder;
  // }
  // set placeholder(plh) {
  //   this._placeholder = plh;
  //   this.stateChanges.next();
  // }
  // private changeCallback: Function;
  // private touchedCallback: Function;
  // focused = false;
  // isAllSelected = false;

  // items = [
  //   new ItemList('RED ASISTENCIAL HUÁNUCO'),
  //   new ItemList('RED ASISTENCIAL ICA'),
  //   new ItemList('RED ASISTENCIAL HUANCAVELICA'),
  //   new ItemList('RED PRESTACIONAL REBAGLIATI'),
  //   new ItemList('RED PRESTACIONAL ALMENARA'),
  //   new ItemList('SEDE CENTRAL LIMA-AFESSALUD'),
  //   new ItemList('RED ASISTENCIAL PASCO'),
  //   new ItemList('RED ASISTENCIAL UCAYALI'),
  //   new ItemList('SEDE CENTRAL LIMA-Fondo Salud'),
  //   new ItemList('RED PRESTACIONAL SABOGAL'),
  //   new ItemList('RED ASISTENCIAL PIURA'),
  //   new ItemList('RED ASISTENCIAL PUNO'),
  //   new ItemList('RED PRESTACIONAL LAMBAYEQUE'),
  //   new ItemList('RED ASISTENCIAL AMAZONAS'),
  //   new ItemList('CENTRO NACIONAL DE SALUD RENAL'),
  //   new ItemList('INST. NACIONAL CARDIOVASCULAR'),
  //   new ItemList('RED ASISTENCIAL JUNIN'),
  //   new ItemList('RED ASISTENCIAL AREQUIPA'),
  //   new ItemList('RED ASISTENCIAL CUSCO'),
  //   new ItemList('RED ASISTENCIAL MADRE DE DIOS'),
  //   new ItemList('RED ASISTENCIAL LORETO'),
  //   new ItemList('RED ASISTENCIAL LA LIBERTAD'),
  //   new ItemList('RED ASISTENCIAL APURIMAC'),
  //   new ItemList('RED ASISTENCIAL CAJAMARCA'),
  //   new ItemList('RED ASISTENCIAL TACNA'),
  //   new ItemList('RED ASISTENCIAL JULIACA'),
  //   new ItemList('RED ASISTENCIAL JAEN'),
  //   new ItemList('RED ASISTENCIAL TARAPOTO'),
  //   new ItemList('RED ASISTENCIAL TUMBES'),
  //   new ItemList('RED ASISTENCIAL ANCASH'),
  //   new ItemList('RED ASISTENCIAL AYACUCHO'),
  //   new ItemList('RED ASISTENCIAL MOYOBAMBA'),
  //   new ItemList('RED ASISTENCIAL HUARAZ'),
  //   new ItemList('RED ASISTENCIAL MOQUEGUA')
  // ];
  // selectedItems: ItemList[] = new Array<ItemList>();
  // filteredItems: ItemList[];
  // // filteredItems: Observable<ItemList[]>;

  ////

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _notification: NotificationService,
    private _router: Router,
    private route: ActivatedRoute,
    private _dialogService: DialogService,
    private _dialogRef: MatDialog,

    ///♫
    // @Optional() @Self() public ngControl: NgControl,
    // private fm: FocusMonitor,
    // private elRef: ElementRef<HTMLElement>,
    // private cd: ChangeDetectorRef
  ) {
    ///♫
    // if (this.ngControl != null) {
    //   // this.ngControl.valueAccessor = this;
    // }
    // fm.monitor(elRef.nativeElement, true).subscribe(origin => {
    //   this.focused = !!origin;
    //   this.stateChanges.next();
    // });
  }

  ///♫
  // writeValue(value: any) {
  //   console.log(value, 'Inside writeValue')
  // }
  // registerOnChange(fn: Function) {
  //   this.changeCallback = fn;
  // }
  // registerOnTouched(fn: Function) {
  //   this.touchedCallback = fn;
  // }
  // lastFilter = '';

  ngOnInit(): void {
    this.loadTable();

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.descripcion),
        map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
      );

    //personal
    this.filteredOptionsPersonal = this.myControlPersonal.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombre),
        map(nombre => nombre ? this._filterPersonal(nombre) : this.listPersonal.slice())
      );

    //tmp_2
    this.listPersonalTemporal = [
      // { red: 'ICA', persona: 'DIEGO ALBERTO	PAZ MEDINA' },
      // { red: 'PASCO', persona: 'ELENA YVONNE DEL CASTILLO GABRIEL' },
    ];

    this.getFechaActual();

    ///♫
    // this.itemControl.valueChanges.pipe(
    //   startWith<string | ItemList[]>(''),
    //   map(value => typeof value === 'string' ? value : this.lastFilter),
    //   map(filter => this.filter(filter))
    // ).subscribe(data => this.filteredItems = data);
  }

  //red
  private _filter(value: string) {
    return this.options.filter(option => option.descripcion.toLowerCase().includes(value.toLowerCase()));
  }
  displayFnRed(selectedoption) {
    console.log(selectedoption)
    return selectedoption ? selectedoption.descripcion : undefined;
  }
  onSelectionChangeRed(event: any) {
    this.redSeleccionadoTmp = event.option.value;
  }

  //personal
  private _filterPersonal(value: string) {
    return this.listPersonal.filter(persona => persona.nombre.toLowerCase().includes(value.toLowerCase()));
  }
  displayFnPersonal(selectedpersona) {
    console.log(selectedpersona)
    return selectedpersona ? selectedpersona.nombre : undefined;
  }
  onSelectionChangePersonal(event: any) {
    this.personalSeleccionadoTmp = event.option.value;
  }

  //btn tmp añadir
  addListaTemporal() {
    console.log("id_red", this.redSeleccionadoTmp)
    console.log("id_usuario", this.personalSeleccionadoTmp)

    this.listPersonalTemporal.push({ red: this.redSeleccionadoTmp.descripcion, persona: this.personalSeleccionadoTmp.nombre });

    this.guardarAsignacionRed();
    this.redSeleccionadoTmp = null;
    this.personalSeleccionadoTmp = null;
    
  }

  removerItem(index: number) {
    this.listPersonalTemporal.splice(index, 1);
  }

  //btn save ws
  guardarAsignacionRed() {
    for (let i of this.listPersonalTemporal) {
      this.asignados.push({ red: i.red, personal: i.persona });
    }
    this.loadTable();
    this._notification.success("Lista de roles registradas correctamente");
    this.listPersonalTemporal = [];
  }

  loadTable() {
    this.dataSource = new MatTableDataSource(this.asignados);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getFechaActual() {
    const datepipe: DatePipe = new DatePipe('en-US')
    const date = new Date();
    let fecha = datepipe.transform(date, 'dd/MM/YYYY');
    this.fechaActual = fecha;
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  ///♫
  // clicker() {
  //   this.inputTrigger.openPanel();
  // }
  // filter(filter: string): ItemList[] {
  //   this.lastFilter = filter;
  //   if (filter) {
  //     return this.items.filter(option => {
  //       return option.item.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
  //     })
  //   } else {
  //     return this.items.slice();
  //   }
  // }
  // optionClicked(event: Event, item: ItemList) {
  //   event.stopPropagation();
  //   this.toggleSelection(item);
  // }
  // toggleSelectAll() {
  //   this.isAllSelected = !this.isAllSelected;
  //   let len = this.filteredItems.length;
  //   if (this.isAllSelected) {
  //     for (let i = 0; i++; i < len)
  //       this.filteredItems[i].selected = true;
  //     // this.selectedItems = data;
  //     this.selectedItems = this.filteredItems;
  //     // for ( let i=0; i++; i<len )
  //     //   this.items[i].selected = true;
  //     // this.filteredItems. = [...this.items];
  //     this.changeCallback(this.selectedItems);
  //     this.cd.markForCheck();
  //     // this.itemControl.updateValueAndValidity();
  //   } else {
  //     this.selectedItems = [];
  //     // for ( let i=0; i++; i<len )
  //     // this.items[i].selected = false;

  //   }
  //   this.changeCallback(this.selectedItems);
  // }
  // toggleSelection(item: ItemList) {
  //   item.selected = !item.selected;
  //   if (item.selected) {
  //     this.selectedItems.push(item);
  //     console.log(this.selectedItems)
  //     this.changeCallback(this.selectedItems);
  //   } else {
  //     const i = this.selectedItems.findIndex(value => value.item === item.item);
  //     this.selectedItems.splice(i, 1);
  //     this.changeCallback(this.selectedItems);
  //   }

  // }
  // ngOnDestroy() {
  //   this.fm.stopMonitoring(this.elRef.nativeElement);
  //   this.stateChanges.complete();
  // }


  //desabilitar
  modalActivarDesactivar(element) {
    const dialogRef: MatDialogRef<ConfirmarDialogoComponent> = this._dialogRef.open(ConfirmarDialogoComponent, {
      disableClose: false,
      autoFocus: false,
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTable()
    });
  }

  
  showDialogEdit(element) {
    const dialogRef: MatDialogRef<EditarRedComponent> = this._dialogRef.open(EditarRedComponent, {
      disableClose: false,
      autoFocus: false,
      width: '40%',
      //height: '780px',
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTable()
    });
  }

}

