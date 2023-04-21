import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-change-passw',
  templateUrl: './change-passw.component.html',
  styleUrls: ['./change-passw.component.scss']
})
export class ChangePasswComponent implements OnInit {

  hidePassword = true;
  hideConfirmPassword = true;
  form: FormGroup;
  constructor(private _fb: FormBuilder,
              private _notification: NotificationService
  ) { }

  get nuevaClaveField() {
    return this.form.get('nuevaClave');
  }
  get nuevaClaveConfirmField() {
    return this.form.get('nuevaClaveConfirm');
  }

  ngOnInit(): void {
    this._createForm();
  }
  private _validatePasswordMatch() {
    if (this.nuevaClaveField.value !== this.nuevaClaveConfirmField.value) {
      this._notification.warning('Las contraseñas no coinciden');
      return false;
    }
    return true;
  }
  private _createForm() {
    this.form = this._fb.group({
      nuevaClave: [null, Validators.required],
      nuevaClaveConfirm: [null, Validators.required],
    });
  }
  onSubmit(){
    
  }
}
