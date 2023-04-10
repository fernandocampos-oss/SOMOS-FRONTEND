import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from '@material';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    FooterComponent,
    SidenavComponent,
    UserAvatarComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, LayoutRoutingModule],
})
export class LayoutModule {}
