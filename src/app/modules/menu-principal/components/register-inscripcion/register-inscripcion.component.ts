import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { InscripcionResponse } from '@data/models/inscripcion/inscripcion.model';
import { InscripcionService } from '@data/services/inscripcion.service';

@Component({
  selector: 'app-register-inscripcion',
  templateUrl: './register-inscripcion.component.html',
  styleUrls: ['./register-inscripcion.component.scss']
})
export class RegisterInscripcionComponent implements OnInit {

  inscripcionRespondida: boolean;
  infoDialog: InscripcionResponse = Object();

  constructor(
    private dialogRef: MatDialogRef<RegisterInscripcionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private inscripcionService: InscripcionService) { }

  ngOnInit(): void {
    // console.log(this.data)
    this.inscripcionService.getInscripcionPorId(this.data.obj).subscribe((data)=>{
      this.infoDialog = data;
    })
  }

  enviarInscripcion(){
    this.inscripcionService.registerUserToInscripcion(this.data.obj).subscribe(()=>{
    })
    // this._notification.success('¡Se registró su inscripción!');
    this.dialogRef.close("enviado");
  }
}
