export const environment = {
  production: true,
  moduloGr: true,
  apiUrl: 'https://appsqa.essalud.gob.pe/marcaciones-service/api',
  environmentName: 'PÁGINA EN DESARROLLO (QA)',
  sentry: {
    dsn: 'https://2d94879736dbd8e71ef6b39f4bc6f532@o4506984073986048.ingest.us.sentry.io/4507013372510208',
    environment: 'qa',
    release: 'somos-essalud-web@1.2.9',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    showDialog: false
  }
};
