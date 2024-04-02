import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env';

// -----------------------------
// SENTRY INTEGRATION
// -----------------------------

// npm install --save @sentry/angular-ivy
import * as Sentry from '@sentry/angular-ivy';

Sentry.init({
  dsn: environment.sentry.dsn,
  environment: environment.sentry.environment,
  release: environment.sentry.release,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
      maskAllInputs: false,
      mutationBreadcrumbLimit: 150,
      mutationLimit: 500,
      networkCaptureBodies: true,
      networkDetailAllowUrls: ['appsqa.essalud.gob.pe', 'apps.essalud.gob.pe']
    }),
    Sentry.replayCanvasIntegration()
  ],
  // Performance Monitoring
  tracesSampleRate: environment.sentry.tracesSampleRate,
  tracePropagationTargets: ['localhost', 'appsqa.essalud.gob.pe', 'apps.essalud.gob.pe'],
  // Session Replay
  replaysSessionSampleRate: environment.sentry.replaysSessionSampleRate,
  replaysOnErrorSampleRate: environment.sentry.replaysOnErrorSampleRate,
});

// -----------------------------

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
