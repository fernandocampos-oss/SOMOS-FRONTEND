import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import LocaleEsPe from '@angular/common/locales/es-PE.js';
import { RouterModule } from '@angular/router';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

// Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { NotifierInterceptor } from './core/interceptors/notifier.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

// Modules
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule as Layout } from '@angular/cdk/layout';
import { LayoutModule } from './layout/layout.module';
import { CoreModule } from './core/core.module';

// Components
import { HomeComponent } from '@modules/home/home.component';
import { AppComponent } from './app.component';
import { MaterialModule } from '@material';

import { AppConfig } from '@core/configs';
import { MatIconModule } from '@angular/material/icon';

registerLocaleData(LocaleEsPe);

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    Layout,

    AppRoutingModule,
    ToastrModule.forRoot(AppConfig.TOAST_CONFIG),
    MaterialModule,
    MatIconModule,
    NgxSpinnerModule,
    ZXingScannerModule,
    LayoutModule,
    SharedModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotifierInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es-PE' },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
