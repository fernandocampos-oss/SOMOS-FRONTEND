import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services';
import { Tarea } from '../../../../../../data/models/gestion-rendimiento/gestion-rendimiento.model';
import { GestionRendimientoService } from '../../../../../../data/services/gestion-rendimiento.service';
import { DialogService } from '@core/services';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-add-task',
  templateUrl: './user-add-task.component.html',
  styleUrls: ['./user-add-task.component.scss']
})
export class UserAddTaskComponent implements OnInit {

  form: FormGroup;
  auto: boolean = false;
  idUsuario: number=0;

  constructor(
    private _dialogService: DialogService,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService,
    private services: GestionRendimientoService,
    private _dlg: MatDialogRef<UserAddTaskComponent>,
  ) { }

  ngOnInit(): void {
    this.auto = this.data.auto;
    this.idUsuario=this.data.id;
    this.createForm();
  }

  createForm(){
    this.form = this._fb.group({
      frmDescripcion: [null,[Validators.required, Validators.maxLength(300)]],
      frmFecInicio: [this.auto == true ? new Date():null,[Validators.required]],
      frmFecFin: [this.auto == true ? new Date():null,[Validators.required]],
    });
  }

  onSave(){
    if(!this.form.valid){
      this._notification.error("Se deben ingresar los campos requeridos")
    } else {
      let t = new Tarea();
      t.idEquipoIntegrante=this.idUsuario;
      t.fechaInicio=new Date(this.form.value.frmFecInicio);
      t.fechaFin=new Date(this.form.value.frmFecFin);
      t.descripcion=this.form.value.frmDescripcion;
      this.services.RegistrarTarea(t).subscribe((dataItem) => {
        if (dataItem.codigo == 1) {
          this._notification.success(dataItem.msj);
          this._dlg.close();
        } else {
          this._notification.error(dataItem.msj)
        }
      });
    }
  }

  confirmSave(){
    this._dialogService
    .openConfirm('¿Está seguro de registrar la tarea?')
    .pipe(filter((isConfirmed) => isConfirmed))
    .subscribe(() => this.onSave());
  }

}
