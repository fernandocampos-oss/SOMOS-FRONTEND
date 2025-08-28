import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service } from 'ng-recaptcha';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import LocaleEsPe from '@angular/common/locales/es-PE.js';
import { Router, RouterModule } from '@angular/router';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { environment } from '@env';

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

// -----------------------------
// SENTRY INTEGRATION
// -----------------------------
import * as Sentry from '@sentry/angular-ivy';
// -----------------------------

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
    RecaptchaV3Module,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey },
    ReCaptchaV3Service,
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
    // -----------------------------
    // SENTRY INTEGRATION
    // -----------------------------
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({ showDialog: environment.sentry.showDialog })
    },
    {
      provide: Sentry.TraceService,
      deps: [Router]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true
    }
    // -----------------------------
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
