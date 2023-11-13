import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '@env';
import { OnomasticosRequest, OnomasticosResponse } from '@data/models/menu-principal/menu-principal.model';
import { MenuEncuestaShow, encuestaRespuesta } from '@data/models/menu-principal/menu-encuesta.model';
import { PublicacionRequest, PublicacionResponse } from '@data/models/menu-principal/menu-publicacion.model';

const URL_BASE = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class MenuPrincipalService {

  padronElectoral = [
    {documento:'25655686'}, {documento:'08659047'}, {documento:'08255329'}, {documento:'09092683'}, {documento:'06065975'}, {documento:'10433882'}, {documento:'10269784'}, {documento:'41640174'}, {documento:'41771870'}, {documento:'43067496'}, {documento:'06257288'}, {documento:'06015154'}, {documento:'06629783'}, {documento:'10026782'}, {documento:'09808984'}, {documento:'25445233'}, {documento:'07441497'}, {documento:'25465670'}, {documento:'08008524'}, {documento:'08776304'}, {documento:'07744434'}, {documento:'06084011'}, {documento:'10691715'}, {documento:'09963183'}, {documento:'07821112'}, {documento:'06648633'}, {documento:'07266365'}, {documento:'08464208'}, {documento:'10685831'}, {documento:'41599587'}, {documento:'10176352'}, {documento:'43610442'}, {documento:'06755999'}, {documento:'08489687'}, {documento:'10347914'}, {documento:'18079036'}, {documento:'20108518'}, {documento:'03700150'}, {documento:'08733524'}, {documento:'08144288'}, {documento:'08743813'}, {documento:'07338683'}, {documento:'10612975'}, {documento:'10139049'}, {documento:'10608201'}, {documento:'16687248'}, {documento:'42666363'}, {documento:'18212225'}, {documento:'46654943'}, {documento:'40370508'}, {documento:'42422400'}, {documento:'09668104'}, {documento:'20088296'}, {documento:'09592775'}, {documento:'70946713'}, {documento:'21882665'}, {documento:'09060149'}, {documento:'09256078'}, {documento:'45954699'}, {documento:'46199021'}, {documento:'40145371'}, {documento:'07744037'}, {documento:'40225966'}, {documento:'46399339'}, {documento:'08749899'}, {documento:'10000931'}, {documento:'07236994'}, {documento:'15594713'}, {documento:'06875313'}, {documento:'06930413'}, {documento:'06017955'}, {documento:'25633650'}, {documento:'07207839'}, {documento:'45682402'}, {documento:'23995647'}, {documento:'07450920'}, {documento:'02684214'}, {documento:'46854795'}, {documento:'40757600'}, {documento:'42401578'}, {documento:'10088061'}, {documento:'74297796'}, {documento:'07505523'}, {documento:'08875876'}, {documento:'08788256'}, {documento:'08787110'}, {documento:'70090749'}, {documento:'41224190'}, {documento:'25434009'}, {documento:'25535507'}, {documento:'06016965'}, {documento:'40387893'}, {documento:'08587593'}, {documento:'09843053'}, {documento:'09160951'}, {documento:'06872256'}, {documento:'09853569'}, {documento:'04620768'}, {documento:'32123622'}, {documento:'01235897'}, {documento:'18168638'}, {documento:'10340253'}, {documento:'23993622'}, {documento:'10062144'}, {documento:'08664053'}, {documento:'07973866'}, {documento:'08089929'}, {documento:'09553821'}, {documento:'42716415'}, {documento:'43778012'}, {documento:'45158889'}, {documento:'22502887'}, {documento:'40444861'}, {documento:'40508475'}, {documento:'09825306'}, {documento:'42797913'}, {documento:'08274229'}, {documento:'04025463'}, {documento:'40975628'}, {documento:'18121647'}, {documento:'47129691'}, {documento:'27437465'}, {documento:'08292565'}, {documento:'17874193'}, {documento:'25797733'}, {documento:'07349349'}, {documento:'21553077'}, {documento:'42385643'}, {documento:'06248239'}, {documento:'43200836'}, {documento:'07263996'}, {documento:'07243708'}, {documento:'25642227'}, {documento:'09713421'}, {documento:'09595516'}, {documento:'07429150'}, {documento:'08211462'}, {documento:'07351530'}, {documento:'05384629'}, {documento:'09994320'}, {documento:'25705859'}, {documento:'07618207'}, {documento:'15738879'}, {documento:'07872664'}, {documento:'08065863'}, {documento:'41148858'}, {documento:'09539838'}, {documento:'72739865'}, {documento:'06993757'}, {documento:'10134491'}, {documento:'25862207'}, {documento:'05283142'}, {documento:'08129166'}, {documento:'25682857'}, {documento:'70509460'}, {documento:'10052439'}, {documento:'41746366'}, {documento:'07915112'}, {documento:'40096436'}, {documento:'42153467'}, {documento:'10204620'}, {documento:'06801413'}, {documento:'06705301'}, {documento:'06277115'}, {documento:'15961047'}, {documento:'08870908'}, {documento:'17400069'}, {documento:'10740579'}, {documento:'07264246'}, {documento:'09327793'}, {documento:'06750801'}, {documento:'27432812'}, {documento:'23934023'}, {documento:'09498180'}, {documento:'21560073'}, {documento:'21256758'}, {documento:'09361235'}, {documento:'31477654'}, {documento:'08133162'}, {documento:'09860551'}, {documento:'15355247'}, {documento:'09840668'}, {documento:'09258689'}, {documento:'09996885'}, {documento:'09707819'}, {documento:'41736331'}, {documento:'10339809'}, {documento:'08443100'}, {documento:'15638176'}, {documento:'09458524'}, {documento:'07863579'}, {documento:'40879987'}, {documento:'24005872'}, {documento:'10729420'}, {documento:'41195540'}, {documento:'41834762'}, {documento:'42057320'}, {documento:'10736199'}, {documento:'43612064'}, {documento:'40727659'}, {documento:'46280821'}, {documento:'09992997'}, {documento:'20036765'}, {documento:'08629282'}, {documento:'06127549'}, {documento:'04079183'}, {documento:'10290734'}, {documento:'06720337'}, {documento:'41832229'}, {documento:'06202554'}, {documento:'10567637'}, {documento:'70478108'}, {documento:'44110395'}, {documento:'46267688'}, {documento:'09488494'}, {documento:'22408274'}, {documento:'09898888'}, {documento:'44934761'}, {documento:'02696230'}, {documento:'40096007'}, {documento:'40481143'}, {documento:'10003710'}, {documento:'07621291'}, {documento:'24002907'}, {documento:'41717954'}, {documento:'46954005'}, {documento:'20050316'}, {documento:'43492649'}, {documento:'20087860'}, {documento:'07108435'}, {documento:'01072655'}, {documento:'10288870'}, {documento:'43320765'}, {documento:'25706686'}, {documento:'40385090'}, {documento:'07590671'}, {documento:'07419475'}, {documento:'10057885'}, {documento:'25740500'}, {documento:'10007619'}, {documento:'10659811'}, {documento:'44873347'}, {documento:'46985299'}, {documento:'48051873'}, {documento:'47358312'}, {documento:'09191530'}, {documento:'09087002'}, {documento:'07602735'}, {documento:'10158848'}, {documento:'07723294'}, {documento:'25854711'}, {documento:'41496965'}, {documento:'45278007'}, {documento:'71569931'}, {documento:'07244410'}, {documento:'21081708'}, {documento:'09459474'}, {documento:'40815818'}, {documento:'45159514'}, {documento:'44765868'}, {documento:'41040298'}, {documento:'10061961'}, {documento:'06065713'}, {documento:'41144397'}, {documento:'10268935'}, {documento:'07549012'}, {documento:'07794943'}, {documento:'06666152'}, {documento:'09453636'}, {documento:'10537132'}, {documento:'10792492'}, {documento:'06793945'}, {documento:'43021857'}, {documento:'70437389'}, {documento:'72921091'}, {documento:'47155025'}, {documento:'45630103'}, {documento:'41477234'}, {documento:'06199818'}, {documento:'07876758'}, {documento:'06730684'}, {documento:'10273174'}, {documento:'07466980'}, {documento:'16006941'}, {documento:'70509470'}, {documento:'70439484'}, {documento:'45473329'}, {documento:'41230269'}, {documento:'41099293'}, {documento:'10320876'}, {documento:'08364832'}, {documento:'08561160'}, {documento:'10422053'}, {documento:'19856174'}, {documento:'09588810'}, {documento:'07956346'}, {documento:'07796304'}, {documento:'06206814'}, {documento:'32841886'}, {documento:'17845709'}, {documento:'08075221'}, {documento:'09394277'}, {documento:'09615561'}, {documento:'09619471'}, {documento:'08731412'}, {documento:'40007531'}, {documento:'19820492'}, {documento:'09738472'}, {documento:'42893040'}, {documento:'10286855'}, {documento:'09388163'}, {documento:'06203015'}, {documento:'09304859'}, {documento:'09140472'}, {documento:'07431217'}, {documento:'25741488'}, {documento:'06908863'}, {documento:'08834610'}, {documento:'10043504'}, {documento:'08887876'}, {documento:'10608454'}, {documento:'07618739'}, {documento:'07271010'}, {documento:'06666730'}, {documento:'06028917'}, {documento:'08662604'}, {documento:'07934195'}, {documento:'07260932'}, {documento:'07860720'}, {documento:'40004647'}, {documento:'07584702'}, {documento:'22272316'}, {documento:'20647249'}, {documento:'41797685'}, {documento:'09360213'}, {documento:'25482755'}, {documento:'07604763'}, {documento:'06281554'}, {documento:'10084297'}, {documento:'32944135'}, {documento:'45841933'}, {documento:'10698996'}, {documento:'10347970'}, {documento:'09350264'}, {documento:'08655231'}, {documento:'41357238'}, {documento:'07234954'}, {documento:'06984871'}, {documento:'29269589'}, {documento:'41435735'}, {documento:'42408960'}, {documento:'07761686'}, {documento:'08621090'}, {documento:'06653413'}, {documento:'25526298'}, {documento:'25758137'}, {documento:'10198747'}, {documento:'41594662'}, {documento:'07640211'}, {documento:'25837395'}, {documento:'41989551'}, {documento:'46529872'}, {documento:'40136956'}, {documento:'22477597'}, {documento:'10539357'}, {documento:'07106981'}, {documento:'07227389'}, {documento:'09755604'}, {documento:'08097463'}, {documento:'42985545'}, {documento:'07751712'}, {documento:'16001065'}, {documento:'17824218'}, {documento:'09255403'}, {documento:'08954954'}, {documento:'25608031'}, {documento:'09537124'}]

  constructor(private _httpClient: HttpClient) { }

  returnPadron(numDoc: string){
    return this.padronElectoral.find((x)=> {return x.documento === numDoc});
  }

  newPublicacion(model: PublicacionRequest){
    const url = `${URL_BASE}/publicaciones`;
    return this._httpClient.post(url,model);
  }

  getPublicaciones(){
    const url = `${URL_BASE}/publicaciones`;
    return this._httpClient.get<PublicacionResponse[]>(url);
  }

  getPublicacionesTable(){
    const url = `${URL_BASE}/publicaciones/administrador`;
    return this._httpClient.get<object[]>(url);
  }

  updatePublicacion(idPublicacion: number, model: PublicacionRequest){
    const url = `${URL_BASE}/publicaciones/${idPublicacion}`;
    return this._httpClient.put(url,model);
  }
  
  deletePublicacion(idPublicacion: number){
    const url = `${URL_BASE}/publicaciones/${idPublicacion}`;
    return this._httpClient.delete(url);
  }

  sendEncuesta(idEncuesta: number, model: encuestaRespuesta){
    const url = `${URL_BASE}/encuestas/${idEncuesta}/guardar-respuesta`;
    return this._httpClient.post(url,model);
  }

  getEncuestaActiva(){
    const url = `${URL_BASE}/encuestas/encuesta-activa`;
    return this._httpClient.get<MenuEncuestaShow>(url);
  }

  getReporteEncuesta(idEncuesta: number){
    const url = `${URL_BASE}/encuestas/${idEncuesta}/resultado-encuesta`;
    return this._httpClient.get<any>(url);
  }

  searchOnomasticos(model: OnomasticosRequest){
    return this._httpClient.get<OnomasticosResponse[]>(`${URL_BASE}/onomasticos/mes/${model.mesConsulta}/dia/${model.diaConsulta}`);
  }

  // async getListRed() {
  //   const url = `${URL_BASE}/usuarios-redes/redes`;
  //   return await this._httpClient.get<any[]>(url).toPromise();
  // }

  async getListRedesAsignadas() {
    const url = `${URL_BASE}/usuarios-redes/redes-asignadas`;
    return await this._httpClient.get<any[]>(url).toPromise();
  }

}
