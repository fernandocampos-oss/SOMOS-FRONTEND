import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ddjj-conflictos',
  templateUrl: './ddjj-conflictos.component.html',
  styleUrls: ['./ddjj-conflictos.component.scss']
})
export class DdjjConflictosComponent implements OnInit {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;
  constructor(   private _router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  default(){
    return null;
  }


  back(){
    this._router.navigate(['../'], { relativeTo: this.route });
  }

}
