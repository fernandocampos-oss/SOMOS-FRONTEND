import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ColumnDef, TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
})
export class CrudComponent implements OnInit, AfterViewInit {

  constructor( private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer){
    this.matIconRegistry.addSvgIcon("file_export",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/file_export.svg"));
  }

  @Input()
  columns: ColumnDef[] = [];

  @Input()
  showRead = false;

  @Input()
  showDownload = false;

  @Input()
  showExport = false;

  @Input()
  showEdit = false;

  @Input()
  showDelete = false;

  @Input()
  showFilter = false;

  @Input()
  filterDownloadFunction: (data: any) => boolean;

  @Input()
  filterEditFunction: (data: any) => boolean;

  @Input()
  data = [];

  @Input()
  icon :string = 'add'

  @Output()
  create = new EventEmitter<any>();

  @Output()
  read = new EventEmitter<any>();

  @Output()
  edit = new EventEmitter<any>();

  @Output()
  delete = new EventEmitter<any>();

  @Output()
  download = new EventEmitter<any>();

  @Output()
  export = new EventEmitter<void>();

  @ViewChild(TableComponent)
  table: TableComponent;

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  applyFilter(event: Event): void {
    this.table.applyFilter(event);
  }

  onRead(item: any) {
    this.read.emit(item);
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDownload(item: any) {
    this.download.emit(item);
  }

  onExport() {
    this.export.emit();
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }
}
