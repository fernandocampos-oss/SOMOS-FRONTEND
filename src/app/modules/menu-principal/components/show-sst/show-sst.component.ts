import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-sst',
  templateUrl: './show-sst.component.html',
  styleUrls: ['./show-sst.component.scss']
})
export class ShowSstComponent implements OnInit {

  form4Mobile = false;
  constructor(
    private responsive  : BreakpointObserver) { }

  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      ])
      .subscribe(result => {
        this.form4Mobile = false; 
        if (result.matches) {
          this.form4Mobile = true;
        }
  });
  }

}
