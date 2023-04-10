import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';

import { AuthService } from '@data/services';
import { Role } from '@data/enums';

@Directive({
  selector: '[appRole]',
})
export class RoleDirective implements OnInit {
  @Input()
  appRole: Role;

  constructor(
    private _authService: AuthService,
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef
  ) {}
  ngOnInit(): void {
    this._viewContainer.clear();
    if (this.appRole && this._authService.hasRol(this.appRole)) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    }
  }
}
