export const environment = {
  production: false,
  appName: 'Plannerstats App',
  //apiBaseUrl: 'http://localhost:3000/plannerstats', // API local
  apiBaseUrl: 'https://api-dev.softoursistemas.org/plannerstats',
  oneSignal: {
    appId: '54720b18-2e9a-4df7-ae13-ff078898cdfd', // ID de desarrollo
    googleProjectNumber: '1234567890', // Solo para Android
    safariWebId: 'web.onesignal.dev.123', // Solo para iOS web
  },
  enableDebug: true, // Mostrar logs
};
