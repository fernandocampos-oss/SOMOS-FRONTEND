import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InscripcionService } from '@data/services/inscripcion.service';

@Component({
  selector: 'app-register-vote-inscripcion',
  templateUrl: './register-vote-inscripcion.component.html',
  styleUrls: ['./register-vote-inscripcion.component.scss']
})
export class RegisterVoteInscripcionComponent implements OnInit {

  wait = false;
  optSelected: any;
  imgOptSelected: string = '';
  inscripcionVotacionElegida: any = Object();

  constructor(@Inject(MAT_DIALOG_DATA) public data    : any,
              private inscripcionService              : InscripcionService,) { }

  ngOnInit(): void {
    this.inscripcionService.getInscripcionesVotacionesActivas().subscribe((data)=>{
      data.map((x)=>{ 
        if(x.idInscripcion == this.data.idInscripcion){
          this.inscripcionVotacionElegida = x;
          // this.inscripcionVotacionElegida.candidatos.splice(3,1);
          if(this.inscripcionVotacionElegida.candidatos.length % 2 == 0 && this.inscripcionVotacionElegida.candidatos.length != 6){
            document.documentElement.style.setProperty('--tamanio-array','2');
          }
          else{
            document.documentElement.style.setProperty('--tamanio-array','3');
          }
          this.wait = true;
        }
      })
      console.log(data);
      console.log(this.inscripcionVotacionElegida)
    })
  }

  selectImageList(element){
    this.optSelected = element;
  }

}
