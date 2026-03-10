import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelTrabajadorService {
  fileName: string = "GDR_";
  filaInicioFooter: number = 0;

  constructor(private http: HttpClient) { }

  async exportExcelTrabajador(trabajador: any, jefe: any, listPrioridades: any[], reunionData?: { asistio: string, fecha: string }) {
    try {
      // Cargar la plantilla desde assets usando fetch
      const templateUrl = 'assets/docs/modeloGDR.xlsx';
      const response = await fetch(templateUrl);
      const templateArrayBuffer = await response.arrayBuffer();
      
      const workbook = new Workbook();
      await workbook.xlsx.load(templateArrayBuffer);
      
      const worksheet = workbook.getWorksheet(1);

      // SECCIÓN 1 - DATOS DEL EVALUADO (columna D, filas 8-12)
      worksheet.getCell('D8').value = trabajador.numeroDocumento;
      worksheet.getCell('D9').value = trabajador.nombre;
      worksheet.getCell('D10').value = trabajador.cargo;
      worksheet.getCell('D11').value = trabajador.segmento;
      worksheet.getCell('D12').value = trabajador.codUnidad;

      // SECCIÓN 1 - DATOS DEL EVALUADOR (columna K, filas 8-12)
      worksheet.getCell('K8').value = jefe.numeroDocumento;
      worksheet.getCell('K9').value = jefe.nombre;
      worksheet.getCell('K10').value = jefe.cargo;
      worksheet.getCell('K11').value = jefe.segmento;
      worksheet.getCell('K12').value = jefe.codUnidad;

      // SECCIÓN 2 - REUNIÓN ESTABLECIMIENTO DE METAS (fila 18)
      worksheet.getCell('D18').value = reunionData?.asistio || '-';
      worksheet.getCell('H18').value = reunionData?.fecha || '-';

      // Generar y guardar el archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: EXCEL_TYPE });
      fs.saveAs(blob, this.fileName + '_' + trabajador.nombre + '_' + new Date().getTime() + EXCEL_EXTENSION);
    } catch (error) {
      console.error('Error al generar Excel desde plantilla:', error);
    }
  }

  formatoEvidencias(wb: Worksheet, listEvidencia, position) {
    const datePipe = new DatePipe('en-US');
    for (let i = 0; i < listEvidencia.length; i++) {
      wb.getRow(i + position).getCell('E').value = listEvidencia[i].descripcion;
      wb.getRow(i + position).getCell('E').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      wb.getRow(i + position).getCell('E').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      wb.getColumn(5).width = 35;

      wb.getRow(i + position).getCell('F').value = datePipe.transform(listEvidencia[i].plazo, 'dd/MM/yyyy');
      wb.getRow(i + position).getCell('F').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      wb.getRow(i + position).getCell('F').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      wb.getColumn(6).width = 15;
    }
  }

}
