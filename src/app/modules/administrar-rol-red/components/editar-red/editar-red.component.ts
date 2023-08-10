import { startWith, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services';
import { Observable } from 'rxjs';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-editar-red',
  templateUrl: './editar-red.component.html',
  styleUrls: ['./editar-red.component.scss']
})
export class EditarRedComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  options = [
    { cod: ' ', descripcion: '-- TODOS --' },
    { cod: '0221', descripcion: 'RED ASISTENCIAL HUÁNUCO' },
    { cod: '0213', descripcion: 'RED ASISTENCIAL ICA' },
    { cod: '0225', descripcion: 'RED ASISTENCIAL HUANCAVELICA' },
    { cod: '0206', descripcion: 'RED PRESTACIONAL REBAGLIATI' },
    { cod: '0204', descripcion: 'RED PRESTACIONAL ALMENARA' },
    { cod: '0100', descripcion: 'SEDE CENTRAL LIMA-AFESSALUD' },
    { cod: '0222', descripcion: 'RED ASISTENCIAL PASCO' },
    { cod: '0231', descripcion: 'RED ASISTENCIAL UCAYALI' },
    { cod: '0200', descripcion: 'SEDE CENTRAL LIMA-Fondo Salud' },
    { cod: '0208', descripcion: 'RED PRESTACIONAL SABOGAL' },
    { cod: '0216', descripcion: 'RED ASISTENCIAL PIURA' },
    { cod: '0226', descripcion: 'RED ASISTENCIAL PUNO' },
    { cod: '0236', descripcion: 'RED PRESTACIONAL LAMBAYEQUE' },
    { cod: '0233', descripcion: 'RED ASISTENCIAL AMAZONAS' },
    { cod: '0201', descripcion: 'CENTRO NACIONAL DE SALUD RENAL' },
    { cod: '0202', descripcion: 'INST. NACIONAL CARDIOVASCULAR' },
    { cod: '0212', descripcion: 'RED ASISTENCIAL JUNIN' },
    { cod: '0219', descripcion: 'RED ASISTENCIAL AREQUIPA' },
    { cod: '0215', descripcion: 'RED ASISTENCIAL CUSCO' },
    { cod: '0211', descripcion: 'RED ASISTENCIAL MADRE DE DIOS' },
    { cod: '0229', descripcion: 'RED ASISTENCIAL LORETO' },
    { cod: '0232', descripcion: 'RED ASISTENCIAL LA LIBERTAD' },
    { cod: '0214', descripcion: 'RED ASISTENCIAL APURIMAC' },
    { cod: '0220', descripcion: 'RED ASISTENCIAL CAJAMARCA' },
    { cod: '0228', descripcion: 'RED ASISTENCIAL TACNA' },
    { cod: '0217', descripcion: 'RED ASISTENCIAL JULIACA' },
    { cod: '0235', descripcion: 'RED ASISTENCIAL JAEN' },
    { cod: '0218', descripcion: 'RED ASISTENCIAL TARAPOTO' },
    { cod: '0230', descripcion: 'RED ASISTENCIAL TUMBES' },
    { cod: '0227', descripcion: 'RED ASISTENCIAL ANCASH' },
    { cod: '0224', descripcion: 'RED ASISTENCIAL AYACUCHO' },
    { cod: '0234', descripcion: 'RED ASISTENCIAL MOYOBAMBA' },
    { cod: '0210', descripcion: 'RED ASISTENCIAL HUARAZ' },
    { cod: '0209', descripcion: 'RED ASISTENCIAL MOQUEGUA' },
  ];

  constructor(
    private _notification: NotificationService,
    private _dialogRef: MatDialog,
  ) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descripcion),
      map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
    );
  }

   //red
   private _filter(value: string) {
    return this.options.filter(option => option.descripcion.toLowerCase().includes(value.toLowerCase()));
  }
  displayFnRed(selectedoption) {
    console.log(selectedoption)
    return selectedoption ? selectedoption.descripcion : undefined;
  }
  onSelectionChangeRed(event: any) {
    // this.redSeleccionadoTmp = event.option.value;
  }

  @ViewChild('select') select: MatSelect;

  allSelected=false;
   foods: any[] = [
    {value: 'steak-0', viewValue: 'RED PRESTACIONAL REBAGLIATI'}, 
    {value: 'pizza-1', viewValue: 'RED PRESTACIONAL ALMENARA'},
    {value: 'tacos-2', viewValue: 'EDE CENTRAL LIMA-AFESSALUD'}
  ];
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
   optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  save() {
    this._notification.success("Asignacion modificada!");
    this._dialogRef.closeAll();
  }

}
