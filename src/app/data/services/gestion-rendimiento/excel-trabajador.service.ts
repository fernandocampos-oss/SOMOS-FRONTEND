import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Workbook, Worksheet, Borders, Alignment } from 'exceljs';
import * as fs from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelTrabajadorService {
  fileName: string = "GDR_";
  filaInicioFooter: number = 0;

  private readonly BORDER_THIN: Partial<Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  private readonly ALIGNMENT_CENTER: Partial<Alignment> = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true
  };

  constructor(private http: HttpClient) { }

  async exportExcelTrabajador(
    trabajador: any, 
    jefe: any, 
    listPrioridades: any[], 
    reunionData?: { asistio: string, fecha: string },
    resultadosFinales?: { rendimientoDistinguido: string, accionesCapacitacion: string, otrasAcciones: string, fechaReunion: string, permanenciaSeisMeses: string }
  ) {
    const datePipe = new DatePipe('en-US');
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

      // SECCIÓN 3 - PRIORIDADES, INDICADORES Y EVIDENCIAS (desde fila 21)
      let filaActual = 21;
      let numeroPrioridad = 1;
      
      for (const prioridad of listPrioridades) {
        const listIndicadores = prioridad.listIndicador || [];
        
        // Calcular total de filas para esta prioridad
        let totalFilasPrioridad = 0;
        for (const indicador of listIndicadores) {
          const numEvidencias = (indicador.listEvidencia || []).length;
          totalFilasPrioridad += numEvidencias > 0 ? numEvidencias : 1;
        }
        if (totalFilasPrioridad === 0) totalFilasPrioridad = 1;
        
        const filaInicioPrioridad = filaActual;
        
        for (const indicador of listIndicadores) {
          const listEvidencias = indicador.listEvidencia || [];
          const numEvidencias = listEvidencias.length > 0 ? listEvidencias.length : 1;
          const filaInicioIndicador = filaActual;
          
          if (listEvidencias.length > 0) {
            // Llenar cada evidencia en su fila
            for (const evidencia of listEvidencias) {
              // Columna H: Descripción evidencia
              this.setCellValue(worksheet, filaActual, 'H', evidencia.descripcion);
              
              // Columna I: Plazo
              const plazoFormateado = evidencia.plazo ? datePipe.transform(evidencia.plazo, 'dd/MM/yyyy') : '-';
              this.setCellValue(worksheet, filaActual, 'I', plazoFormateado);
              
              // Columna J: Estado (Logrado, En Proceso, etc.)
              this.setCellValue(worksheet, filaActual, 'J', evidencia.estadoDropdown || '-');
              
              // Columna K: Comentario adicional (K-L mergeadas en plantilla)
              this.setCellValueMerged(worksheet, filaActual, 'K', evidencia.comentarioAdicional || '-');
              
              filaActual++;
            }
          } else {
            // Si no hay evidencias, dejar fila vacía para las columnas de evidencia
            this.setCellValue(worksheet, filaActual, 'H', '-');
            this.setCellValue(worksheet, filaActual, 'I', '-');
            this.setCellValue(worksheet, filaActual, 'J', '-');
            this.setCellValueMerged(worksheet, filaActual, 'K', '-');
            filaActual++;
          }
          
          // Columna D: Indicador/Producto
          this.setCellValue(worksheet, filaInicioIndicador, 'D', indicador.nombreIndicador || '-');
          if (numEvidencias > 1) {
            worksheet.mergeCells(`D${filaInicioIndicador}:D${filaInicioIndicador + numEvidencias - 1}`);
          }
          
          // Columna E: Sentido del indicador
          this.setCellValue(worksheet, filaInicioIndicador, 'E', indicador.sentido || '-');
          if (numEvidencias > 1) {
            worksheet.mergeCells(`E${filaInicioIndicador}:E${filaInicioIndicador + numEvidencias - 1}`);
          }
          
          // Columna F: Valor esperado (meta) - con % si es porcentaje según codTipoValorMeta
          const esPorcentaje = ['03', '04', '06'].includes(indicador.codTipoValorMeta);
          const valorMetaFormateado = indicador.valorMeta != null 
            ? (esPorcentaje ? `${indicador.valorMeta}%` : indicador.valorMeta) 
            : '-';
          this.setCellValue(worksheet, filaInicioIndicador, 'F', valorMetaFormateado);
          if (numEvidencias > 1) {
            worksheet.mergeCells(`F${filaInicioIndicador}:F${filaInicioIndicador + numEvidencias - 1}`);
          }
          
          // Columna G: Peso (siempre con %)
          const pesoFormateado = indicador.peso != null ? `${indicador.peso}%` : '-';
          this.setCellValue(worksheet, filaInicioIndicador, 'G', pesoFormateado);
          if (numEvidencias > 1) {
            worksheet.mergeCells(`G${filaInicioIndicador}:G${filaInicioIndicador + numEvidencias - 1}`);
          }
          
          // Columna M: Valor alcanzado - con % si es porcentaje según codTipoValorMeta
          const valorAlcanzadoFormateado = indicador.valorAlcanzado != null 
            ? (esPorcentaje ? `${indicador.valorAlcanzado}%` : indicador.valorAlcanzado) 
            : '-';
          this.setCellValue(worksheet, filaInicioIndicador, 'M', valorAlcanzadoFormateado);
          if (numEvidencias > 1) {
            worksheet.mergeCells(`M${filaInicioIndicador}:M${filaInicioIndicador + numEvidencias - 1}`);
          }
          
          // Columna N: Puntaje por meta
          this.setCellValue(worksheet, filaInicioIndicador, 'N', indicador.puntajePorMeta ?? '-');
          if (numEvidencias > 1) {
            worksheet.mergeCells(`N${filaInicioIndicador}:N${filaInicioIndicador + numEvidencias - 1}`);
          }
        }
        
        // Columna B: Número de prioridad
        this.setCellValue(worksheet, filaInicioPrioridad, 'B', numeroPrioridad);
        if (totalFilasPrioridad > 1) {
          worksheet.mergeCells(`B${filaInicioPrioridad}:B${filaInicioPrioridad + totalFilasPrioridad - 1}`);
        }
        
        // Columna C: Prioridad nombre
        this.setCellValue(worksheet, filaInicioPrioridad, 'C', prioridad.prioridadNombre || '-');
        if (totalFilasPrioridad > 1) {
          worksheet.mergeCells(`C${filaInicioPrioridad}:C${filaInicioPrioridad + totalFilasPrioridad - 1}`);
        }
        
        numeroPrioridad++;
      }

      // Ocultar filas vacías en el rango 21-35 (rango reservado para prioridades)
      const FILA_FIN_PRIORIDADES = 35;
      for (let fila = filaActual; fila <= FILA_FIN_PRIORIDADES; fila++) {
        worksheet.getRow(fila).hidden = true;
      }

      // Las filas de resultados se mantienen en posición fija (40, 41, 42)
      const filaResultados = 40;
      const filaOtrasAcciones = 41;
      const filaJuntaDirectivos = 42;

      // SECCIÓN 3 - RESULTADOS FINALES
      // Calcular puntuación final (suma de todos los puntajes de indicadores)
      let puntuacionFinal = 0;
      for (const prioridad of listPrioridades) {
        for (const indicador of (prioridad.listIndicador || [])) {
          if (indicador.puntajePorMeta != null && !isNaN(indicador.puntajePorMeta)) {
            puntuacionFinal += parseFloat(indicador.puntajePorMeta);
          }
        }
      }
      
      // Calcular calificación basada en el algoritmo completo
      let calificacion = '-';
      const segmento = trabajador.segmento?.toUpperCase() || '';
      const asistioReunion = reunionData?.asistio;
      const permanenciaSeisMeses = resultadosFinales?.permanenciaSeisMeses;
      const rendimientoDistinguido = resultadosFinales?.rendimientoDistinguido;

      // 1. Si no asistió a reunión de metas → Desaprobado
      if (asistioReunion === 'N') {
        calificacion = 'Desaprobado';
      }
      // 2. Si tiene menos de 6 meses → No corresponde calificación
      else if (permanenciaSeisMeses === 'NO') {
        calificacion = 'No corresponde calificación';
      }
      // 3. Si no hay puntaje válido
      else if (puntuacionFinal <= 0) {
        calificacion = '-';
      }
      // 4. Rendimiento Distinguido: puntaje >= 100 Y opción "Sí" seleccionada
      else if (rendimientoDistinguido === 'Si' && puntuacionFinal >= 100) {
        calificacion = 'Rendimiento Distinguido';
      }
      // 5. Buen rendimiento para DIRECTIVO: puntaje >= 70
      else if (segmento === 'DIRECTIVO' && puntuacionFinal >= 70) {
        calificacion = 'Buen rendimiento';
      }
      // 6. Buen rendimiento para otros segmentos: puntaje >= 60
      else if (puntuacionFinal >= 60 && ['MANDO MEDIO', 'EJECUTOR', 'OPERADOR Y ASISTENCIA'].includes(segmento)) {
        calificacion = 'Buen rendimiento';
      }
      // 7. Caso contrario → Rendimiento sujeto a observación
      else {
        calificacion = 'Rendimiento sujeto a observación';
      }
      
      // Fila dinámica: Permanencia en el puesto (B-C)
      const permanenciaTexto = resultadosFinales?.permanenciaSeisMeses === 'NO' 
        ? 'Tiene menos de 6 meses desempeñando el puesto que es objeto de evaluación'
        : 'Tiene 6 meses o más desempeñando el puesto que es objeto de evaluación';
      this.setCellValueMerged(worksheet, filaResultados, 'B', permanenciaTexto);
      
      // Fila dinámica: Puntuación Final (D-F), Calificación (G-H), Acciones Capacitación (J-L), Fecha Reunión (M-N)
      this.setCellValueMerged(worksheet, filaResultados, 'D', puntuacionFinal.toFixed(2));
      this.setCellValueMerged(worksheet, filaResultados, 'G', calificacion);
      this.setCellValueMerged(worksheet, filaResultados, 'J', resultadosFinales?.accionesCapacitacion || '-');
      
      // Fecha de reunión de retroalimentación
      const fechaReunionStr = resultadosFinales?.fechaReunion 
        ? datePipe.transform(resultadosFinales.fechaReunion, 'dd/MM/yyyy') || '-'
        : '-';
      this.setCellValueMerged(worksheet, filaResultados, 'M', fechaReunionStr);
      
      // Fila dinámica: Otras Acciones (J-L)
      this.setCellValueMerged(worksheet, filaOtrasAcciones, 'J', resultadosFinales?.otrasAcciones || '-');
      
      // Fila dinámica: Junta Directivos Sí/No (B-C)
      const juntaDirectivos = resultadosFinales?.rendimientoDistinguido;
      const juntaStr = (juntaDirectivos && juntaDirectivos !== '[Seleccione]') ? juntaDirectivos : '-';
      this.setCellValueMerged(worksheet, filaJuntaDirectivos, 'B', juntaStr);

      // Generar y guardar el archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: EXCEL_TYPE });
      fs.saveAs(blob, this.fileName + '_' + trabajador.nombre + '_' + new Date().getTime() + EXCEL_EXTENSION);
    } catch (error) {
      console.error('Error al generar Excel desde plantilla:', error);
    }
  }

  /**
   * Helper para establecer valor y formato a una celda
   */
  private setCellValue(worksheet: Worksheet, row: number, col: string, value: any): void {
    const cell = worksheet.getRow(row).getCell(col);
    cell.value = value;
    cell.alignment = this.ALIGNMENT_CENTER;
    cell.border = this.BORDER_THIN;
  }

  /**
   * Helper para establecer valor en celda mergeada (sin modificar bordes para no romper el merge)
   */
  private setCellValueMerged(worksheet: Worksheet, row: number, col: string, value: any): void {
    const cell = worksheet.getRow(row).getCell(col);
    cell.value = value;
    cell.alignment = this.ALIGNMENT_CENTER;
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