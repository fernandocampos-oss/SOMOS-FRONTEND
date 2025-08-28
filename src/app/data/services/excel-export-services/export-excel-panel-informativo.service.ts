import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Workbook, Worksheet } from 'exceljs';


import * as fs from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelPanelInformativoService {
  fileName: string = "Somos EsSalud - Resultados del Panel Informativo";

  constructor() { }

  exportExcel(datosPanel: any) {

    function toTitleCase(input: string): string {
      return input.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte');

    if (datosPanel.length > 0) {
      let header = ['Cod. Planilla', 'DNI', 'Apellidos y Nombres',
        'Política de Seguridad y Salud en el Trabajo de EsSalud',
        'Reglamento Interno de Seguridad y Salud en el Trabajo de EsSalud',
        'Recomendaciones de Seguridad y Salud en el Trabajo de EsSalud',
        'Fecha de registro', 'Red Asistencial', 'Unidad Orgánica',];

      worksheet.mergeCells(worksheet.getRow(3).getCell(1).address, worksheet.getRow(3).getCell(header.length).address);
      let titleReport = worksheet.getCell('A3');
      titleReport.value = "REPORTE DE USUARIOS QUE ACEPTARON EL PANEL INFORMATIVO";
      titleReport.font = {
        name: 'Calibri',
        size: 14,
        bold: true,
        color: { argb: 'ffffff' }
      };
      titleReport.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '009bcf' },
        bgColor: { argb: 'ffffff' }
      };
      titleReport.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      titleReport.alignment = { horizontal: 'center' };

      this.formatoHeaders(worksheet, header);
      this.formatoContenido(worksheet, datosPanel, header);
      // console.log(datosPanel)
      for (let i = 0; i < header.length; i++) {
        let maxLength = header[i].length;
        for (let j = 0; j < datosPanel.length; j++) {
          if (worksheet.getRow(j + 6).getCell(i + 1).value) {
            if (worksheet.getRow(j + 6).getCell(i + 1).value.toString().length > maxLength)
              maxLength = worksheet.getRow(j + 6).getCell(i + 1).value.toString().length;
          }
        }
        // worksheet.getColumn(i + 1).width = maxLength + maxLength * 0.6;
        worksheet.getColumn(i + 1).width = 25;
      }

      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: EXCEL_TYPE, });
        fs.saveAs(blob, this.fileName + '_' + EXCEL_EXTENSION);
      });
    }
  }

  formatoHeaders(wb: Worksheet, values) {
    for (let i = 0; i < values.length; i++) {
      wb.getRow(5).getCell(i + 1).value = values[i];
      wb.getRow(5).getCell(i + 1).font = {
        name: 'Calibri',
        size: 14,
        bold: true,
      };
      wb.getRow(5).getCell(i + 1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      wb.getRow(5).getCell(i + 1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      wb.getRow(5).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd8d8d8' },
        bgColor: { argb: 'ffffff' }
      };
    }
  }

  formatoContenido(wb: Worksheet, values, headers) {
    for (let i = 0; i < values.length; i++) {
      const datePipe = new DatePipe('en-US');
      wb.getRow(i + 6).getCell('A').value = values[i].codigoPlanilla;
      wb.getRow(i + 6).getCell('B').value = values[i].numeroDocumento;
      wb.getRow(i + 6).getCell('C').value = values[i].apellidos + ", " + values[i].nombres;
      wb.getRow(i + 6).getCell('D').value = values[i].itemPolitica;
      wb.getRow(i + 6).getCell('E').value = values[i].itemReglamento;
      wb.getRow(i + 6).getCell('F').value = values[i].itemRecomendacion;
      wb.getRow(i + 6).getCell('G').value = datePipe.transform(values[i].fechaCreacion, 'dd/MM/yyyy hh:mm a');
      wb.getRow(i + 6).getCell('H').value = values[i].red;
      wb.getRow(i + 6).getCell('I').value = values[i].unidad;

      wb.getRow(i + 6).getCell('A').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      wb.getRow(i + 6).getCell('B').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      wb.getRow(i + 6).getCell('C').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      wb.getRow(i + 6).getCell('D').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      wb.getRow(i + 6).getCell('E').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      wb.getRow(i + 6).getCell('F').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      wb.getRow(i + 6).getCell('G').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      wb.getRow(i + 6).getCell('H').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      wb.getRow(i + 6).getCell('I').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

      for (let j = 0; j < headers.length; j++) {
        wb.getRow(i + 6).getCell(j + 1).font = {
          name: 'Calibri',
          size: 12,
        }
        wb.getRow(i + 6).getCell(j + 1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    }
  }

}
