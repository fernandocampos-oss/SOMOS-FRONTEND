import { Injectable } from '@angular/core';
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelEncuestasService {
  fileName: string = "Somos EsSalud - Encuesta";

  constructor() { }

  exportExcel(datosEncuesta : any) {

    function toTitleCase(input: string): string {
      return input.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    }
    
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Usuarios inscritos');

    if (datosEncuesta.preguntas.length == 1) {
      let header = ['DNI','Cod. Planilla','Nombres y Apellidos','Red','Unidad Orgánica','Régimen','Cargo','Celular','Correo','Curso'];
  
      worksheet.mergeCells(worksheet.getRow(3).getCell(1).address, worksheet.getRow(3).getCell(header.length).address);
      let titleReport = worksheet.getCell('A3');
      titleReport.value = datosEncuesta.nombreEncuesta;
      titleReport.font = {
        name:'Times New Roman',
        size: 14,
        bold:true,
      }
      titleReport.alignment = { horizontal: 'center'};
      
      this.formatoHeaders(worksheet,header);
      this.formatoContenido(worksheet, datosEncuesta.usuarios, header);
      console.log(datosEncuesta)
      for (let i = 0; i < header.length; i++) {
        let maxLength = header[i].length;
        for (let j = 0; j < datosEncuesta.usuarios.length; j++) {
          if (worksheet.getRow(j+6).getCell(i+1).value) {
            if(worksheet.getRow(j+6).getCell(i+1).value.toString().length > maxLength)
              maxLength = worksheet.getRow(j+6).getCell(i+1).value.toString().length;
          }
        }
        worksheet.getColumn(i+1).width = maxLength + maxLength*0.6;
      }
      
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: EXCEL_TYPE, });
        fs.saveAs(blob, this.fileName + '_' + datosEncuesta.nombreEncuesta + EXCEL_EXTENSION);
      });
    }
  }
  
  formatoHeaders(wb: Worksheet, values){
    for (let i = 0; i < values.length; i++) {
      wb.getRow(5).getCell(i+1).value = values[i];
      wb.getRow(5).getCell(i+1).font = {
        name:'Times New Roman',
        size: 14,
        bold: true,
      };
      wb.getRow(5).getCell(i+1).alignment = { horizontal: 'center'};
      wb.getRow(5).getCell(i+1).border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      }
    }
  }

  formatoContenido(wb: Worksheet, values, headers){
    for (let i = 0; i < values.length; i++) {
      wb.getRow(i+6).getCell('A').value = values[i].numeroDocumento;
      wb.getRow(i+6).getCell('B').value = values[i].codigoPlanilla;
      wb.getRow(i+6).getCell('C').value = values[i].nombreCompleto;
      wb.getRow(i+6).getCell('D').value = values[i].red;
      wb.getRow(i+6).getCell('E').value = values[i].unidadOrganica;
      wb.getRow(i+6).getCell('F').value = values[i].regimen;
      wb.getRow(i+6).getCell('G').value = values[i].cargo;
      wb.getRow(i+6).getCell('H').value = values[i].numeroCelular;
      wb.getRow(i+6).getCell('I').value = values[i].correo;
      wb.getRow(i+6).getCell('J').value = values[i].eleccion;
      for (let j = 0; j < headers.length; j++) {
        wb.getRow(i+6).getCell(j+1).font = {
          name: 'Calibri',
          size: 12,
        }
        wb.getRow(i+6).getCell(j+1).border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        }        
      }
    }
  }
}
