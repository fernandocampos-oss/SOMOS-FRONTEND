import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoletaService {

  inscritosTemp = [{numDoc: '72437355'}, {numDoc: '07461911'}];

  constructor() { }

  addInscritosBoleta(numDocumento: string){
    this.inscritosTemp.push({numDoc: numDocumento});
  }

  getIfInscritosBoleta(numDocumento: string){
    return this.inscritosTemp.find((x)=> {return x.numDoc === numDocumento});
  }

  deleteInscritosBoleta(numDocumento: string){
    this.inscritosTemp.splice(this.inscritosTemp.findIndex(x => x.numDoc === numDocumento),1);
  }
}
