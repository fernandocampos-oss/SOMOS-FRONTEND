import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';

export const imgBase64 = "data:image/png;base64,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";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelTrabajadorService {
  fileName: string = "GDR_";
  filaInicioFooter: number = 0;

  constructor() { }

  exportExcelTrabajador(trabajador: any, jefe: any, listPrioridades: any[]) {
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('FORMATO GR');

    //Add Image
    let myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });
    worksheet.mergeCells('A1:A2');
    worksheet.addImage(myLogoImage, 'A1:A2');
    let logo = worksheet.getCell('A1');
    logo.border = {
      bottom: { style: 'thin' }
    };

    worksheet.mergeCells('B1:L2');
    let spaceBlank = worksheet.getCell('B1');
    spaceBlank.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    worksheet.mergeCells('A3', 'L4');
    let titleRow = worksheet.getCell('A3');
    titleRow.value = 'FORMATO PARA LA GESTIÓN DEL RENDIMIENTO';
    titleRow.font = {
      name: 'Calibri',
      size: 10,
      // underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row
    worksheet.addRow([]);

    worksheet.mergeCells('F6', 'H6');
    let titleEvaluador = worksheet.getCell('F6');
    titleEvaluador.value = 'DNI EVALUADOR/A';
    titleEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' }
    };
    titleEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('I6:L6');
    let titleEvaluadorResult = worksheet.getCell('I6');
    titleEvaluadorResult.value = jefe.numeroDocumento;
    titleEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row 
    worksheet.addRow([]);

    let titleEntidad = worksheet.getCell('A8');
    titleEntidad.value = 'NOMBRE DE LA ENTIDAD';
    titleEntidad.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleEntidad.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleEntidad.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEntidad.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('B8:E8');
    let titleEntidadResult = worksheet.getCell('B8');
    titleEntidadResult.value = 'SEGURO SOCIAL DE SALUD - ESSALUD';
    titleEntidadResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleEntidadResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEntidadResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('F8', 'H8');
    let titleFechaMeta = worksheet.getCell('F8');
    titleFechaMeta.value = 'FECHA DE DEFINICIÓN DE METAS';
    titleFechaMeta.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleFechaMeta.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleFechaMeta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFechaMeta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('I8:L8');
    let titleFechaMetaResult = worksheet.getCell('I8');
    const datePipe = new DatePipe('en-US');
    titleFechaMetaResult.value = datePipe.transform(listPrioridades[0].fechaAsignacionPrioridad, 'dd/MM/yyyy');
    titleFechaMetaResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleFechaMetaResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFechaMetaResult.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row
    worksheet.addRow([]);

    worksheet.mergeCells('A10', 'D10');
    let titleServidorEvaluado = worksheet.getCell('A10');
    titleServidorEvaluado.value = 'SERVIDOR/A EVALUADO/A';
    titleServidorEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleServidorEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleServidorEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleServidorEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E10:L10');
    let titleServidorEvaluador = worksheet.getCell('E10');
    titleServidorEvaluador.value = 'SERVIDOR/A EVALUADOR/A';
    titleServidorEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleServidorEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleServidorEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleServidorEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    //EVALUADO ----------------------------------------------------------------
    worksheet.mergeCells('A11', 'A11');
    let titleApellidos = worksheet.getCell('A11');
    titleApellidos.value = 'APELLIDOS Y NOMBRES';
    titleApellidos.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleApellidos.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleApellidos.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleApellidos.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('B11:D11');
    let titleApellidosResult = worksheet.getCell('B11');
    titleApellidosResult.value = trabajador.nombre;
    titleApellidosResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleApellidosResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleApellidosResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A12', 'A12');
    let titlePuesto = worksheet.getCell('A12');
    titlePuesto.value = 'PUESTO';
    titlePuesto.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePuesto.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePuesto.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuesto.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('B12:D12');
    let titlePuestoResult = worksheet.getCell('B12');
    titlePuestoResult.value = trabajador.cargo;
    titlePuestoResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titlePuestoResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuestoResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A13', 'A13');
    let titleSegmentoEvaluado = worksheet.getCell('A13');
    titleSegmentoEvaluado.value = 'SEGMENTO';
    titleSegmentoEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleSegmentoEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleSegmentoEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSegmentoEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('B13:D13');
    let titleSegmentoEvaluadoResult = worksheet.getCell('B13');
    titleSegmentoEvaluadoResult.value = trabajador.segmento;
    titleSegmentoEvaluadoResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleSegmentoEvaluadoResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSegmentoEvaluadoResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A14', 'A14');
    let titleUnidadEvaluado = worksheet.getCell('A14');
    titleUnidadEvaluado.value = 'ÓRGANO O UNIDAD ORGÁNICA';
    titleUnidadEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleUnidadEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleUnidadEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleUnidadEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('B14:D14');
    let titleUnidadEvaluadoResult = worksheet.getCell('B14');
    titleUnidadEvaluadoResult.value = trabajador.codUnidad;
    titleUnidadEvaluadoResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleUnidadEvaluadoResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleUnidadEvaluadoResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A15', 'A15');
    let titleFirmaEvaluado = worksheet.getCell('A15');
    titleFirmaEvaluado.value = 'FIRMA (a la definición de la meta)';
    titleFirmaEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleFirmaEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleFirmaEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFirmaEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('B15:D15');
    let titleFirmaEvaluadoResult = worksheet.getCell('B15');
    titleFirmaEvaluadoResult.value = '';
    titleFirmaEvaluadoResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleFirmaEvaluadoResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFirmaEvaluadoResult.alignment = { vertical: 'middle', horizontal: 'center' };

    //SERVIDOR/A EVALUADOR/A ----------------------------------------------------------------
    worksheet.mergeCells('E11', 'F11');
    let titleApellidosEvaluador = worksheet.getCell('E11');
    titleApellidosEvaluador.value = 'APELLIDOS Y NOMBRES';
    titleApellidosEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleApellidosEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleApellidosEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleApellidosEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('G11:L11');
    let titleApellidosEvaluadorResult = worksheet.getCell('G11');
    titleApellidosEvaluadorResult.value = jefe.nombre;
    titleApellidosEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleApellidosEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleApellidosEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E12', 'F12');
    let titlePuestoEvaluador = worksheet.getCell('E12');
    titlePuestoEvaluador.value = 'PUESTO';
    titlePuestoEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePuestoEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePuestoEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuestoEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('G12:L12');
    let titlePuestoEvaluadorResult = worksheet.getCell('G12');
    titlePuestoEvaluadorResult.value = jefe.cargo;
    titlePuestoEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titlePuestoEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuestoEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E13', 'F13');
    let titleSegmentoEvaluador = worksheet.getCell('E13');
    titleSegmentoEvaluador.value = 'SEGMENTO';
    titleSegmentoEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleSegmentoEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleSegmentoEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSegmentoEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('G13:L13');
    let titleSegmentoEvaluadorResult = worksheet.getCell('G13');
    titleSegmentoEvaluadorResult.value = jefe.segmento;
    titleSegmentoEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleSegmentoEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSegmentoEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E14', 'F14');
    let titleUnidadEvaluador = worksheet.getCell('E14');
    titleUnidadEvaluador.value = 'ÓRGANO O UNIDAD ORGÁNICA';
    titleUnidadEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleUnidadEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleUnidadEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleUnidadEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('G14:L14');
    let titleUnidadEvaluadorResult = worksheet.getCell('G14');
    titleUnidadEvaluadorResult.value = jefe.codUnidad;
    titleUnidadEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleUnidadEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleUnidadEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E15', 'F15');
    let titleFirmaEvaluador = worksheet.getCell('E15');
    titleFirmaEvaluador.value = 'FIRMA (a la definición de la meta)';
    titleFirmaEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleFirmaEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleFirmaEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFirmaEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('G15:L15');
    let titleFirmaEvaluadorResult = worksheet.getCell('G15');
    titleFirmaEvaluadorResult.value = '';
    titleFirmaEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleFirmaEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFirmaEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row
    worksheet.addRow([]);

    //ETAPA DE PLANIFICACIÓN --------------------------------------------------------------
    worksheet.mergeCells('A17', 'G17');
    let titlePlanificacion = worksheet.getCell('A17');
    titlePlanificacion.value = 'ETAPA DE PLANIFICACIÓN';
    titlePlanificacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titlePlanificacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titlePlanificacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePlanificacion.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('H17', 'J17');
    let titleSeguimiento = worksheet.getCell('H17');
    titleSeguimiento.value = 'ETAPA DE SEGUIMIENTO';
    titleSeguimiento.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleSeguimiento.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleSeguimiento.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSeguimiento.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('K17', 'L17');
    let titleEvaluacion = worksheet.getCell('K17');
    titleEvaluacion.value = 'ETAPA DE EVALUACIÓN';
    titleEvaluacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleEvaluacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleEvaluacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEvaluacion.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A18', 'A19');
    let titlePrioridad = worksheet.getCell('A18');
    titlePrioridad.value = 'PRIORIDADES ANUALES DE GESTIÓN DEL ÓRGANO O UNIDAD ORGÁNICA';
    titlePrioridad.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePrioridad.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePrioridad.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePrioridad.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells('B18', 'G18');
    let titleMeta = worksheet.getCell('B18');
    titleMeta.value = 'META';
    titleMeta.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleMeta.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleMeta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleMeta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('H18', 'J18');
    let titleSubSeguimiento = worksheet.getCell('H18');
    titleSubSeguimiento.value = 'SEGUIMIENTO Y RETROALIMENTACIÓN';
    titleSubSeguimiento.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleSubSeguimiento.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleSubSeguimiento.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSubSeguimiento.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('B19', 'B19');
    let titleIndicador = worksheet.getCell('B19');
    titleIndicador.value = 'INDICADOR / PRODUCTO';
    titleIndicador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleIndicador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleIndicador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleIndicador.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    let titleValorMeta = worksheet.getCell('C19');
    titleValorMeta.value = 'VALOR ESPERADO';
    titleValorMeta.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleValorMeta.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleValorMeta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleValorMeta.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    let titlePeso = worksheet.getCell('D19');
    titlePeso.value = 'PESO';
    titlePeso.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePeso.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePeso.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePeso.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E19', 'E19');
    let titleEvidencia = worksheet.getCell('E19');
    titleEvidencia.value = 'EVIDENCIA';
    titleEvidencia.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleEvidencia.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleEvidencia.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEvidencia.alignment = { vertical: 'middle', horizontal: 'center' };

    // worksheet.mergeCells('F19', 'F19');
    let titlePlazos = worksheet.getCell('F19');
    titlePlazos.value = 'PLAZOS';
    titlePlazos.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePlazos.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePlazos.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePlazos.alignment = { vertical: 'middle', horizontal: 'center' };

    let titleFormula = worksheet.getCell('G19');
    titleFormula.value = 'TIPO DE FÓRMULA*';
    titleFormula.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleFormula.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleFormula.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFormula.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells('H19', 'J19');
    let titleComentario = worksheet.getCell('H19');
    titleComentario.value = 'COMENTARIOS';
    titleComentario.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleComentario.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleComentario.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleComentario.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('K18', 'K19');
    let titleLogro = worksheet.getCell('K19');
    titleLogro.value = 'LOGRO FINAL POR META';
    titleLogro.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleLogro.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleLogro.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleLogro.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells('L18', 'L19');
    let titlePuntuacion = worksheet.getCell('L18');
    titlePuntuacion.value = 'PUNTUACIÓN POR META';
    titlePuntuacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePuntuacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePuntuacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuntuacion.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    //iterativo
    let contadorFilaMerge = 20;
    for (let i = 0; i < listPrioridades.length; i++) {

      let contadorActividad = 0;
      for (let j = 0; j < listPrioridades[i].listIndicador.length; j++) {
        let numero = 0;
        numero = listPrioridades[i].listIndicador[j].listEvidencia.length;
        contadorActividad += numero;
      }

      //actividad
      worksheet.mergeCells(worksheet.getRow(contadorFilaMerge).getCell(1).address, worksheet.getRow(contadorFilaMerge + contadorActividad - 1).getCell(1).address);
      worksheet.getRow(contadorFilaMerge).getCell(1).value = listPrioridades[i].prioridadNombre;
      worksheet.getRow(contadorFilaMerge).getCell(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      worksheet.getRow(contadorFilaMerge).getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getColumn(1).width = 45;

      //fila inicio para footer
      this.filaInicioFooter = contadorFilaMerge + contadorActividad - 1;

      for (let j = 0; j < listPrioridades[i].listIndicador.length; j++) {
        worksheet.mergeCells(worksheet.getRow(contadorFilaMerge).getCell(2).address, worksheet.getRow(contadorFilaMerge + listPrioridades[i].listIndicador[j].listEvidencia.length - 1).getCell(2).address);
        worksheet.getRow(contadorFilaMerge).getCell(2).value = listPrioridades[i].listIndicador[j].nombreIndicador;
        worksheet.getRow(contadorFilaMerge).getCell(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        worksheet.getRow(contadorFilaMerge).getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getColumn(2).width = 35;

        worksheet.mergeCells(worksheet.getRow(contadorFilaMerge).getCell(3).address, worksheet.getRow(contadorFilaMerge + listPrioridades[i].listIndicador[j].listEvidencia.length - 1).getCell(3).address);
        worksheet.getRow(contadorFilaMerge).getCell(3).value = listPrioridades[i].listIndicador[j].valorMeta;
        worksheet.getRow(contadorFilaMerge).getCell(3).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        worksheet.getRow(contadorFilaMerge).getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

        worksheet.mergeCells(worksheet.getRow(contadorFilaMerge).getCell(4).address, worksheet.getRow(contadorFilaMerge + listPrioridades[i].listIndicador[j].listEvidencia.length - 1).getCell(4).address);
        worksheet.getRow(contadorFilaMerge).getCell(4).value = listPrioridades[i].listIndicador[j].peso + "%";
        worksheet.getRow(contadorFilaMerge).getCell(4).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        worksheet.getRow(contadorFilaMerge).getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

        this.formatoEvidencias(worksheet, listPrioridades[i].listIndicador[j].listEvidencia, contadorFilaMerge)
        contadorFilaMerge += listPrioridades[i].listIndicador[j].listEvidencia.length;
      }
    }

    //footer
    //RESULTADOS FINALES--------------------------------------------------------------
    worksheet.mergeCells(`A${this.filaInicioFooter + 2}:L${this.filaInicioFooter + 2}`);
    let resultados = worksheet.getCell(`A${this.filaInicioFooter + 2}`);
    resultados.value = 'RESULTADOS FINALES';
    resultados.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    resultados.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    resultados.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    resultados.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`A${this.filaInicioFooter + 3}:A${this.filaInicioFooter + 4}`);
    let puntuacionFinal = worksheet.getCell(`A${this.filaInicioFooter + 3}`);
    puntuacionFinal.value = 'PUNTUACIÓN FINAL';
    puntuacionFinal.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    puntuacionFinal.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    puntuacionFinal.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    puntuacionFinal.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`B${this.filaInicioFooter + 3}:B${this.filaInicioFooter + 4}`);
    let calificacion = worksheet.getCell(`B${this.filaInicioFooter + 3}`);
    calificacion.value = 'CALIFICACIÓN';
    calificacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    calificacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    calificacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    calificacion.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`C${this.filaInicioFooter + 3}:I${this.filaInicioFooter + 4}`);
    let feetback = worksheet.getCell(`C${this.filaInicioFooter + 3}`);
    feetback.value = 'RETROALIMENTACIÓN FINAL Y PLAN DE MEJORA';
    feetback.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    feetback.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    feetback.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    feetback.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`J${this.filaInicioFooter + 3}:L${this.filaInicioFooter + 4}`);
    let meet = worksheet.getCell(`J${this.filaInicioFooter + 3}`);
    meet.value = 'FECHA DE REUNIÓN DE RETROALIMENTACIÓN';
    meet.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    meet.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    meet.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    meet.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells(`A${this.filaInicioFooter + 5}:A${this.filaInicioFooter + 6}`);
    let puntuacion = worksheet.getCell(`A${this.filaInicioFooter + 5}`);
    puntuacion.value = '30.00';
    puntuacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    puntuacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f2f2f2' },
      bgColor: { argb: 'ffffff' }
    };
    puntuacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    puntuacion.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells(`B${this.filaInicioFooter + 5}:B${this.filaInicioFooter + 6}`);
    let calificacionFinal = worksheet.getCell(`B${this.filaInicioFooter + 5}`);
    calificacionFinal.value = 'Rendimiento Sujeto a Observación';
    calificacionFinal.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    calificacionFinal.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f2f2f2' },
      bgColor: { argb: 'ffffff' }
    };
    calificacionFinal.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    calificacionFinal.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells(`C${this.filaInicioFooter + 5}:D${this.filaInicioFooter + 5}`);
    let capacitacion = worksheet.getCell(`C${this.filaInicioFooter + 5}`);
    capacitacion.value = 'Capacitaciones:';
    capacitacion.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    capacitacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    capacitacion.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`E${this.filaInicioFooter + 5}:I${this.filaInicioFooter + 5}`);
    let capacitacionRespuesta = worksheet.getCell(`E${this.filaInicioFooter + 5}`);
    capacitacionRespuesta.value = '';
    capacitacionRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    capacitacionRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    capacitacionRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`C${this.filaInicioFooter + 6}:D${this.filaInicioFooter + 6}`);
    let recomendaciones = worksheet.getCell(`C${this.filaInicioFooter + 6}`);
    recomendaciones.value = 'Recomendaciones:';
    recomendaciones.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    recomendaciones.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    recomendaciones.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`E${this.filaInicioFooter + 6}:I${this.filaInicioFooter + 6}`);
    let recomendacionRespuesta = worksheet.getCell(`E${this.filaInicioFooter + 6}`);
    recomendacionRespuesta.value = '';
    recomendacionRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    recomendacionRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    recomendacionRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`J${this.filaInicioFooter + 5}:L${this.filaInicioFooter + 6}`);
    let meetRespuesta = worksheet.getCell(`J${this.filaInicioFooter + 5}`);
    meetRespuesta.value = '';
    meetRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    meetRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    meetRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };

    //FIRMAS DE LOS RESULTADOS FINALES --------------------------------------------------------------
    worksheet.mergeCells(`A${this.filaInicioFooter + 7}:L${this.filaInicioFooter + 7}`);
    let firmaFinal = worksheet.getCell(`A${this.filaInicioFooter + 7}`);
    firmaFinal.value = 'FIRMAS DE LOS RESULTADOS FINALES';
    firmaFinal.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    firmaFinal.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    firmaFinal.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaFinal.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`A${this.filaInicioFooter + 8}:A${this.filaInicioFooter + 9}`);
    let firmaEvaluado = worksheet.getCell(`A${this.filaInicioFooter + 8}`);
    firmaEvaluado.value = 'FIRMA EVALUADO/A';
    firmaEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    firmaEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    firmaEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`B${this.filaInicioFooter + 8}:D${this.filaInicioFooter + 9}`);
    let firmaEvaluadoRespuesta = worksheet.getCell(`B${this.filaInicioFooter + 8}`);
    firmaEvaluadoRespuesta.value = '';
    firmaEvaluadoRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    firmaEvaluadoRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaEvaluadoRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`E${this.filaInicioFooter + 8}:E${this.filaInicioFooter + 9}`);
    let firmaEvaluador = worksheet.getCell(`E${this.filaInicioFooter + 8}`);
    firmaEvaluador.value = 'FIRMA EVALUADOR/A';
    firmaEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    firmaEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    firmaEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`F${this.filaInicioFooter + 8}:L${this.filaInicioFooter + 9}`);
    let firmaEvaluadorRespuesta = worksheet.getCell(`F${this.filaInicioFooter + 8}`);
    firmaEvaluadorRespuesta.value = '';
    firmaEvaluadorRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    firmaEvaluadorRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaEvaluadorRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };


    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE, });
      fs.saveAs(blob, this.fileName + '_' + trabajador.nombre + '_' + new Date().getTime() + EXCEL_EXTENSION);
    });

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

      // wb.getRow(i + position).getCell('D').value = datePipe.transform(listEvidencia[i].plazo, 'dd/MM/yyyy - hh:mm a');
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
