import { startWith, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogService, NotificationService } from '@core/services';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmarDialogoComponent } from './confirmar-dialogo/confirmar-dialogo.component';
import { AsignacionRolSectorizacionService } from '@data/services/asignacion-rol-sectorizacion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Asignacion } from '@data/models/asignacion-rol-red/asignacion';
import { Red } from '@data/models/asignacion-rol-red/red';

@Component({
  selector: 'app-administrar-rol-red',
  templateUrl: './administrar-rol-red.component.html',
  styleUrls: ['./administrar-rol-red.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: AdministrarRolRedComponent }]
})
export class AdministrarRolRedComponent implements OnInit {
  showFilter = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['personal', 'red', 'fechaAsignacion', 'estado'];

  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  listRedes = [];

  myControlPersonal = new FormControl();
  filteredOptionsPersonal: Observable<any[]>;
  listPersonal = [];

  //registrar
  redSeleccionadoTmp: any;
  personalSeleccionadoTmp: any;

  constructor(
    private _notification: NotificationService,
    private _router: Router,
    private route: ActivatedRoute,
    private _dialogService: DialogService,
    private _dialogRef: MatDialog,
    private _sectorizacionService: AsignacionRolSectorizacionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.loadTable();
    this.getListPersonal();
    this.getListRed();

    //red
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.descripcion),
        map(descripcion => descripcion ? this._filter(descripcion) : this.listRedes.slice())
      );

    //personal
    this.filteredOptionsPersonal = this.myControlPersonal.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombresCompletos),
        map(nombresCompletos => nombresCompletos ? this._filterPersonal(nombresCompletos) : this.listPersonal.slice())
      );

  }

  //red
  private _filter(value: string) {
    if (value != undefined) {
      return this.listRedes.filter(red => red.descripcion.toLowerCase().includes(value.toLowerCase()));
    }
    return this.listRedes;
  }
  displayFnRed(selectedoption) {
    return selectedoption ? selectedoption.descripcion : undefined;
  }
  onSelectionChangeRed(event: any) {
    this.redSeleccionadoTmp = event.option.value;
  }

  //personal
  private _filterPersonal(value: string) {
    return this.listPersonal.filter(persona => persona.nombresCompletos.toLowerCase().includes(value.toLowerCase()));
  }
  displayFnPersonal(selectedpersona) {
    return selectedpersona ? selectedpersona.nombresCompletos : undefined;
  }
  onSelectionChangePersonal(event: any) {
    this.personalSeleccionadoTmp = event.option.value;
  }

  async registrarAsignacion() {
    this.spinner.show();
    // console.log(this.redSeleccionadoTmp)
    // console.log(this.personalSeleccionadoTmp)

    let asignacion = new Asignacion();
    asignacion.idUsuario = this.personalSeleccionadoTmp.idUsuario;

    let redes: Red[] = [];
    redes.push(this.redSeleccionadoTmp.codRed);

    asignacion.redes = redes;

    let registrar = await this._sectorizacionService.registrarAsignacion(asignacion).then((data) => {
      this._notification.success("Usuario asignado correctamente");
    });

    this.spinner.hide();
    this.loadTable();
    
    this.myControl.reset('');
    this.myControlPersonal.reset('');

    this.redSeleccionadoTmp = null;
    this.personalSeleccionadoTmp = null;
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

  operarHabilitarDeshabilitar(element) {
    const dialogRef: MatDialogRef<ConfirmarDialogoComponent> = this._dialogRef.open(ConfirmarDialogoComponent, {
      disableClose: true,
      autoFocus: false,
      width: '30%',
      data: {
        red: element.red,
        personal: element.usuario,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadTable();
    });

  }

  async loadTable() {
    let listAsignados = await this._sectorizacionService.getListRolesAsignados().then((data) => {
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this._notification.warning('Lista vacia');
      }
    });
  }

  async getListPersonal() {
    let listPersonal = await this._sectorizacionService.getListPersonal().then((data) => {
      if (data) {
        this.listPersonal = data;
      } 
    });
  }

  async getListRed() {
    let listRed = await this._sectorizacionService.getListRed().then((data) => {
      if (data) {
        this.listRedes = data;
      } 
    });
  }

}

