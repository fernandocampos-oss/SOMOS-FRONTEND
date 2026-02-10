export const environment = {
  production: false,
  moduloGr: true,
  apiUrl: 'http://10.0.32.157/api',  // Tu IP y puerto del backend (puerto 80)
  environmentName: 'PÁGINA EN DESARROLLO (RED LOCAL)',
  recaptchaSiteKey: '6LeCrusqAAAAADekhdRw7__HWF4id1pYDkhsSkhh',
  sentry: {
    dsn: 'https://2d94879736dbd8e71ef6b39f4bc6f532@o4506984073986048.ingest.us.sentry.io/4507013372510208',
    environment: 'dev',
    release: 'somos-essalud-web@develop',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    showDialog: false
  },
};
