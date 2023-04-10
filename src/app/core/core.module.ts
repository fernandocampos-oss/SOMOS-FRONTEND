import { NgModule } from '@angular/core';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { HoverClassesDirective } from './directives/hover-classes.directive';
import { LowercaseDirective } from './directives/lower-case.directive';
import { UppercaseDirective } from './directives/upper-case.directive';
import { NumericDirective } from './directives/numeric.directive';
import { RoleDirective } from './directives/role.directive';

const DIRECTIVES = [
  HoverClassesDirective,
  LowercaseDirective,
  UppercaseDirective,
  NumericDirective,
  RoleDirective,
];
const PIPES = [CapitalizePipe];

const SHARED = [...DIRECTIVES, ...PIPES];

@NgModule({
  declarations: [...SHARED],
  exports: [...SHARED],
})
export class CoreModule {}
