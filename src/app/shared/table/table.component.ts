import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '@core/services';

import { filter } from 'rxjs/operators';


export enum ColumnType {
  DATE = 'date',
  DATETIME = 'datetime',
  TEXT = 'text',
}

export class ColumnDef {
  name: string;
  label: string;
  type?: ColumnType = ColumnType.TEXT;
  filterDownloadFunction?: (data: any) => boolean;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  hasAction = false;
  columnDate = ColumnType.DATE;
  columnDateTime = ColumnType.DATETIME;

  @Input()
  columns: ColumnDef[] = [];

  @Input()
  showRead = false;

  @Input()
  showDownload = false;

  @Input()
  nameActions = 'Acciones';

  @Input()
  showEdit = false;

  @Input()
  showDelete = false;

  @Input()
  filterReadFunction: (data: any) => boolean;

  @Input()
  filterDownloadFunction: (data: any) => boolean;

  @Input()
  filterEditFunction: (data: any) => boolean;

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

  @Input()
  set data(data: any[]) {
    this.dataSource.data = data;
  }

  constructor(private _dialogService: DialogService) {}

  ngOnInit(): void {
    this._setupDisplayedColumns();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  showReadAction<T>(item: T) {
    return (
      this.showRead &&
      (!this.filterReadFunction || this.filterReadFunction(item))
    );
  }

  showPrintAction<T>(item: T) {
    return (
      this.showDownload &&
      (!this.filterDownloadFunction || this.filterDownloadFunction(item))
    );
  }

  showEditAction<T>(item: T) {
    return (
      this.showEdit &&
      (!this.filterEditFunction || this.filterEditFunction(item))
    );
  }

  onDelete(item: any) {
    this._dialogService
      .openConfirm('¿Está seguro de eliminar el registro seleccionado?')
      .pipe(filter((isConfirmed) => isConfirmed))
      .subscribe(() => this.delete.emit(item));
  }

  private _setupDisplayedColumns() {
    this.hasAction = this.showRead || this.showEdit || this.showDelete || this.showDownload;
    this.displayedColumns = this.columns.map((x) => x.name);
    if (this.hasAction) {
      this.displayedColumns = this.displayedColumns.concat('actions');
    }
  }
}
