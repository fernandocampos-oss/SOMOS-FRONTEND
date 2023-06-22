import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@core/services';
import { encuestaRespuesta } from '@data/models/menu-principal/menu-encuesta.model';
import { MenuPrincipalService } from '@data/services/menu-principal.service';

@Component({
  selector: 'app-confirm-encuesta-simple',
  templateUrl: './confirm-encuesta-simple.component.html',
  styleUrls: ['./confirm-encuesta-simple.component.scss']
})
export class ConfirmEncuestaSimpleComponent implements OnInit {

  constructor(private dialogRef: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _snackbar: SnackbarService,
              private _menuService    : MenuPrincipalService){ 

              }

  ngOnInit(): void {
  }
  closeAll(){
    this._menuService.sendEncuesta(1, this.getModelo()).subscribe((dataItem) => {});
    this._snackbar.success('Encuesta enviada correctamente');
    this.dialogRef.closeAll();
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
