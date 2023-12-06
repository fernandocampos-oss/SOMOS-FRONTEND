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
import { ChangePasswComponent } from './components/sidenav/change-passw/change-passw/change-passw.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from './components/sidenav/edit-user/edit-user.component';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    FooterComponent,
    SidenavComponent,
    UserAvatarComponent,
    ChangePasswComponent,
    EditUserComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, LayoutRoutingModule, ReactiveFormsModule, MatGridListModule],
})
export class LayoutModule {}
