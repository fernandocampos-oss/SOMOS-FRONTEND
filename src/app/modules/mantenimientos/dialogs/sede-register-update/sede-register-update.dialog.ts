import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { SedeService } from '@data/services';
import { Sede } from '@data/models';
import { NotificationService } from '@core/services';

@UntilDestroy()
@Component({
  selector: 'app-sede-register-update',
  templateUrl: './sede-register-update.dialog.html',
  styleUrls: ['./sede-register-update.dialog.scss'],
})
export class SedeRegisterUpdateDialog implements OnInit {
  form: FormGroup;
  isEdit: boolean;
  get descripcionField() {
    return this.form.get('descripcion');
  }
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<void>,
    private _sedeService: SedeService,
    private _notification: NotificationService,
    @Inject(MAT_DIALOG_DATA)
    public data: Sede
  ) {
    this.isEdit = data?.idSede > 0;
  }

  ngOnInit(): void {
    this._createForm();
    this._setupDataForm();
  }
  private _setupDataForm() {
    if (this.isEdit) {
      this.form.patchValue(this.data);
    }
  }

  onSave() {
    if (this.form.valid) {
      const save$ = this._sedeService.save(this.form.value);
      const update$ = this._sedeService.update(
        this.data?.idSede,
        this.form.value
      );
      const transaction$: Observable<any> = this.isEdit ? update$ : save$;
      transaction$.pipe(untilDestroyed(this)).subscribe(() => {
        const messsage = this.isEdit
          ? 'Sede editada correctamente'
          : 'Sede creada correctamente';
        this._notification.success(messsage);
        this._dialogRef.close(true);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
  private _createForm() {
    this.form = this._fb.group({
      descripcion: [null, [Validators.required]],
      terminalSap: [null, [Validators.required]],
    });
  }
}
