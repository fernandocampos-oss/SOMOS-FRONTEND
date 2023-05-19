import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs/operators';
import { AuthService } from '@data/services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  @ViewChild('snav')
  sidenav: MatDrawer;
  rol: number;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _authService: AuthService,
    private _router: Router
  ) {
    this._router.events.subscribe((ev) => {
      if(ev instanceof NavigationEnd){
        this.rol = this._authService.getRol();
        if (this.rol != 4 && ev.url.includes('/admin')){
          this._router.navigate(['/']);
        }
      }
    });
    this.mobileQuery = media.matchMedia('(max-width: 790px)');
    // FIXME: Review type error
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this._router.events
      .pipe(filter(() => this.mobileQuery.matches))
      .subscribe(() => {
        // close sidenav on routing
        this.sidenav.close();
      });
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
