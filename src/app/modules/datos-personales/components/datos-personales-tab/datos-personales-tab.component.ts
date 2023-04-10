import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ComponentType } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { DatosPersonalesUpdateComponent } from '../dialogs/datos-personales-update/datos-personales-update.component';


@Component({
  selector: 'app-datos-personales-tab',
  templateUrl: './datos-personales-tab.component.html',
  styleUrls: ['./datos-personales-tab.component.scss'],
})
export class DatosPersonalesTabComponent implements OnInit {

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];


  constructor(private _matDialog: MatDialog) {}

  ngOnInit(): void {}

  private _openAddUpdateDialog<T>(
    dialog: ComponentType<T>,
    data: any,
    callback: () => void
  ) {
    this._matDialog
      .open(dialog, { data, disableClose: true })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((isSuccess) => isSuccess)
      )
      .subscribe(() => callback.call(this));
  }

  onUpdatePersonalData() {
    this._openAddUpdateDialog(DatosPersonalesUpdateComponent, null, null);
  }


  onClick() {
   
    const fileUpload = this.fileUpload.nativeElement;
    //fileUpload
    // .onchange = () => {  
    //   for (let index = 0; index < fileUpload.files.length; index++)  
    //   {  
    //     const file = fileUpload.files[index];  
    //     this.files.push({ data: file, inProgress: false, progress: 0});  
    //   }  
     
    // };  
    fileUpload.click();  
  }

}
