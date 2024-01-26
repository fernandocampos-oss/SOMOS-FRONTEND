import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UsuarioService } from '@data/services';
import { BoletaService } from '@data/services/boleta.service';
import { BoletaPago } from '@data/models/boleta/boleta-pago.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VerBoletaComponent } from '@modules/mis-boletas/components/ver-boleta/ver-boleta.component';
import { InscribirseBoletasComponent } from '@modules/mis-boletas/components/inscribirse-boletas/inscribirse-boletas.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BoletaTipo } from '@data/models/boleta/boleta-tipo.model';
import { BoletaHistorial } from '@data/models/boleta/boleta-historial.model';

interface Mes{
  num: string;
  descripcion: string;
}

interface Año{
  anio: string;
}

@Component({
  selector: 'app-mis-boletas',
  templateUrl: './mis-boletas.component.html',
  styleUrls: ['./mis-boletas.component.scss']
})
export class MisBoletasComponent implements OnInit {

  @ViewChild('tablaBoletas') tablaBoletas: MatTable<any>;
  @ViewChild('tablaAcciones') tablaAcciones: MatTable<any>;
  today = new Date();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSourceAcciones: MatTableDataSource<BoletaHistorial> = new MatTableDataSource([]);

  displayedColumnsBoletas: string[] = ['anio', 'mes', 'regimen', 'tipoBoleta', 'periodo', 'descripcion', 'accion'];
  listBoletas: BoletaPago[] = [];
  listTipos: BoletaTipo[] = [];

  displayedColumnsAcciones: string[] = ['fecha', 'accion', 'descripcion', 'tipo'];

  form = this._fb.group({
    frmMesElegido: [null],
    frmAnioElegido: [null],
    frmTipoElegido: [''],
  });

  meses: Mes[] = [
    {num: '01', descripcion: 'Enero'},
    {num: '02', descripcion: 'Febrero'},
    {num: '03', descripcion: 'Marzo'},
    {num: '04', descripcion: 'Abril'},
    {num: '05', descripcion: 'Mayo'},
    {num: '06', descripcion: 'Junio'},
    {num: '07', descripcion: 'Julio'},
    {num: '08', descripcion: 'Agosto'},
    {num: '09', descripcion: 'Setiembre'},
    {num: '10', descripcion: 'Octubre'},
    {num: '11', descripcion: 'Noviembre'},
    {num: '12', descripcion: 'Diciembre'},
  ];
  anios: Año[] = [
    {anio: '2021'},
    {anio: '2022'},
    {anio: '2023'},
    {anio: '2024'}
  ];
  mesElegido: string;
  anioElegido: string;
  tipoElegido: string;
  tipoDescripcion: string;

  pdfSrc: string;

  inscrito: boolean;

  constructor(private _router       : Router,
              private _fb           : FormBuilder,
              private _matDialog     : MatDialog,
              private authService   : AuthService,
              private userService   : UsuarioService,
              private boletaService : BoletaService,
              private route         : ActivatedRoute) { }

  ngOnInit(): void {
    this.boletaService.getIfInscritosBoleta().subscribe(inscrito => {
      this.inscrito = inscrito;
      if (inscrito) {
        this.cargar();
      } else {
        this.aceptarTerminos();
      }
    });
  }

  cargar() {
    const numMes = this.today.getMonth() + 1 + '';
    this.mesElegido = numMes.padStart(2, '0');
    this.anioElegido = this.today.getFullYear() + '';
    this.tipoElegido = '';
    this.form.controls.frmMesElegido.setValue(this.mesElegido);
    this.form.controls.frmAnioElegido.setValue(this.anioElegido);
    this.form.controls.frmTipoElegido.setValue(this.tipoElegido);
    this.cargarTipos();
    this.buscarBoleta();
    this.listarHistorial();
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }

  cargarTipos() {
    this.boletaService.listarTipos().subscribe(data => {
      this.listTipos = data;
    });
  }

  listarHistorial() {
    this.boletaService.listarHistorial().subscribe(data => {
      this.dataSourceAcciones = new MatTableDataSource(data);
      this.dataSourceAcciones.paginator = this.paginator;
      this.dataSourceAcciones.sort = this.sort;
      this.tablaAcciones.renderRows();
    });
  }

  buscarBoleta(){
    this.listBoletas = [];
    this.anioElegido = this.form.get('frmAnioElegido').value;
    this.boletaService.buscarBoletaPago(this.anioElegido, this.mesElegido, this.tipoElegido).subscribe(boleta => {
      if (boleta.pdfBase64) {
        boleta.anio = this.anioElegido;
        boleta.mes = this.mesElegido;
        boleta.periodo = this.anioElegido + '-' + this.mesElegido;
        boleta.descripcion = this.obtenerDescripcion(this.mesElegido);
        this.listBoletas.push(boleta);
        this.pdfSrc = boleta.pdfBase64;
      }
      this.tablaBoletas.renderRows();
    });
  }

  obtenerDescripcion(mes: string): string {
    let descripcion = '';
    switch (mes) {
      case '01': descripcion = 'Boleta Mes de Enero'; break;
      case '02': descripcion = 'Boleta Mes de Febrero'; break;
      case '03': descripcion = 'Boleta Mes de Marzo'; break;
      case '04': descripcion = 'Boleta Mes de Abril'; break;
      case '05': descripcion = 'Boleta Mes de Mayo'; break;
      case '06': descripcion = 'Boleta Mes de Junio'; break;
      case '07': descripcion = 'Boleta Mes de Julio'; break;
      case '08': descripcion = 'Boleta Mes de Agosto'; break;
      case '09': descripcion = 'Boleta Mes de Setiembre'; break;
      case '10': descripcion = 'Boleta Mes de Octubre'; break;
      case '11': descripcion = 'Boleta Mes de Noviembre'; break;
      case '12': descripcion = 'Boleta Mes de Diciembre'; break;
    }
    return descripcion;
  }

  aceptarTerminos() {
    const dialogRef: MatDialogRef<InscribirseBoletasComponent> = this._matDialog.open(InscribirseBoletasComponent, {
      disableClose: true,
      minWidth: '350px',
      maxWidth: '30%',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargar();
      }
    });
  }
  
  showBoleta(element: BoletaPago){
    const descripcion = element.descripcion + ' ' + element.anio;
    this.showPdf(element.pdfBase64, descripcion);
    this.boletaService.registrarAccion(2, descripcion, this.tipoDescripcion).subscribe(() => {
      this.listarHistorial();
    });
  }

  downloadBoleta(element: BoletaPago){
    const descripcion = element.descripcion + ' ' + element.anio;
    this.downloadPdf(element.pdfBase64, element.periodo);
    this.boletaService.registrarAccion(3, descripcion, this.tipoDescripcion).subscribe(() => {
      this.listarHistorial();
    });
  }

  downloadPdf(pdfBase64: string, periodo: string) {
    const blob = this.base64ToBlob(pdfBase64, 'application/pdf');
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'boleta-pago-' + periodo + '.pdf';
    link.click();

    URL.revokeObjectURL(url);
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  showPdf(pdfBase64: string, descripcion: string) {
    const dialogRef: MatDialogRef<VerBoletaComponent> = this._matDialog.open(VerBoletaComponent, {
      disableClose: false,
      width: '70%',
      // height: '780px',
      autoFocus: true,
      data: {
        pdfBase64,
        descripcion,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
