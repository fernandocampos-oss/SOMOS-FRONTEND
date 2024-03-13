import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CargaMasivaVotante, VotanteSegmentoVotante } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento/gestion-rendimiento.service';
import { ConfirmarPanelComponent } from '@shared/confirmar-panel/confirmar-panel.component';
import { PanelObservadoComponent } from './dialogs/panel-observado/panel-observado.component';
import { NotificationService } from '@core/services';

import * as XLSX from 'xlsx';
@Component({
  selector: 'gr-administrar-votante',
  templateUrl: './administrar-votante.component.html',
  styleUrls: ['./administrar-votante.component.scss']
})
export class AdministrarVotanteComponent implements OnInit {
  nameFile?: string;
  isLoadingUpload = false;
  isLoadingProcess = false;
  mensajeProceso: string = "";
  mensajeCargaEmpleados: string = "";

  confirmDialogRef: MatDialogRef<ConfirmarPanelComponent>;

  selectedFile: any = null;
  arrayBuffer: any;
  jsontext: any;

  @ViewChild('tablaVotantes') tablaVotantes: MatTable<any>;

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  dataSource: any = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['dni', 'nombres', 'segmento'];
  listVotantes: any[] = [];

  listSegmento: any[] = [
    { cod: 1, descripcion: 'Directivo' },
    { cod: 3, descripcion: 'Ejecutor' },
    { cod: 2, descripcion: 'Operador' },
    { cod: 4, descripcion: 'Mando medio' },
  ];

  constructor(
    private _dialog: MatDialog,
    private _grService: GestionRendimientoService,
    private _notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.listarVotantePerfil();
  }

  async listarVotantePerfil() {
    let load = await this._grService.listarVotantePerfil().then((data: any) => {
      if (data.length > 0) {
        this.listVotantes = data;
        this.dataSource = new MatTableDataSource<any>(this.listVotantes);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      } else {
        this._notification.warning("Lista de votantes vacia");
        this.dataSource = null;
      }
    });
  }

  filtrarTable(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  async actualizarSegmentoVotante(idSegmento: any, idVotante: any) {
    console.log("idSegmento ", idSegmento, " idVotante ", idVotante);

    this.confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false,
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de actualizar el segmento?';
    this.confirmDialogRef.afterClosed().subscribe(async result => {
      if (result) {

        let votante = new VotanteSegmentoVotante();
        votante.idSegmento = idSegmento;

        let update = await this._grService.actualizarSegmentoVotante(idVotante, votante).then((data) => {
          if (data = 1) {
            this._notification.success("Segmento actualizado");
            // this._dialogRef.closeAll();
            // this._dialogRef.close();
          } else {
            this._notification.error("Actualizar Segmento: Error");
          }
        });


      }
      this.confirmDialogRef == null;
    });
  }

  onFileSelected(e: any) {
    this.mensajeProceso = "";
    if (e.target.files.length > 0) {
      // console.log("1.", e.target.files[0]);
      // console.log("2.", e.target.files[0].name);
      this.nameFile = e.target.files[0].name;;
      this.selectedFile = e.target.files[0];

      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.selectedFile);
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        this.jsontext = XLSX.utils.sheet_to_json<string>(worksheet, { raw: true });

        // console.log("data excel", this.jsontext);
        this.isLoadingProcess = true;
      }

    } else {
      this.selectedFile = null;
    }
  }

  async procesar() {
    this.confirmDialogRef = this._dialog.open(ConfirmarPanelComponent, {
      disableClose: false,
    });
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de procesar el archivo seleccionado?';
    this.confirmDialogRef.afterClosed().subscribe(async result => {
      if (result) {

        if (this.jsontext.length > 0) {
          let personas: CargaMasivaVotante[] = [];
          for (let i = 0; i < this.jsontext.length; i++) {
            let persona = new CargaMasivaVotante();
            persona.numeroDocumento = this.jsontext[i].DNI;
            persona.nombres = this.jsontext[i].NOMBRES;
            persona.apellidos = this.jsontext[i].APELLIDOS;
            persona.idSegmento = this.jsontext[i].SEGMENTO;
            personas.push(persona);
          }
          this.mensajeProceso = 'Procesando...';
          let saveAll = await this._grService.procesarExcelVotante(personas).then(data => {
            if (data) {
              // console.log(data);
              if (data.length > 0) {
                this.mensajeProceso = '';
                this._notification.warning("Proceso terminado con observaciones.");
                this.isLoadingProcess = false;
                this.tablaVotantes.renderRows();
                this.verObservados(data);
              } else {
                this.mensajeProceso = '';
                this._notification.success("Proceso terminado exitosamente.");
                this.isLoadingProcess = false;
              }

            } else {
              this.mensajeProceso = '';
              this._notification.error("Error al procesar.");
              this.isLoadingProcess = false;
            }
          });
        }

      }
      this.confirmDialogRef == null;
    });
  }

  verObservados(element: any) {
    const dialogRef: MatDialogRef<PanelObservadoComponent> = this._dialog.open(PanelObservadoComponent, {
      disableClose: false,
      width: '60%',
      maxHeight: '100vh',
      autoFocus: false,
      data: {
        model: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.loadTable();
    });
  }

}
