import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '@core/services';
import { NotificationService } from '@core/services';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service'
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-task-reject',
  templateUrl: './task-reject.component.html',
  styleUrls: ['./task-reject.component.scss']
})
export class TaskRejectComponent implements OnInit {

  form: FormGroup;
  idTarea: number;
  numerador: number=0;

  constructor(
    private _fb: FormBuilder,
    private _dialogService: DialogService,
    public dialogRef: MatDialogRef<TaskRejectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private services: GestionRendimientoService,
  ) { }

  ngOnInit(): void {
    this.idTarea=this.data.id;
    this.numerador=this.data.numerador;
    this.createForm();
  }

  createForm(){
    this.form = this._fb.group({
      frmMotivo: [null, [Validators.required]],
      frmDias: [0,[Validators.required]]
    })
  }

  confirmRechazar(){
    if(this.form.valid){
      this._dialogService
      .openConfirm('¿Está seguro de Rechazar la tarea?')
      .pipe(filter((isConfirmed) => isConfirmed))
      .subscribe(() => this.rechazar());
    } else {
      this._notification.error("Se debe ingresar un motivo")
    }
  }

  rechazar(){
    let obj = new Rechazar();
    obj.id=this.idTarea;
    obj.estado=false;
    obj.motivo=this.form.value.frmMotivo;
    obj.dias=this.form.value.frmDias
    this.services.AprobarRechazarTarea(obj).subscribe({
      next: data => {
        this.dialogRef.close("ok");
        this._notification.success("Se actualizó el estado de la tarea")
      },
      error: error => {
        this._notification.error("Rechazar: Se produjo un error")
      }
    });
  }

}

export class Rechazar {
  id: number
  estado: boolean
  motivo: string
  dias: number
}