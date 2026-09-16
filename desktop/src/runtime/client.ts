import { HttpClient, MemoryTokenStore } from "@fa/core-desktop";
import { runtimeConfig } from "./config";
import { telemetry } from "./telemetry";

export const tokenStore = new MemoryTokenStore();

export const httpClient = new HttpClient({
  baseUrl: runtimeConfig.apiBaseUrl,
  tokenStore,
  headers: {
    FaFrom: runtimeConfig.faFrom,
    FaVersionCode: runtimeConfig.versionCode,
    FaVersionName: runtimeConfig.versionName,
  },
  getHeaders: () => telemetry.getRequestHeaders(),
  onUnauthorized: () => tokenStore.clear(),
});
