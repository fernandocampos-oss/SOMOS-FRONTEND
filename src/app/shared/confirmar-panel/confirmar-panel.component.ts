import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-panel',
  templateUrl: './confirmar-panel.component.html',
  styleUrls: ['./confirmar-panel.component.scss']
})
export class ConfirmarPanelComponent {

  public confirmMessage: string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
   */

  constructor(
    public _dialogRef: MatDialogRef<ConfirmarPanelComponent>
  ) { }

}
