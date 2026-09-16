import { HttpClient, LocalStorageTokenStore } from "@fa/core-desktop";
import { runtimeConfig } from "./config";
import { telemetry } from "./telemetry";

export const tokenStore = new LocalStorageTokenStore();

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
