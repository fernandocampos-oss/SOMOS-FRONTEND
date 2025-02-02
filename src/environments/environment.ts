export const environment = {
  production: false,
  moduloGr: true,
  // apiUrl: 'http://localhost:80/api',
  apiUrl: 'https://appsqa.essalud.gob.pe/marcaciones-service/api',
  environmentName: 'PÁGINA EN DESARROLLO (LOCAL)',
  sentry: {
    dsn: 'https://2d94879736dbd8e71ef6b39f4bc6f532@o4506984073986048.ingest.us.sentry.io/4507013372510208',
    environment: 'dev',
    release: 'somos-essalud-web@develop',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    showDialog: false
  },
  // uriSctr: 'http://localhost:4200/#/',
  // uriSctr: 'http://10.0.0.200:8580/sctr-demo/index.html',
};
