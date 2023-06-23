import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@core/services';
import { encuestaRespuesta } from '@data/models/menu-principal/menu-encuesta.model';
import { MenuPrincipalService } from '@data/services/menu-principal.service';
import { EncuestaSimpleComponent } from '../encuesta-simple.component';
import { DialogTempComponent } from '../dialog-temp/dialog-temp.component';

@Component({
  selector: 'app-confirm-encuesta-simple',
  templateUrl: './confirm-encuesta-simple.component.html',
  styleUrls: ['./confirm-encuesta-simple.component.scss']
})
export class ConfirmEncuestaSimpleComponent implements OnInit {

  votacion: string;

  constructor(private dialogRef: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _menuService    : MenuPrincipalService,
              private dialog          : MatDialog){ 

              }

  ngOnInit(): void {
    if(this.data.opcion == 1){
      this.votacion = 'Tarjetas para canje de alimentos y juguetes';
    }
    if(this.data.opcion == 2){
      this.votacion = 'Abono en cuenta';
    }
  }
  closeAll(){
    this._menuService.sendEncuesta(1, this.getModelo()).subscribe((dataItem) => {});
    // this._snackbar.success('Encuesta enviada correctamente');
    this.dialogRef.closeAll();
    const dialogRef2: MatDialogRef<DialogTempComponent> = this.dialog.open(DialogTempComponent, {
      disableClose: true,
      minWidth: '22em',
      maxWidth:'40em',
      autoFocus: false,
      });
  }
  public getModelo(): encuestaRespuesta{
    return {
      idSede: 1,
      idGrupoPersonal: 1,
      idAreaPersonal: 1,
      idTiempoServicio: 1,
      respuestas: [{
        idPregunta: 1,
        idAlternativa: this.data.opcion
      }]
    };
  }
}
