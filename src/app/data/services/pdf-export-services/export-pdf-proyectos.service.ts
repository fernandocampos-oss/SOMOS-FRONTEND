import { Injectable } from '@angular/core';
import jsPDF, { TextOptionsLight } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class ExportPdfProyectosService {

  constructor() { }

  generatePDF(projectInfo: any){

    function toTitleCase(input: string): string {
      return input.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    }
    
    function addTextToPdf(text: string, espacioExtra: number, negrita: boolean, where?: number, forceSaltoPag?: Boolean) {
      var configParrafos: TextOptionsLight = {
        align: 'left', 
        maxWidth: 180,
      }
      let linesOfText = doc.splitTextToSize(text, configParrafos.maxWidth).length;
      doc.setFont('Times', negrita == true ? 'bold' : null)
      if(yPosition + linesOfText*4 > doc.internal.pageSize.height - 10 || forceSaltoPag){
        doc.addPage();
        yPosition = 10;
      }
      doc.text(text, 10, yPosition, configParrafos);
      if(where){
        let distanciaMedio = centerX - (dimensionImage/1.5);
        let distanciaTercerColumna = centerX + (dimensionImage/1.75) - (dimensionImage/1.75);
        switch (where) {
          case 1:
            doc.text('Nro. Documento', distanciaMedio, yPosition, configParrafos);
            doc.text('Código de planilla', distanciaTercerColumna, yPosition, configParrafos);
            break;
          case 2:
            doc.text(lider.numeroDocumento, distanciaMedio, yPosition, configParrafos);
            doc.text(lider.codigoPlanilla, distanciaTercerColumna, yPosition, configParrafos);            
            break;
          case 3:
            doc.text('Nombres', distanciaTercerColumna, yPosition, configParrafos);
            break;
          case 4:
            doc.text(lider.nombres, distanciaTercerColumna, yPosition, configParrafos);
            break;
          case 5:
            doc.text('Celular', distanciaMedio, yPosition, configParrafos);
            doc.text('Correo Electrónico', distanciaTercerColumna, yPosition, configParrafos);
            break;
          case 6:
            doc.text(lider.numeroCelular, distanciaMedio, yPosition, configParrafos);
            doc.text(lider.correo, distanciaTercerColumna, yPosition, configParrafos);
            break;
          case 7:
            let tableHeaders = ['Nombres y Apellidos', 'Tipo Doc.', 'N° Doc.   ', 'Cargo', 'Cod. Planilla ']
            let miembros = projectInfo.grupo.miembros.filter((z)=>{
              return z.idUsuario != projectInfo.idUsuario
            }).map((x)=> {
                return {
                  'Nombres y Apellidos': toTitleCase(x.nombres) + ' ' + toTitleCase(x.apellidos),
                  'Tipo Doc.': 'DNI',
                  'N° Doc.   ': x.numeroDocumento,
                  'Cargo': toTitleCase(x.cargo),
                  'Cod. Planilla ': x.codigoPlanilla
                }
            })
            doc.table(10, yPosition, miembros, tableHeaders, {printHeaders: true, autoSize: true, fontSize: 10});

            doc.setFontSize(12);
            break;
        }
      }
      yPosition += linesOfText*4 + espacioExtra*4;
    }

    const doc = new jsPDF();
    var img = 'data:image/jpeg;base64,'+ projectInfo.grupo.imagenBase64;
    var dimensionImage = 60;
    doc.setFontSize(12);
    doc.setFont('Times')
    let yPosition = 10;

    let espacioSubTitulo = 0.5;
    let espacioFinalTexto = 3;

    var centerX = doc.internal.pageSize.getWidth() / 2;

    addTextToPdf('Inscrito #'+projectInfo.idProyecto,espacioSubTitulo, true);

    console.log(doc.getFontList())

    doc.addImage(img, 'PNG', centerX - (dimensionImage/2), yPosition, dimensionImage, dimensionImage);

    yPosition +=dimensionImage+10;

    let lider = projectInfo.grupo.miembros.find((x)=>{ return x.idUsuario == projectInfo.idUsuario});

    addTextToPdf('Perfil del líder y equipo',espacioSubTitulo, true);
    addTextToPdf('Lista de archivos subidos al momento de enviar la ficha de registros',1, false);
    addTextToPdf('Tipo Documento',espacioSubTitulo, true,1);
    addTextToPdf('DNI',espacioSubTitulo, false,2);
    addTextToPdf('Apellidos',espacioSubTitulo, true,3);
    addTextToPdf(lider.apellidos,espacioSubTitulo, false,4);
    addTextToPdf('Fecha de nacimiento',espacioSubTitulo, true,5);
    addTextToPdf(lider.fechaNacimiento,espacioFinalTexto, false,6);

    addTextToPdf('INFORMACIÓN DEL EQUIPO',1, true);
    addTextToPdf('Nombre del grupo',espacioSubTitulo, true);
    addTextToPdf(projectInfo.grupo.nombre,2, false);
    addTextToPdf('Ficha de registro',1, true);

    addTextToPdf('A. Categoría a la que participan (Marcar solo una categoría):',espacioSubTitulo, true);
    addTextToPdf(projectInfo.grupo.categoria,espacioFinalTexto, false);

    addTextToPdf('B. Red, Hospital, Área asistencial o administrativa a la que pertenecen:',espacioSubTitulo, true);
    addTextToPdf(projectInfo.grupo.sede,espacioFinalTexto, false);

    addTextToPdf('C. Miembros del equipo (máximo 5 personas):',espacioSubTitulo, true);
    addTextToPdf('\n',espacioSubTitulo, false, 7);
    // for (let i = 0; i < projectInfo.grupo.miembros.length; i++) {
    //   let espacio = 0;
    //   if(i+1 == projectInfo.grupo.miembros.length) espacio = espacioFinalTexto;
    //   else espacio = espacioSubTitulo;
    //   addTextToPdf('\n',espacio, false);
    // }

    addTextToPdf('D. Datos de contacto del Líder:',espacioSubTitulo, true, null, true);
    addTextToPdf('N° de celular:',espacioSubTitulo, true);
    addTextToPdf(lider.numeroCelular,1.25, false);
    addTextToPdf('Email:',espacioSubTitulo, true);
    addTextToPdf(lider.correo,1.25, false);
    addTextToPdf('Nombre completo del Jefe de Red Prestacional, Asistencial, IPRESS, Establecimiento de Salud o Área administrativa a la que pertenece:',espacioSubTitulo, true);
    addTextToPdf(projectInfo.grupo.jefe,espacioFinalTexto, false);
    
    addTextToPdf('E. Describir la motivación por la cual postulan:',espacioSubTitulo, true);
    addTextToPdf(projectInfo.descripcion.motivo,espacioFinalTexto, false);
    
    addTextToPdf('F. Indicar desde qué fecha se ha implementado la acción innovadora:',espacioSubTitulo, true);
    addTextToPdf(projectInfo.descripcion.fecha,espacioFinalTexto, false);
    
    addTextToPdf('G. Descripción general de la acción innovadora:',espacioSubTitulo, true);
    addTextToPdf(projectInfo.descripcion.descripcion,espacioFinalTexto, false);
    
    addTextToPdf('H. Describir el contexto inicial (la situación inicial antes de implementar la acción innovadora):',espacioSubTitulo, true);
    addTextToPdf(projectInfo.descripcion.contexto,espacioFinalTexto, false);
    
    addTextToPdf('I. ¿Qué es lo innovador de esta acción implementada?:',espacioSubTitulo, true);
    addTextToPdf(projectInfo.descripcion.innovacion,espacioFinalTexto, false);
    
    addTextToPdf('J. Mencionar los principales indicadores de medición de resultados y/o impacto (máximo seis indicadores que miden el cambio o beneficio generado):',espacioSubTitulo, true);
    addTextToPdf(projectInfo.descripcion.indicador,espacioFinalTexto, false);
    
    addTextToPdf('K. Indicar los principales resultados e impacto, luego de implementada la acción innovadora:',espacioSubTitulo, true);
    addTextToPdf(projectInfo.implementacion.resultado,espacioFinalTexto, false);
    
    addTextToPdf('L. ¿La acción innovadora es sostenible?:',espacioSubTitulo, true);
    if(projectInfo.implementacion.sostenible === 'Si'){
      addTextToPdf(projectInfo.implementacion.sostenible, 0, false);
      addTextToPdf('¿Por qué?:', 0, false);
      addTextToPdf(projectInfo.implementacion.sostenibleFundamento, espacioFinalTexto, false);
    }
    else{
      addTextToPdf(projectInfo.implementacion.sostenible, espacioFinalTexto, false);
    }
    
    addTextToPdf('M. ¿La acción innovadora es replicable?:',espacioSubTitulo, true);
    if(projectInfo.implementacion.replicable === 'Si'){
      addTextToPdf(projectInfo.implementacion.replicable, 0, false);
      addTextToPdf('Indicar las condiciones para la replicabilidad de la acción innovadora:', 0, false);
      addTextToPdf(projectInfo.implementacion.replicableFundamento, espacioFinalTexto, false);
    }
    else{
      addTextToPdf(projectInfo.implementacion.replicable, espacioFinalTexto, false);
    }
    
    addTextToPdf('N. ¿La acción innovadora utiliza la tecnología?:',espacioSubTitulo, true);
    if(projectInfo.implementacion.tecnologia === 'Si'){
      addTextToPdf(projectInfo.implementacion.tecnologia, 0, false);
      addTextToPdf('¿Qué tipo de tecnología y de qué manera se utiliza?', 0, false);
      addTextToPdf(projectInfo.implementacion.tecnologiaFundamento, espacioFinalTexto, false);
    }
    else{
      addTextToPdf(projectInfo.implementacion.tecnologia, espacioFinalTexto, false);
    }
    
    addTextToPdf('O. ¿Indicar a qué servicios dentro de Essalud beneficia la acción innovadora?:',espacioSubTitulo, true);
    addTextToPdf(projectInfo.implementacion.beneficio,espacioFinalTexto, false);
    
    addTextToPdf('P. Indicar si la acción innovadora involucra alguno o varios de estos enfoques: (Marcar una o varias alternativas):',espacioSubTitulo, true);

    for (let i = 0; i < projectInfo.implementacion.enfoques.length; i++) {
      addTextToPdf((i+1) + '. ' + projectInfo.implementacion.enfoques[i] + '.',espacioSubTitulo, false);
    }
    // addTextToPdf(projectInfo.implementacion.beneficio,espacioFinalTexto, false);

    // var array = [{x: '1', y: '1'}, {x: '2', y: '2'}, {x: '3', y: '3'}, {x: '4', y: '4'}];

    // doc.table(60,70,array,['x','y'],null)

    doc.save( 'Renueva Essalud - Inscrito #' + projectInfo.idProyecto + '.pdf');
  }
}
