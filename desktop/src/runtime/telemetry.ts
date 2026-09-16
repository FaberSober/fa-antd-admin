import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { isTauri } from "@tauri-apps/api/core";
import { TelemetryClient, getDesktopTelemetryContext } from "@fa/core-desktop";
import { runtimeConfig } from "./config";

export const telemetry = new TelemetryClient();

async function readTauriValue(read: () => Promise<string>): Promise<string | undefined> {
  try {
    return await read();
  } catch {
    return undefined;
  }
}

export async function initTelemetry(): Promise<boolean> {
  if (!runtimeConfig.telemetryAppKey) return false;

  const context = getDesktopTelemetryContext();
  if (isTauri()) {
    const [appVersion, tauriVersion] = await Promise.all([readTauriValue(getVersion), readTauriValue(getTauriVersion)]);
    context.appVersion = appVersion || runtimeConfig.versionName;
    context.tauriVersion = tauriVersion;
  } else {
    context.appVersion = runtimeConfig.versionName;
  }

  telemetry.init({
    appKey: runtimeConfig.telemetryAppKey,
    clientType: "DESKTOP",
    environment: runtimeConfig.telemetryEnvironment,
    release: runtimeConfig.versionName,
    collectorBaseUrl: runtimeConfig.apiBaseUrl,
    context,
  });
  return telemetry.isInitialized();
}
