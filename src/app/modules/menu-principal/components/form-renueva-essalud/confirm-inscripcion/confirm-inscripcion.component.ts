import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RenuevaEssaludService } from '@data/services/renueva-essalud.service';

@Component({
  selector: 'app-confirm-inscripcion',
  templateUrl: './confirm-inscripcion.component.html',
  styleUrls: ['./confirm-inscripcion.component.scss']
})
export class ConfirmInscripcionComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ConfirmInscripcionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private renuevaService: RenuevaEssaludService) { }

  ngOnInit(): void {
    console.log(this.data.inscripcion)
  }


  guardar() {
    this.data.inscripcion.enviado = true;
    this.renuevaService.saveProyecto(this.data.inscripcion).subscribe((proyecto: any) => {
      console.log(proyecto)
    });
    const resultData = {
      confirmacion: true
    };
    this.dialogRef.close(resultData);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
