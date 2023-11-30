import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-alerta-peso',
  templateUrl: './alerta-peso.component.html',
  styleUrls: ['./alerta-peso.component.scss']
})
export class AlertaPesoComponent implements OnInit {
  pesoGrabado: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialog,
  ) { }

  ngOnInit(): void {
    this.pesoGrabado = this.data.peso;
  }

}
