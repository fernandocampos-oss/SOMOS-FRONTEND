import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon("remote", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/remote.svg"));
   }

  ngOnInit(): void {
  }

  back() {
    this._router.navigate([''], { relativeTo: this.route });
  }

}
