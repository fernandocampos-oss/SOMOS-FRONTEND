import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
import * as fs from 'file-saver';

const PDF_TYPE = 'application/pdf';
const PDF_EXTENSION = '.pdf';

@Injectable({
  providedIn: 'root'
})
export class PdfTrabajadorService {

  fileName = 'GDR_';

  async exportPdfTrabajador(
    trabajador: any,
    jefe: any,
    listPrioridades: any[],
    reunionData?: { asistio: string, fecha: string },
    resultadosFinales?: {
      rendimientoDistinguido: string,
      accionesCapacitacion: string,
      otrasAcciones: string,
      fechaReunion: string,
      permanenciaSeisMeses: string
    }
  ) {
    const datePipe = new DatePipe('en-US');
    try {
      // Cargar plantilla PDF desde assets
      const templateUrl = `assets/docs/modeloGDR.pdf?v=${new Date().getTime()}`;
      const response = await fetch(templateUrl, { cache: 'no-store' });
      const templateArrayBuffer = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(templateArrayBuffer);
      const pages = pdfDoc.getPages();
      const page = pages[0];

      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const { width, height } = page.getSize();

      // Helper para convertir coordenadas tipo Excel (y desde arriba) a PDF (y desde abajo)
      const y = (yFromTop: number) => height - yFromTop;

      // ─── SECCIÓN 1: DATOS DEL EVALUADO ───────────────────────────────────────
      this.drawText(page, trabajador.numeroDocumento || '-', 124, y(131), helvetica, 6);
      this.drawText(page, trabajador.nombre || '-',          124, y(141), helvetica, 5);
      this.drawText(page, trabajador.cargo || '-',           124, y(151), helvetica, 6);
      this.drawText(page, trabajador.segmento || '-',        124, y(161), helvetica, 6);
      this.drawText(page, trabajador.codUnidad || '-',       124, y(175), helvetica, 6);

      // ─── SECCIÓN 1: DATOS DEL EVALUADOR ──────────────────────────────────────
      this.drawText(page, jefe.numeroDocumento || '-', 406, y(131), helvetica, 6);
      this.drawText(page, jefe.nombre || '-',           406, y(141), helvetica, 5);
      this.drawText(page, jefe.cargo || '-',            406, y(151), helvetica, 6);
      this.drawText(page, jefe.segmento || '-',         406, y(161), helvetica, 6);
      this.drawText(page, jefe.codUnidad || '-',        406, y(175), helvetica, 6);

      // ─── SECCIÓN 2: REUNIÓN ESTABLECIMIENTO DE METAS ─────────────────────────
      const asistioTexto = reunionData?.asistio === 'S' ? 'Sí' : reunionData?.asistio === 'N' ? 'No' : 'Sí';
      this.drawText(page, asistioTexto,             160, y(278), helvetica, 8);
      this.drawText(page, reunionData?.fecha || '-', 302, y(278), helvetica, 8);

      // ─── SECCIÓN 3: TABLA DINÁMICA DE PRIORIDADES ────────────────────────────
      // Coordenadas X: borde izquierdo de cada columna
      const TCOL = {
        left:     57,   // borde izquierdo de la tabla
        num:      57,   // Nº
        prio:     63,   // Prioridad
        indic:    121,   // Indicador / Producto
        sentido: 174,   // Sentido del Indicador
        meta:    211,   // Valor Esperado (Meta)
        peso:    243,   // Peso
        evid:    276,   // Evidencia
        plazo:   323,   // Plazos
        coment:  373,   // Comentarios (Seguimiento)
        alcanz:  491,   // Valor Alcanzado
        puntaje: 525,   // Puntaje / Meta
        right:   556,   // borde derecho de la tabla
      };

      const PADDING    = 2;     // padding interno de texto
      const ROW_H_MIN  = 14;    // altura mínima de fila
      const LINE_H     = 9;     // altura de una línea de texto (size 6 + interlineado)
      const FONT_MAX   = 6;     // tamaño de fuente máximo en tabla
      const FONT_MIN   = 4.5;   // tamaño de fuente mínimo antes de expandir celda
      const BORDER     = rgb(0.2, 0.2, 0.2);
      const BORDER_THICK = 0.4;

      // Y de inicio de la tabla (desde arriba del PDF)
      let tableTopY = 307;
      let curY = tableTopY;

      // ── Helpers ────────────────────────────────────────────────────────────

      // Calcula el font size óptimo: reduce hasta FONT_MIN para que el texto entre en 1 línea
      const fitFontSize = (text: string, cellW: number, font: PDFFont): number => {
        text = this.sanitizePdfText(text);
        const usableW = cellW - PADDING * 2;
        for (let size = FONT_MAX; size >= FONT_MIN; size -= 0.5) {
          if (font.widthOfTextAtSize(text, size) <= usableW) return size;
        }
        return FONT_MIN;
      };

      // Calcula cuántas líneas ocupa el texto con un font size y ancho dados
      const numLines = (text: string, cellW: number, font: PDFFont, size: number): number => {
        text = this.sanitizePdfText(text);
        const usableW = cellW - PADDING * 2;
        const totalW  = font.widthOfTextAtSize(text, size);
        return Math.max(1, Math.ceil(totalW / usableW));
      };

      // Calcula la altura necesaria para un texto (font shrink primero, luego expand)
      const calcCellH = (text: string, cellW: number, font: PDFFont): number => {
        const size  = fitFontSize(text, cellW, font);
        const lines = numLines(text, cellW, font, size);
        return Math.max(ROW_H_MIN, lines * LINE_H + PADDING * 2);
      };

      // Dibuja rectángulo con fondo blanco y borde
      const drawCell = (x: number, yTop: number, w: number, h: number) => {
        activePage.drawRectangle({
          x, y: y(yTop + h), width: w, height: h,
          borderColor: BORDER, borderWidth: BORDER_THICK,
          color: rgb(1, 1, 1), opacity: 1,
        });
      };

      // Dibuja texto centrado vertical y opcionalmente horizontal, con font size adaptado
      const cellText = (text: string, x: number, yTop: number, cellH: number, font: PDFFont, cellW: number, hCenter = false) => {
        text          = this.sanitizePdfText(text);
        const size    = fitFontSize(text, cellW, font);
        const lines   = numLines(text, cellW, font, size);
        const usableW = cellW - PADDING * 2;
        // Centrado vertical: bloque de texto centrado en la celda
        // baseline = top del bloque + (LINE_H - size) / 2 para centrar dentro de la línea
        const blockH    = lines * LINE_H;
        const blockTopY = yTop + (cellH - blockH) / 2;
        const baseline  = blockTopY + (LINE_H - size) / 2 + size - 1;
        // Centrado horizontal (solo si cabe en una línea)
        let textX = x + PADDING;
        if (hCenter && lines === 1) {
          const tw = font.widthOfTextAtSize(text, size);
          textX = x + (cellW - tw) / 2;
        }
        this.drawText(activePage, text, textX, y(baseline), font, size, usableW);
      };

      // ── Paginación dinámica ──────────────────────────────────────────────
      let activePage: PDFPage = page;
      const TABLE_TOP_CONTINUATION = 20;    // Y inicio de tabla en páginas de continuación
      const PAGE_BOTTOM_LIMIT      = height - 15; // máximo Y antes de saltar de página
      const FOOTER_HEIGHT_ESTIMATE = 200;   // altura reservada para el footer en última página

      const addNewPage = (): void => {
        activePage = pdfDoc.addPage([width, height]);
        curY = TABLE_TOP_CONTINUATION;
      };

      let numeroPrioridad = 1;

      for (const prioridad of listPrioridades) {
        const listIndicadores = prioridad.listIndicador || [];

        // ── Pre-calcular alturas de todas las filas de esta prioridad ────────
        // Estructura: por cada indicador, por cada evidencia → altura de fila
        const indicadorBlocks: {
          indicador: any;
          evidencias: any[];
          rowHeights: number[]; // una altura por fila de evidencia
          altoInd: number;
        }[] = [];

        for (const indicador of listIndicadores) {
          const listEvidencias = indicador.listEvidencia?.length > 0
            ? indicador.listEvidencia : [null];

          const rowHeights = listEvidencias.map((ev: any) => {
            const hEvid   = calcCellH(ev?.descripcion || '-',           TCOL.plazo   - TCOL.evid,   helvetica);
            const hComent = calcCellH(ev?.comentarioAdicional || '-',   TCOL.alcanz  - TCOL.coment, helvetica);
            return Math.max(ROW_H_MIN, hEvid, hComent);
          });

          // La altura del bloque del indicador también depende de su propio texto
          const sumRowH   = rowHeights.reduce((a: number, b: number) => a + b, 0);
          const hIndicNom = calcCellH(indicador.nombreIndicador || '-', TCOL.sentido - TCOL.indic, helvetica);
          const altoInd   = Math.max(sumRowH, hIndicNom);

          // Si el indicador es más alto que la suma de evidencias, añadir la diferencia
          // a la última fila para que las celdas de evidencia llenen todo el bloque
          if (altoInd > sumRowH) {
            rowHeights[rowHeights.length - 1] += (altoInd - sumRowH);
          }

          indicadorBlocks.push({ indicador, evidencias: listEvidencias, rowHeights, altoInd });
        }

        // Altura total del bloque de prioridad
        const sumAltoInd = indicadorBlocks.reduce((s: number, b: any) => s + b.altoInd, 0);
        const hPrioNom   = calcCellH(prioridad.prioridadNombre || '-', TCOL.indic - TCOL.prio, helvetica);
        const altoPrio   = indicadorBlocks.length > 0 ? Math.max(sumAltoInd, hPrioNom) : ROW_H_MIN;

        // Si la prioridad es más alta que la suma de indicadores, añadir la diferencia
        // al último bloque de indicador (y a su última fila de evidencia)
        if (altoPrio > sumAltoInd && indicadorBlocks.length > 0) {
          const diff = altoPrio - sumAltoInd;
          const lastBlock = indicadorBlocks[indicadorBlocks.length - 1];
          lastBlock.altoInd += diff;
          lastBlock.rowHeights[lastBlock.rowHeights.length - 1] += diff;
        }

        // ── Salto de página si no hay espacio suficiente ─────────────────────
        if (curY + altoPrio > PAGE_BOTTOM_LIMIT) {
          addNewPage();
        }

        // ── Dibujar celda Nº (merge toda la prioridad) ──────────────────────
        drawCell(TCOL.num, curY, TCOL.prio - TCOL.num, altoPrio);
        cellText(`${numeroPrioridad}`, TCOL.num, curY, altoPrio, helveticaBold, TCOL.prio - TCOL.num);

        // ── Dibujar celda Prioridad (merge toda la prioridad) ───────────────
        drawCell(TCOL.prio, curY, TCOL.indic - TCOL.prio, altoPrio);
        cellText(prioridad.prioridadNombre || '-', TCOL.prio, curY, altoPrio, helvetica, TCOL.indic - TCOL.prio);

        let indicY = curY;

        for (const block of indicadorBlocks) {
          const { indicador, evidencias, rowHeights, altoInd } = block;

          const esPorcentaje = ['03', '04', '06'].includes(indicador.codTipoValorMeta);
          const valorMeta = indicador.valorMeta != null
            ? (esPorcentaje ? `${indicador.valorMeta}%` : `${indicador.valorMeta}`) : '-';
          const peso = indicador.peso != null ? `${indicador.peso}%` : '-';
          const valorAlcanzado = indicador.valorAlcanzado != null
            ? (esPorcentaje ? `${indicador.valorAlcanzado}%` : `${indicador.valorAlcanzado}`) : '-';
          const puntaje = indicador.puntajePorMeta != null
            ? parseFloat(indicador.puntajePorMeta).toFixed(2) : '-';

          // Columnas mergeadas por indicador
          drawCell(TCOL.indic,   indicY, TCOL.sentido - TCOL.indic,  altoInd);
          cellText(indicador.nombreIndicador || '-', TCOL.indic, indicY, altoInd, helvetica, TCOL.sentido - TCOL.indic);

          drawCell(TCOL.sentido, indicY, TCOL.meta    - TCOL.sentido, altoInd);
          cellText(indicador.sentido || '-', TCOL.sentido, indicY, altoInd, helvetica, TCOL.meta - TCOL.sentido, true);

          drawCell(TCOL.meta,    indicY, TCOL.peso    - TCOL.meta,    altoInd);
          cellText(valorMeta, TCOL.meta, indicY, altoInd, helvetica, TCOL.peso - TCOL.meta, true);

          drawCell(TCOL.peso,    indicY, TCOL.evid    - TCOL.peso,    altoInd);
          cellText(peso, TCOL.peso, indicY, altoInd, helvetica, TCOL.evid - TCOL.peso, true);

          drawCell(TCOL.alcanz,  indicY, TCOL.puntaje - TCOL.alcanz,  altoInd);
          cellText(valorAlcanzado, TCOL.alcanz, indicY, altoInd, helvetica, TCOL.puntaje - TCOL.alcanz, true);

          drawCell(TCOL.puntaje, indicY, TCOL.right   - TCOL.puntaje, altoInd);
          cellText(puntaje, TCOL.puntaje, indicY, altoInd, helvetica, TCOL.right - TCOL.puntaje, true);

          // Columnas por evidencia (una fila por evidencia)
          let evidY = indicY;
          for (let ei = 0; ei < evidencias.length; ei++) {
            const evidencia = evidencias[ei];
            const rowH = rowHeights[ei];
            const plazoRaw = evidencia?.fechaPlazoFinal
              ? evidencia.fechaPlazoFinal + 'T00:00:00'
              : evidencia?.plazo;
            const plazo = plazoRaw
              ? datePipe.transform(plazoRaw, 'dd/MM/yyyy') || '-' : '-';

            drawCell(TCOL.evid,   evidY, TCOL.plazo  - TCOL.evid,   rowH);
            cellText(evidencia?.descripcion || '-', TCOL.evid, evidY, rowH, helvetica, TCOL.plazo - TCOL.evid);

            drawCell(TCOL.plazo,  evidY, TCOL.coment - TCOL.plazo,  rowH);
            cellText(plazo, TCOL.plazo, evidY, rowH, helvetica, TCOL.coment - TCOL.plazo, true);

            drawCell(TCOL.coment, evidY, TCOL.alcanz - TCOL.coment, rowH);
            cellText(evidencia?.comentarioAdicional || '-', TCOL.coment, evidY, rowH, helvetica, TCOL.alcanz - TCOL.coment);

            evidY += rowH;
          }

          indicY += altoInd;
        }

        curY += altoPrio;
        numeroPrioridad++;
      }

      // ─── SECCIÓN 4: FOOTER EMBEBIDO (modeloGDR_footer.pdf) ──────────────────
      const FOOTER_MARGIN = 1; // espacio entre tabla y footer, no funciona pero asi está bien, dejarlo

      // Si el footer no cabe en la página actual, añadir una nueva
      if (curY + FOOTER_HEIGHT_ESTIMATE > height) {
        addNewPage();
      }

      // Calcular puntuación final
      let puntuacionFinal = 0;
      for (const prioridad of listPrioridades) {
        for (const indicador of (prioridad.listIndicador || [])) {
          if (indicador.puntajePorMeta != null && !isNaN(indicador.puntajePorMeta)) {
            puntuacionFinal += parseFloat(indicador.puntajePorMeta);
          }
        }
      }

      // Calcular calificación
      const segmento = trabajador.segmento?.toUpperCase() || '';
      const asistioReunion = reunionData?.asistio;
      const permanenciaSeisMeses = resultadosFinales?.permanenciaSeisMeses;
      const rendimientoDistinguido = resultadosFinales?.rendimientoDistinguido;
      let calificacion = '-';
      if (asistioReunion === 'N') {
        calificacion = 'Desaprobado';
      } else if (permanenciaSeisMeses === 'NO') {
        calificacion = 'No corresponde calificación';
      } else if (puntuacionFinal <= 0) {
        calificacion = '-';
      } else if (rendimientoDistinguido === 'Si' && puntuacionFinal >= 100) {
        calificacion = 'Rendimiento Distinguido';
      } else if (segmento === 'DIRECTIVO' && puntuacionFinal >= 70) {
        calificacion = 'Buen rendimiento';
      } else if (puntuacionFinal >= 60 && ['MANDO MEDIO', 'EJECUTOR', 'OPERADOR Y ASISTENCIA'].includes(segmento)) {
        calificacion = 'Buen rendimiento';
      } else {
        calificacion = 'Rendimiento sujeto a observación';
      }

      // Cargar y embeber el footer PDF
      const footerUrl = `assets/docs/modeloGDR_footer.pdf?v=${new Date().getTime()}`;
      const footerResponse = await fetch(footerUrl, { cache: 'no-store' });
      const footerArrayBuffer = await footerResponse.arrayBuffer();
      const footerDoc = await PDFDocument.load(footerArrayBuffer);
      const [embeddedFooter] = await pdfDoc.embedPdf(footerDoc, [0]);

      // Posición Y donde pega el footer (justo debajo de la tabla)
      const footerTopY = curY + FOOTER_MARGIN;        // desde arriba del PDF
      const footerH    = embeddedFooter.height;
      const footerW    = embeddedFooter.width;

      // Escalar footer al ancho de la página
      const scale     = width / footerW;
      const scaledH   = footerH * scale;

      // Dibujar el footer embebido alineado a la izquierda de la página
      // FOOTER_CROP_TOP: recorta el espacio en blanco del top del footer PDF
      // Aumenta este valor para subir el footer (elimina más espacio del top)
      const FOOTER_CROP_TOP = 30; // px a recortar del top del footer PDF (ajustar si es necesario)
      const cropScaled = FOOTER_CROP_TOP * scale;

      activePage.drawPage(embeddedFooter, {
        x: 0,
        y: y(footerTopY + scaledH - cropScaled), // sube el footer
        width: width,
        height: scaledH,
      });

      // Datos encima del footer — coordenadas relativas a footerTopY
      const permanenciaTexto = permanenciaSeisMeses === 'NO'
        ? 'Tiene menos de 6 meses desempeñando el puesto que es objeto de evaluación'
        : 'Tiene 6 meses o más desempeñando el puesto que es objeto de evaluación';
      const fechaReunionStr = resultadosFinales?.fechaReunion
        ? datePipe.transform(resultadosFinales.fechaReunion, 'dd/MM/yyyy') || '-' : '-';
      const juntaStr = (rendimientoDistinguido && rendimientoDistinguido !== '[Seleccione]')
        ? rendimientoDistinguido : '-';

      // NOTA: ajustar estos offsets con la grilla de calibración sobre el footer
      // fila 1: Permanencia | Puntuación | Calificación | Acciones capacitación | Fecha reunión

      //deberia restarle el footer CUP a cada footerTopY pero asi esta bien, ajustar en un futuro
      this.drawText(activePage, permanenciaTexto,                               28,  y(footerTopY + 90), helvetica, 4, 70);
      this.drawText(activePage, puntuacionFinal.toFixed(2),                    155,  y(footerTopY + 115), helveticaBold, 12);
      this.drawText(activePage, calificacion,                                  242,  y(footerTopY + 100), helvetica, 8, 70);
      this.drawText(activePage, resultadosFinales?.accionesCapacitacion || '-', 380,  y(footerTopY + 90), helvetica, 4, 130);
      this.drawText(activePage, fechaReunionStr,                               520,  y(footerTopY + 120), helvetica, 8);
      // fila 2: Otras acciones
      this.drawText(activePage, resultadosFinales?.otrasAcciones || '-',        380,  y(footerTopY + 115), helvetica, 4, 130);
      // fila 3: Junta directivos
      this.drawText(activePage, juntaStr,                                       58,  y(footerTopY + 135), helvetica, 6, 70);

      // ─── GUARDAR Y DESCARGAR ─────────────────────────────────────────────────
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: PDF_TYPE });
      fs.saveAs(blob, `${this.fileName}${trabajador.nombre}_${new Date().getTime()}${PDF_EXTENSION}`);
    } catch (error) {
      console.error('Error al generar PDF desde plantilla:', error);
    }
  }

  /**
   * CALIBRACIÓN TEMPORAL — genera el PDF con grilla de coordenadas para ajuste de posiciones.
   * Llamar desde el botón de descarga reemplazando exportPdfTrabajador().
   * ELIMINAR una vez calibrado.
   */
  async exportPdfCalibracion(): Promise<void> {
    const templateUrl = `assets/docs/modeloGDR.pdf?v=${new Date().getTime()}`;
    const response = await fetch(templateUrl, { cache: 'no-store' });
    const templateArrayBuffer = await response.arrayBuffer();

    const pdfDoc = await PDFDocument.load(templateArrayBuffer);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const page of pdfDoc.getPages()) {
      const { width, height } = page.getSize();

      // Líneas horizontales cada 50px — con etiqueta del Y (desde arriba, como Excel)
      for (let yFromTop = 0; yFromTop <= height; yFromTop += 50) {
        const yPdf = height - yFromTop;
        page.drawLine({
          start: { x: 0, y: yPdf },
          end: { x: width, y: yPdf },
          thickness: 0.3,
          color: rgb(0.8, 0, 0),
          opacity: 0.5,
        });
        page.drawText(`y=${yFromTop}`, {
          x: 2, y: yPdf + 2,
          size: 5, font: helvetica, color: rgb(0.8, 0, 0),
        });
      }

      // Líneas verticales cada 50px — con etiqueta del X
      for (let x = 0; x <= width; x += 50) {
        page.drawLine({
          start: { x, y: 0 },
          end: { x, y: height },
          thickness: 0.3,
          color: rgb(0, 0, 0.8),
          opacity: 0.5,
        });
        page.drawText(`x=${x}`, {
          x: x + 2, y: height - 10,
          size: 5, font: helvetica, color: rgb(0, 0, 0.8),
        });
      }

      // Líneas más finas cada 10px para mayor precisión
      for (let yFromTop = 0; yFromTop <= height; yFromTop += 10) {
        if (yFromTop % 50 === 0) continue;
        const yPdf = height - yFromTop;
        page.drawLine({
          start: { x: 0, y: yPdf },
          end: { x: width, y: yPdf },
          thickness: 0.15,
          color: rgb(0.8, 0, 0),
          opacity: 0.25,
        });
      }
      for (let x = 0; x <= width; x += 10) {
        if (x % 50 === 0) continue;
        page.drawLine({
          start: { x, y: 0 },
          end: { x, y: height },
          thickness: 0.15,
          color: rgb(0, 0, 0.8),
          opacity: 0.25,
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: PDF_TYPE });
    fs.saveAs(blob, `calibracion_GDR${PDF_EXTENSION}`);
  }

  private sanitizePdfText(text: string): string {
    const safeText = (text ?? '-').toString()
      .replace(/[\n\r\t]/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[–—]/g, '-')
      .replace(/…/g, '...')
      .replace(/[•·]/g, '-')
      .replace(/[^\u0009\u000A\u000D\u0020-\u00FF]/g, '')
      .replace(/ {2,}/g, ' ')
      .trim();

    return safeText || '-';
  }

  /**
   * Dibuja texto en el PDF con truncado opcional
   */
  private drawText(
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    font: PDFFont,
    size: number,
    maxWidth?: number
  ): void {
    const str = this.sanitizePdfText(String(text ?? '-'));
    page.drawText(str, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
      maxWidth: maxWidth,
      lineHeight: size + 2,
    });
  }
}