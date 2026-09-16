import { Button, Card, Spinner, type TelemetryClient } from "@fa/core-desktop";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILE_COUNT = 5;

export interface FileUploadResult {
  id: string;
  originalFilename?: string | null;
  size?: number | null;
  contentType?: string | null;
}

export interface FileUploadDemoPageProps {
  telemetry: TelemetryClient;
  uploadFile(file: File): Promise<FileUploadResult>;
  onBack(): void;
}

type FileStatus = "ready" | "uploading" | "success" | "error";

interface UploadItem {
  key: string;
  file: File;
  status: FileStatus;
  result?: FileUploadResult;
  error?: string;
}

function getFileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : "文件上传失败，请稍后重试。";
}

function getStatusText(item: UploadItem): string {
  if (item.status === "uploading") return "上传中";
  if (item.status === "success") return `已完成 · ID ${item.result?.id || "未知"}`;
  if (item.status === "error") return item.error || "上传失败";
  return "待上传";
}

export function FileUploadDemoPage({ telemetry, uploadFile, onBack }: FileUploadDemoPageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("请选择文件后开始上传");

  function addFiles(files: File[]): void {
    const available = MAX_FILE_COUNT - items.length;
    const accepted: UploadItem[] = [];
    let rejectedMessage = "";

    for (const file of files.slice(0, Math.max(available, 0))) {
      if (file.size > MAX_FILE_SIZE) {
        rejectedMessage = `${file.name} 超过 20 MB 大小限制`;
        continue;
      }
      if (items.some((item) => item.key === getFileKey(file)) || accepted.some((item) => item.key === getFileKey(file))) {
        rejectedMessage = `${file.name} 已在列表中`;
        continue;
      }
      accepted.push({ key: getFileKey(file), file, status: "ready" });
    }

    if (files.length > Math.max(available, 0)) rejectedMessage = `最多同时选择 ${MAX_FILE_COUNT} 个文件`;
    if (accepted.length > 0) setItems((current) => [...current, ...accepted]);
    setMessage(rejectedMessage || (accepted.length > 0 ? `已添加 ${accepted.length} 个文件` : "没有添加新文件"));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    addFiles(Array.from(event.target.files || []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>): void {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function removeFile(key: string): void {
    if (uploading) return;
    setItems((current) => current.filter((item) => item.key !== key));
    setMessage("已移除文件");
  }

  async function handleUpload(): Promise<void> {
    const pending = items.filter((item) => item.status === "ready" || item.status === "error");
    if (pending.length === 0) {
      setMessage("没有待上传文件");
      return;
    }

    const startedAt = Date.now();
    let successCount = 0;
    let failedCount = 0;
    setUploading(true);

    for (const item of pending) {
      setItems((current) => current.map((currentItem) => currentItem.key === item.key
        ? { ...currentItem, status: "uploading", error: undefined }
        : currentItem));
      try {
        const result = await uploadFile(item.file);
        successCount += 1;
        setItems((current) => current.map((currentItem) => currentItem.key === item.key
          ? { ...currentItem, status: "success", result }
          : currentItem));
      } catch (error) {
        failedCount += 1;
        setItems((current) => current.map((currentItem) => currentItem.key === item.key
          ? { ...currentItem, status: "error", error: getErrorMessage(error) }
          : currentItem));
      }
    }

    const result = failedCount === 0 ? "SUCCESS" : successCount === 0 ? "FAIL" : "PARTIAL";
    telemetry.track("demo.file.upload", {
      eventType: "BUSINESS",
      module: "demo",
      bizType: "file",
      result,
      duration: Date.now() - startedAt,
      properties: { fileCount: pending.length, successCount, failedCount },
    });
    setMessage(`上传完成：成功 ${successCount} 个，失败 ${failedCount} 个`);
    setUploading(false);
  }

  return (
    <section aria-labelledby="file-upload-demo-title">
      <div className="demo-desktop-heading demo-desktop-heading-with-back">
        <div>
          <p className="demo-desktop-kicker">FILE / UPLOAD</p>
          <h1 id="file-upload-demo-title">文件上传</h1>
          <p>上传到平台文件服务，验证 Multipart 请求和返回文件 ID。</p>
        </div>
        <Button variant="ghost" onClick={onBack}>返回 Demo 首页</Button>
      </div>

      <div className="demo-desktop-sections">
        <Card className="demo-desktop-section">
          <h2>选择文件</h2>
          <label
            className={`demo-desktop-upload-zone${dragging ? " demo-desktop-upload-zone-dragging" : ""}`}
            htmlFor="demo-file-upload-input"
            onDragEnter={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragging(false);
            }}
            onDrop={handleDrop}
          >
            <span className="demo-desktop-upload-icon">↑</span>
            <strong>点击选择文件，或拖拽到这里</strong>
            <span>最多 5 个文件，单个文件不超过 20 MB</span>
          </label>
          <input
            ref={inputRef}
            id="demo-file-upload-input"
            className="demo-desktop-upload-input"
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </Card>

        <Card className="demo-desktop-section">
          <div className="demo-desktop-upload-list-heading">
            <div>
              <h2>文件列表</h2>
              <p className="demo-desktop-test-note">上传成功后只展示服务端返回的文件 ID，不保存本地路径或文件内容。</p>
            </div>
            <span className="demo-desktop-upload-count">{items.length} / {MAX_FILE_COUNT}</span>
          </div>

          {items.length === 0 ? (
            <p className="demo-desktop-upload-empty">暂未选择文件</p>
          ) : (
            <div className="demo-desktop-file-list">
              {items.map((item) => (
                <div className="demo-desktop-file-item" key={item.key}>
                  <div className="demo-desktop-file-info">
                    <strong title={item.file.name}>{item.file.name}</strong>
                    <span>{formatFileSize(item.file.size)} · {item.file.type || "未知类型"}</span>
                  </div>
                  <div className={`demo-desktop-file-status demo-desktop-file-status-${item.status}`}>
                    {item.status === "uploading" && <Spinner />}
                    <span>{getStatusText(item)}</span>
                    {item.status !== "uploading" && (
                      <Button
                        variant="ghost"
                        onClick={() => removeFile(item.key)}
                        disabled={uploading}
                        aria-label={`移除 ${item.file.name}`}
                      >
                        移除
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="demo-desktop-upload-actions">
            <Button onClick={() => void handleUpload()} disabled={uploading || items.length === 0}>
              {uploading ? "正在上传…" : "开始上传"}
            </Button>
            <span className="demo-desktop-upload-message" aria-live="polite">{message}</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
