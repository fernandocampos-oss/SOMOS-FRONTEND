import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VotacionInscripcionRequest } from '@data/models/inscripcion/inscripcion.model';
import { InscripcionService } from '@data/services/inscripcion.service';
import { ConfirmDialogComponent } from '@shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-register-vote-inscripcion',
  templateUrl: './register-vote-inscripcion.component.html',
  styleUrls: ['./register-vote-inscripcion.component.scss']
})
export class RegisterVoteInscripcionComponent implements OnInit {

  wait = false;
  optSelected: any;
  imgOptSelected: string = '';
  inscripcionVotacionElegida: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data    : any,
              private dialogRef                       : MatDialogRef<RegisterVoteInscripcionComponent>,
              private dialogRefConfirmation           : MatDialog,
              private inscripcionService              : InscripcionService,) { }

  ngOnInit(): void {
    this.inscripcionService.getInscripcionesVotacionesActivas().subscribe((data)=>{
      data.map((x)=>{ 
        if(x.idInscripcion == this.data.idInscripcion){
          this.inscripcionVotacionElegida = x;
          // this.inscripcionVotacionElegida.candidatos.splice(3,1);
          // this.inscripcionVotacionElegida.candidatos.splice(2,1);
          if(this.inscripcionVotacionElegida.candidatos.length % 2 == 0 && this.inscripcionVotacionElegida.candidatos.length != 6){
            document.documentElement.style.setProperty('--tamanio-array','2');
          }
          else{
            document.documentElement.style.setProperty('--tamanio-array','3');
          }
        }
      })
      this.wait = true;
    })
  }

  selectImageList(element){
    this.optSelected = element;
  }

  votar(){
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialogRefConfirmation.open(ConfirmDialogComponent, {
      disableClose: true,
      autoFocus: false,
      data:{
        type:0,
        title:'Confirmar envío',
        message: 'Una vez confirmado, no se podrá deshacer'
      }
    });

    dialogRef.afterClosed().subscribe((data)=>{
      if(data == true){
        this.inscripcionService.votarInscripcion(this.getVotacion()).subscribe(()=>{
          this.dialogRef.close("enviado");
        })
      }
    })
  }

  getVotacion(): VotacionInscripcionRequest{
    return {
      idInscripcion: this.inscripcionVotacionElegida.idInscripcion,
      idCandidato: this.optSelected.idInsPersona
    }
  }
}
