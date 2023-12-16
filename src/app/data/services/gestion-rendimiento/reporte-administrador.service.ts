import { Injectable } from '@angular/core';

import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ReporteAdministradorService {
  fileName: string = "GDR_";

  constructor() { }

  exportExcelSeguimiento(titulo: any, columnas: string[], listData: any[]) {
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Seguimiento');

    worksheet.mergeCells(worksheet.getRow(1).getCell(1).address, worksheet.getRow(2).getCell(columnas.length).address);

    let titleReport = worksheet.getCell(worksheet.getRow(1).getCell(1).address);
    titleReport.value = titulo;
    titleReport.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
      color: { argb: 'ffffff' }
    }
    titleReport.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8ea9db' },
      bgColor: { argb: 'ffffff' }
    };
    titleReport.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleReport.alignment = { vertical: 'middle', horizontal: 'center' };

    this.formatoHeadersSeguimiento(worksheet, columnas);
    this.formatoContenidoSeguimiento(worksheet, listData, columnas);

    for (let i = 0; i < columnas.length; i++) {
      let maxLength = columnas[i].length;
      for (let j = 0; j < listData.length; j++) {
        if (worksheet.getRow(j + 4).getCell(i + 1).value) {
          if (worksheet.getRow(j + 4).getCell(i + 1).value.toString().length > maxLength)
            maxLength = worksheet.getRow(j + 4).getCell(i + 1).value.toString().length;
        }
      }
      worksheet.getColumn(i + 1).width = maxLength + maxLength * 0.6;
    }

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE, });
      fs.saveAs(blob, this.fileName + '_' + "Reporte_Seguimiento" + EXCEL_EXTENSION);
    });
  }

  formatoHeadersSeguimiento(wb: Worksheet, value) {
    for (let i = 0; i < value.length; i++) {
      wb.getRow(3).getCell(i + 1).value = value[i];
      wb.getRow(3).getCell(i + 1).font = {
        name: 'Calibri',
        size: 12,
        bold: true,
        color: { argb: 'ffffff' }
      };
      wb.getRow(3).getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center' };
      wb.getRow(3).getCell(i + 1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      wb.getRow(3).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8ea9db' },
        bgColor: { argb: 'ffffff' }
      };
    }
    wb.getRow(3).height = 35;
  }

  formatoContenidoSeguimiento(wb: Worksheet, values, columnas) {
    for (let i = 0; i < values.length; i++) {
      wb.getRow(i + 4).getCell('A').value = values[i].numeroDocumento;
      wb.getRow(i + 4).getCell('B').value = values[i].nombreCompleto;
      wb.getRow(i + 4).getCell('C').value = values[i].unidad;
      wb.getRow(i + 4).getCell('D').value = "";
      wb.getRow(i + 4).getCell('E').value = "";
      wb.getRow(i + 4).getCell('F').value = values[i].puesto;
      wb.getRow(i + 4).getCell('G').value = values[i].rol;
      wb.getRow(i + 4).getCell('H').value = values[i].meta;
      wb.getRow(i + 4).getCell('I').value = values[i].mes;
      wb.getRow(i + 4).getCell('J').value = values[i].plazo;
      for (let j = 0; j < columnas.length; j++) {
        wb.getRow(i + 4).getCell(j + 1).font = {
          name: 'Calibri',
          size: 12,
        }
        wb.getRow(i + 4).getCell(j + 1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    }
  }

  exportExcelMatriz(titulo: any, columnas: string[], listData: any[]) {
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Matriz');

    worksheet.mergeCells(worksheet.getRow(1).getCell(2).address, worksheet.getRow(2).getCell(4).address);

    let titleReport = worksheet.getCell(worksheet.getRow(1).getCell(2).address);
    titleReport.value = titulo;
    titleReport.font = {
      name: 'Calibri',
      size: 11,
      bold: true
    }
    titleReport.alignment = { vertical: 'middle', horizontal: 'left' };

    let entidad = worksheet.getCell(worksheet.getRow(3).getCell(1).address);
    entidad.value = 'ENTIDAD:';
    entidad.font = {
      name: 'Calibri',
      size: 10,
      bold: true
    }
    entidad.alignment = { vertical: 'middle', horizontal: 'right' };

    let titleEntidad = worksheet.getCell(worksheet.getRow(3).getCell(2).address);
    titleEntidad.value = 'SEGURO SOCIAL DE SALUD';
    titleEntidad.font = {
      name: 'Calibri',
      size: 9,
      bold: false
    }
    titleEntidad.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffe598' }
    };
    titleEntidad.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
    titleEntidad.alignment = { vertical: 'middle', horizontal: 'left' };

    this.formatoHeadersMatriz(worksheet, columnas);
    this.formatoContenidoMatriz(worksheet, listData, columnas);
    console.log(listData);
    for (let i = 0; i < columnas.length; i++) {
      let maxLength = columnas[i].length;
      for (let j = 0; j < listData.length; j++) {
        if (worksheet.getRow(j + 6).getCell(i + 1).value) {
          if (worksheet.getRow(j + 6).getCell(i + 1).value.toString().length > maxLength)
            maxLength = worksheet.getRow(j + 6).getCell(i + 1).value.toString().length;
        }
      }
      worksheet.getColumn(i + 1).width = maxLength + maxLength * 0.6;
    }

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE, });
      fs.saveAs(blob, this.fileName + '_' + "Reporte_Matriz" + EXCEL_EXTENSION);
    });
  }

  formatoHeadersMatriz(wb: Worksheet, value) {
    for (let i = 0; i < value.length; i++) {
      wb.getRow(5).getCell(i + 1).value = value[i];
      wb.getRow(5).getCell(i + 1).font = {
        name: 'Calibri',
        size: 12,
        bold: true,
        color: { argb: 'ffffff' }
      };
      wb.getRow(5).getCell(i + 1).alignment = { vertical: 'middle', horizontal: 'center' };
      wb.getRow(5).getCell(i + 1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      wb.getRow(5).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8ea9db' },
        bgColor: { argb: 'ffffff' }
      };
    }
    wb.getRow(5).height = 35;
  }

  formatoContenidoMatriz(wb: Worksheet, values, columnas) {
    for (let i = 0; i < values.length; i++) {
      wb.getRow(i + 6).getCell('A').value = values[i].numeroDocumento;
      wb.getRow(i + 6).getCell('B').value = values[i].nombreCompleto;
      wb.getRow(i + 6).getCell('C').value = values[i].genero;
      wb.getRow(i + 6).getCell('D').value = values[i].fechaNacimiento;
      wb.getRow(i + 6).getCell('E').value = values[i].regimenLaboral;
      wb.getRow(i + 6).getCell('F').value = values[i].correo;
      wb.getRow(i + 6).getCell('G').value = "";
      wb.getRow(i + 6).getCell('H').value = values[i].organo;
      wb.getRow(i + 6).getCell('I').value = "";
      wb.getRow(i + 6).getCell('J').value = "";
      wb.getRow(i + 6).getCell('K').value = values[i].puesto;
      wb.getRow(i + 6).getCell('L').value = values[i].segmento;
      wb.getRow(i + 6).getCell('M').value = values[i].rol;
      wb.getRow(i + 6).getCell('N').value = "";
      wb.getRow(i + 6).getCell('O').value = values[i].listDescripcionIndicador[0];
      wb.getRow(i + 6).getCell('P').value = values[i].listDescripcionIndicador[1];
      wb.getRow(i + 6).getCell('Q').value = "";
      wb.getRow(i + 6).getCell('R').value = "";
      wb.getRow(i + 6).getCell('S').value = "";
      wb.getRow(i + 6).getCell('T').value = "";
      wb.getRow(i + 6).getCell('U').value = "";
      wb.getRow(i + 6).getCell('V').value = "";
      for (let j = 0; j < columnas.length; j++) {
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
