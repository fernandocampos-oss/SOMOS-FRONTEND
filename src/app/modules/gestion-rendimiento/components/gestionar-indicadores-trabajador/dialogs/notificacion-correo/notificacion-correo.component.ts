import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { EmailNotificacionRequestDto } from '@data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '@data/services/gestion-rendimiento.service';

@Component({
  selector: 'app-notificacion-correo',
  templateUrl: './notificacion-correo.component.html',
  styleUrls: ['./notificacion-correo.component.scss']
})
export class NotificacionCorreoComponent implements OnInit {
  dto: EmailNotificacionRequestDto;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private _grService: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    // console.log(this.data);
    this.dto = new EmailNotificacionRequestDto();
    this.dto.email = this.data.correo;
    this.dto.url = "";
  }

  async enviarCorreo() {
    // console.log(this.dto);
    let send = await this._grService.sendCorreoNotificacion(this.dto).then((data: any) => {
      if (data = 1) {
        this._notification.success("Correo Enviado");
      } else {
        this._notification.warning("Enviar correo: Se produjo un error");
      }
    });

  }

}
