import { Alert, Button, Card, Spinner } from "@fa/core-desktop";
import { isTauri } from "@tauri-apps/api/core";
import type { Update } from "@tauri-apps/plugin-updater";
import { useState } from "react";
import { runtimeConfig } from "../runtime/config";
import { checkForUpdate, downloadUpdate, installUpdate, type UpdateDownloadProgress } from "../runtime/updater";

type UpdateStatus = "idle" | "checking" | "latest" | "available" | "downloading" | "ready" | "installing" | "error";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUpdateDate(date: string | undefined): string | null {
  if (!date) return null;
  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? null : new Date(timestamp).toLocaleString("zh-CN");
}

function getErrorMessage(status: "check" | "download" | "install"): string {
  const action = { check: "检查", download: "下载", install: "安装" }[status];
  return `更新${action}失败，请检查网络后重试。`;
}

export function UpdateCard() {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [update, setUpdate] = useState<Update | null>(null);
  const [progress, setProgress] = useState<UpdateDownloadProgress>({ downloadedBytes: 0 });
  const [error, setError] = useState<string | null>(null);
  const tauriRuntime = isTauri();
  const busy = status === "checking" || status === "downloading" || status === "installing";
  const updateDate = formatUpdateDate(update?.date);
  const progressPercent = progress.contentLength
    ? Math.min(100, Math.round((progress.downloadedBytes / progress.contentLength) * 100))
    : null;

  async function handleCheck(): Promise<void> {
    if (!tauriRuntime) {
      setStatus("error");
      setError("当前开发预览不支持自动更新，请使用 Desktop 客户端检查更新。");
      return;
    }

    setStatus("checking");
    setUpdate(null);
    setError(null);
    setProgress({ downloadedBytes: 0 });

    try {
      const latestUpdate = await checkForUpdate();
      if (!latestUpdate) {
        setStatus("latest");
        return;
      }
      setUpdate(latestUpdate);
      setStatus("available");
    } catch {
      setStatus("error");
      setError(getErrorMessage("check"));
    }
  }

  async function handleDownload(): Promise<void> {
    if (!update) return;

    setStatus("downloading");
    setError(null);
    setProgress({ downloadedBytes: 0 });
    try {
      await downloadUpdate(update, setProgress);
      setStatus("ready");
    } catch {
      setStatus("error");
      setError(getErrorMessage("download"));
    }
  }

  async function handleInstall(): Promise<void> {
    if (!update || !window.confirm("更新包已下载，安装后客户端将重启。是否现在安装？")) return;

    setStatus("installing");
    setError(null);
    try {
      await installUpdate(update);
    } catch {
      setStatus("error");
      setError(getErrorMessage("install"));
    }
  }

  return (
    <Card className="desktop-update-card" aria-labelledby="desktop-update-title">
      <div className="desktop-update-heading">
        <div>
          <p className="desktop-update-kicker">DESKTOP / UPDATE</p>
          <h2 id="desktop-update-title">客户端更新</h2>
          <p>当前版本 {runtimeConfig.versionName}</p>
        </div>
        <Button variant="secondary" onClick={() => void handleCheck()} disabled={busy || !tauriRuntime}>
          {status === "checking" ? <Spinner /> : null}
          {status === "checking" ? "检查中…" : status === "error" ? "重新检查" : "检查更新"}
        </Button>
      </div>

      {!tauriRuntime && status === "idle" && <p className="desktop-update-message">当前开发预览不支持自动更新。</p>}
      {status === "latest" && <Alert variant="success">当前已是最新版本。</Alert>}
      {status === "error" && error && <Alert>{error}</Alert>}

      {update && (status === "available" || status === "downloading" || status === "ready" || status === "installing") && (
        <div className="desktop-update-details">
          <div>
            <p className="desktop-update-version">发现新版本 {update.version}</p>
            {updateDate && <p className="desktop-update-date">发布时间：{updateDate}</p>}
          </div>
          {update.body && <p className="desktop-update-notes">{update.body}</p>}

          {status === "available" && (
            <Button onClick={() => void handleDownload()}>
              下载更新
            </Button>
          )}
          {status === "downloading" && (
            <div className="desktop-update-progress" aria-live="polite">
              <div className="desktop-update-progress-label">
                <span>正在下载更新…</span>
                <span>{progressPercent === null ? formatBytes(progress.downloadedBytes) : `${progressPercent}%`}</span>
              </div>
              <progress max="100" value={progressPercent ?? undefined} />
            </div>
          )}
          {status === "ready" && (
            <div className="desktop-update-install">
              <span>下载完成，确认后重启安装。</span>
              <Button onClick={() => void handleInstall()}>立即安装</Button>
            </div>
          )}
          {status === "installing" && <Alert variant="info">正在安装更新，客户端即将重启…</Alert>}
        </div>
      )}
    </Card>
  );
}
