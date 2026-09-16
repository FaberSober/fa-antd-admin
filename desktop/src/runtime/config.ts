import type { TelemetryEnvironment } from "@fa/core-desktop";

export interface DesktopRuntimeConfig {
  apiBaseUrl: string;
  faFrom: string;
  versionCode: string;
  versionName: string;
  telemetryAppKey: string;
  telemetryEnvironment: TelemetryEnvironment;
}

function normalizeBaseUrl(value: string | undefined, fallback: string): string {
  return (value?.trim() || fallback).replace(/\/+$/, "");
}

function resolveTelemetryEnvironment(value: string | undefined): TelemetryEnvironment {
  if (value === "development" || value === "test" || value === "staging" || value === "production") {
    return value;
  }
  return import.meta.env.DEV ? "development" : "production";
}

export const runtimeConfig: DesktopRuntimeConfig = Object.freeze({
  // 开发环境使用 /api 交给 Vite proxy；生产环境应配置为完整 API 地址。
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_APP_API_BASE_URL, "/api"),
  // 后端现有非 Web 客户端标识使用 FaApp，避免沿用 Web 的签名协议。
  faFrom: import.meta.env.VITE_APP_FA_FROM?.trim() || "FaApp",
  versionCode: import.meta.env.VITE_APP_VERSION_CODE?.trim() || "1",
  versionName: import.meta.env.VITE_APP_VERSION_NAME?.trim() || "0.0.1",
  telemetryAppKey: import.meta.env.VITE_APP_TELEMETRY_APP_KEY?.trim() || "",
  telemetryEnvironment: resolveTelemetryEnvironment(import.meta.env.VITE_APP_TELEMETRY_ENV),
});
