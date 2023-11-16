import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { inscritosResponse } from '@data/models/inscripcion/inscripcion.model';

import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';

// export const imgBase64 = "data:image/jpg;base64,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";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {
  fileName: string = "Inscripción Campaña";

  constructor() { }

  exportExcel(columnas: string[], dataInscripcion: any, dataExtraInscripcion: any) {
  // exportExcel(titulo, columnas: string[], inscritos :inscritosResponse[], esVotacion: any) {
    //Title, Header & Data
    // const regimen = excelData.regimen;
    // const header = excelData.headers;
    // const data = excelData.data;
    console.log(columnas)
    console.log(dataInscripcion)
    console.log(dataExtraInscripcion)
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Inscritos');

    worksheet.mergeCells(worksheet.getRow(3).getCell(1).address,worksheet.getRow(3).getCell(columnas.length).address);
    
    let titleReport = worksheet.getCell(worksheet.getRow(3).getCell(1).address);
    titleReport.value = dataInscripcion.descripcion;
    titleReport.font = {
      name:'Times New Roman',
      size: 16,
      bold:true,
    }
    titleReport.alignment = { horizontal: 'center'};

    this.formatoHeaders(worksheet,columnas);

    this.formatoContenido(worksheet, dataInscripcion, columnas.length, dataExtraInscripcion);

    for (let i = 0; i < columnas.length; i++) {
      let maxLength = columnas[i].length;
      for (let j = 0; j < dataInscripcion.inscritos.length; j++) {
        if (worksheet.getRow(j+6).getCell(i+1).value) {
          if(worksheet.getRow(j+6).getCell(i+1).value.toString().length > maxLength)
            maxLength = worksheet.getRow(j+6).getCell(i+1).value.toString().length;
        }
      }
      
      worksheet.getColumn(i+1).width = maxLength + maxLength*0.6;
      // worksheet.getColumn(i+1).alignment = { wrapText:true};
    }
    
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE, });
      fs.saveAs(blob, this.fileName + '_' + dataInscripcion.descripcion + EXCEL_EXTENSION);
    });
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

  formatoContenido(wb: Worksheet, dataInscripcion, cantHeaders, dataExtraInscripcion){
    const datePipe = new DatePipe('en-US');
  // formatoContenido(wb: Worksheet, values, cantHeaders, esVotacion){
    if(dataExtraInscripcion.grupoActivo){
      let identificador = 0;
      // let position;
      for (let i = 0; i < dataInscripcion.inscritos.length; i++) {
        if(dataInscripcion.inscritos[i].idLider != identificador){
          identificador = dataInscripcion.inscritos[i].idLider;
          wb.mergeCells(wb.getRow(i+6).getCell(1).address,wb.getRow(dataInscripcion.inscritos.filter((z)=>{return identificador == z.idLider}).length + i + 5).getCell(1).address);
          if(dataInscripcion.votacionesResultado){
            wb.mergeCells(wb.getRow(i+6).getCell(2).address,wb.getRow(dataInscripcion.inscritos.filter((z)=>{return identificador == z.idLider}).length + i + 5).getCell(2).address);
            if(dataInscripcion.votacionesResultado.find((votacionRes)=>{return votacionRes.idLider == identificador})){
              wb.getRow(i+6).getCell(2).value = dataInscripcion.votacionesResultado.find((votacionRes)=>{return votacionRes.idLider == identificador}).votos;
            }
            else{
              wb.getRow(i+6).getCell(2).value = 0;
            }
          }
        }
      }
      for (let i = 0; i < dataInscripcion.inscritos.length; i++) {
        if(dataExtraInscripcion.textoActivo){
          wb.getRow(i+6).getCell('A').value = dataInscripcion.inscritos[i].descripcion;
        }
        else if(dataInscripcion.inscritos[i].idLider == dataInscripcion.inscritos[i].idUsuario){
          wb.getRow(i+6).getCell('A').value = dataInscripcion.inscritos[i].nombreCompleto;
        }
        if(dataInscripcion.votacionesResultado){
          wb.getRow(i+6).getCell('C').value = dataInscripcion.inscritos[i].numeroDocumento;
          wb.getRow(i+6).getCell('D').value = dataInscripcion.inscritos[i].nombreCompleto;
          wb.getRow(i+6).getCell('E').value = datePipe.transform(dataInscripcion.inscritos[i].fechaNacimiento, 'dd/MM/yyyy');
          wb.getRow(i+6).getCell('F').value = dataInscripcion.inscritos[i].red;
          wb.getRow(i+6).getCell('G').value = dataInscripcion.inscritos[i].unidadOrganica;
          wb.getRow(i+6).getCell('H').value = dataInscripcion.inscritos[i].regimen;
          wb.getRow(i+6).getCell('I').value = dataInscripcion.inscritos[i].numeroCelular;
          wb.getRow(i+6).getCell('J').value = dataInscripcion.inscritos[i].correo;
        }
        else{
          wb.getRow(i+6).getCell('B').value = dataInscripcion.inscritos[i].numeroDocumento;
          wb.getRow(i+6).getCell('C').value = dataInscripcion.inscritos[i].nombreCompleto;
          wb.getRow(i+6).getCell('D').value = datePipe.transform(dataInscripcion.inscritos[i].fechaNacimiento, 'dd/MM/yyyy');
          wb.getRow(i+6).getCell('E').value = dataInscripcion.inscritos[i].red;
          wb.getRow(i+6).getCell('F').value = dataInscripcion.inscritos[i].unidadOrganica;
          wb.getRow(i+6).getCell('G').value = dataInscripcion.inscritos[i].regimen;
          wb.getRow(i+6).getCell('H').value = dataInscripcion.inscritos[i].numeroCelular;
          wb.getRow(i+6).getCell('I').value = dataInscripcion.inscritos[i].correo;
        }
        for (let j = 0; j < cantHeaders; j++) {
          wb.getRow(i+6).getCell(j+1).font = {
            name: 'Calibri',
            size: 14,
          }
          wb.getRow(i+6).getCell(j+1).alignment = { horizontal: 'center', vertical: 'middle'};
          wb.getRow(i+6).getCell(j+1).border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          }        
        }
      }
    }
    else{
      for (let i = 0; i < dataInscripcion.inscritos.length; i++) {
        if (dataInscripcion.votacionesResultado) {
          let votacionEncontrada = dataInscripcion.votacionesResultado.find((votacionRes)=>{return votacionRes.idInsPersona == dataInscripcion.inscritos.idInsPersona});
          wb.getRow(i+6).getCell(1).value = (votacionEncontrada ? votacionEncontrada.votos : 0);
          wb.getRow(i+6).getCell('B').value = dataInscripcion.inscritos[i].numeroDocumento;
          wb.getRow(i+6).getCell('C').value = dataInscripcion.inscritos[i].nombreCompleto;
          wb.getRow(i+6).getCell('D').value = datePipe.transform(dataInscripcion.inscritos[i].fechaNacimiento, 'dd/MM/yyyy');
          wb.getRow(i+6).getCell('E').value = dataInscripcion.inscritos[i].red;
          wb.getRow(i+6).getCell('F').value = dataInscripcion.inscritos[i].unidadOrganica;
          wb.getRow(i+6).getCell('G').value = dataInscripcion.inscritos[i].regimen;
          wb.getRow(i+6).getCell('H').value = dataInscripcion.inscritos[i].numeroCelular;
          wb.getRow(i+6).getCell('I').value = dataInscripcion.inscritos[i].correo;
        }
        else{
          wb.getRow(i+6).getCell('A').value = dataInscripcion.inscritos[i].numeroDocumento;
          wb.getRow(i+6).getCell('B').value = dataInscripcion.inscritos[i].nombreCompleto;
          wb.getRow(i+6).getCell('C').value = datePipe.transform(dataInscripcion.inscritos[i].fechaNacimiento, 'dd/MM/yyyy');
          wb.getRow(i+6).getCell('D').value = dataInscripcion.inscritos[i].red;
          wb.getRow(i+6).getCell('E').value = dataInscripcion.inscritos[i].unidadOrganica;
          wb.getRow(i+6).getCell('F').value = dataInscripcion.inscritos[i].regimen;
          wb.getRow(i+6).getCell('G').value = dataInscripcion.inscritos[i].numeroCelular;
          wb.getRow(i+6).getCell('H').value = dataInscripcion.inscritos[i].correo;
          if(dataExtraInscripcion.textoActivo){
            wb.getRow(i+6).getCell(cantHeaders).value = dataInscripcion.inscritos[i].descripcion;
          }
        }

        for (let j = 0; j < cantHeaders; j++) {
          wb.getRow(i+6).getCell(j+1).font = {
            name: 'Calibri',
            size: 14,
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
    // if(values.some(x => x.idLider != null)){
    //   let identificador = 0;
    //   // let position;
    //   for (let i = 0; i < values.length; i++) {
    //     if(values[i].idLider != identificador){
    //       identificador = values[i].idLider;
    //       // console.log(values[i].idLider)
    //       // console.log(wb.getRow(i+6).getCell(1).address,wb.getRow(values.filter((z)=>{return identificador == z.idLider}).length + i + 5).getCell(1).address)
    //       // console.log(values.filter((z)=>{return values[i].idLider == z.idLider}))
    //       wb.mergeCells(wb.getRow(i+6).getCell(1).address,wb.getRow(values.filter((z)=>{return identificador == z.idLider}).length + i + 5).getCell(1).address);
    //       if(esVotacion){
    //         wb.mergeCells(wb.getRow(i+6).getCell(2).address,wb.getRow(values.filter((z)=>{return identificador == z.idLider}).length + i + 5).getCell(2).address);
    //         if(esVotacion.find((votacionRes)=>{return votacionRes.idLider == identificador})){
    //           wb.getRow(i+6).getCell(2).value = esVotacion.find((votacionRes)=>{return votacionRes.idLider == identificador}).votos;
    //         }
    //         else{
    //           wb.getRow(i+6).getCell(2).value = 0;
    //         }
    //       }
    //       // if(identificador != values[0].idLider){
    //       //   let identity = (i + 1 == values.length ? i +1: i)
    //       //   wb.mergeCells(wb.getRow(position+6).getCell(1).address,wb.getRow(identity+5).getCell(1).address);
    //       // } //aqui poner el merge;
    //       // position = i;
    //     }
    //   }
    //   for (let i = 0; i < values.length; i++) {
    //     wb.getRow(i+6).getCell('A').value = values[i].descripcion;
    //     if(esVotacion){
    //       wb.getRow(i+6).getCell('C').value = values[i].numeroDocumento;
    //       wb.getRow(i+6).getCell('D').value = values[i].nombreCompleto;
    //       wb.getRow(i+6).getCell('E').value = values[i].regimen;
    //       wb.getRow(i+6).getCell('F').value = values[i].numeroCelular;
    //       wb.getRow(i+6).getCell('G').value = values[i].correo;
    //     }
    //     else{
    //       wb.getRow(i+6).getCell('B').value = values[i].numeroDocumento;
    //       wb.getRow(i+6).getCell('C').value = values[i].nombreCompleto;
    //       wb.getRow(i+6).getCell('D').value = values[i].regimen;
    //       wb.getRow(i+6).getCell('E').value = values[i].numeroCelular;
    //       wb.getRow(i+6).getCell('F').value = values[i].correo;
    //     }
    //     for (let j = 0; j < cantHeaders; j++) {
    //       wb.getRow(i+6).getCell(j+1).font = {
    //         name: 'Calibri',
    //         size: 14,
    //       }
    //       wb.getRow(i+6).getCell(j+1).alignment = { horizontal: 'center', vertical: 'middle'};
    //       wb.getRow(i+6).getCell(j+1).border = {
    //         top: {style:'thin'},
    //         left: {style:'thin'},
    //         bottom: {style:'thin'},
    //         right: {style:'thin'}
    //       }        
    //     }
    //   }
    // }
    // else{
    //   for (let i = 0; i < values.length; i++) {
    //     wb.getRow(i+6).getCell('A').value = values[i].numeroDocumento;
    //     wb.getRow(i+6).getCell('B').value = values[i].nombreCompleto;
    //     wb.getRow(i+6).getCell('C').value = values[i].regimen;
    //     wb.getRow(i+6).getCell('D').value = values[i].numeroCelular;
    //     wb.getRow(i+6).getCell('E').value = values[i].correo;
    //     for (let j = 0; j < cantHeaders; j++) {
    //       wb.getRow(i+6).getCell(j+1).font = {
    //         name: 'Calibri',
    //         size: 16,
    //       }
    //       wb.getRow(i+6).getCell(j+1).border = {
    //         top: {style:'thin'},
    //         left: {style:'thin'},
    //         bottom: {style:'thin'},
    //         right: {style:'thin'}
    //       }        
    //     }
    //   }
    // }
  }
}
