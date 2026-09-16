import { relaunch } from "@tauri-apps/plugin-process";
import { check, type DownloadEvent, type Update } from "@tauri-apps/plugin-updater";

export interface UpdateDownloadProgress {
  downloadedBytes: number;
  contentLength?: number;
}

export type UpdateProgressHandler = (progress: UpdateDownloadProgress) => void;

export function checkForUpdate(): Promise<Update | null> {
  return check({ timeout: 30_000 });
}

export async function downloadUpdate(update: Update, onProgress?: UpdateProgressHandler): Promise<void> {
  let downloadedBytes = 0;
  let contentLength: number | undefined;

  await update.download((event: DownloadEvent) => {
    if (event.event === "Started") {
      contentLength = event.data.contentLength;
    } else if (event.event === "Progress") {
      downloadedBytes += event.data.chunkLength;
    }

    onProgress?.({ downloadedBytes, contentLength });
  });
}

export async function installUpdate(update: Update): Promise<void> {
  await update.install();
  await relaunch();
}
