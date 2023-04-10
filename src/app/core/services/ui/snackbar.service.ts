import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}
  success(message: string, action: string = 'ACEPTAR') {
    return this._snackBar.open(message, action, {
      panelClass: 'success-snackbar',
    });
  }
}
