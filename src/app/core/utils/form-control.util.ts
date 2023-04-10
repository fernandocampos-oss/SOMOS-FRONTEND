import { AbstractControl } from '@angular/forms';
export class FormControlUtil {
  static resetWithoutEvent(control: AbstractControl) {
    control.setValue(null, { emitEvent: false });
  }
}
