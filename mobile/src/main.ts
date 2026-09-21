import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { telemetry } from './features/fa-core-mobile/telemetry';
import { useThemeStore } from './features/fa-core-mobile/theme';

export function createApp() {
  const app = createSSRApp(App);
  telemetry.init();
  app.config.errorHandler = (error, _instance, info) => {
    telemetry.captureException(error, { source: 'vue.errorHandler', info });
  };
  const pinia = createPinia();
  app.use(pinia);
  useThemeStore(pinia);

  return {
    app,
  };
}
