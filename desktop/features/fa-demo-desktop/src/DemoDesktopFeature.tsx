import { Button, type TelemetryClient } from "@fa/core-desktop";
import { useEffect, useState } from "react";
import { ButtonDemoPage } from "./ButtonDemoPage";
import { DemoHomePage } from "./DemoHomePage";
import { FileUploadDemoPage, type FileUploadResult } from "./FileUploadDemoPage";
import { TelemetryDemoPage } from "./TelemetryDemoPage";
import "./styles.css";

export interface DemoDesktopFeatureProps {
  loggingOut: boolean;
  telemetry: TelemetryClient;
  uploadFile(file: File): Promise<FileUploadResult>;
  onLogout(): Promise<void>;
  onBack(): void;
}

type DemoView = "home" | "button" | "telemetry" | "upload";

export function DemoDesktopFeature({ loggingOut, telemetry, uploadFile, onLogout, onBack }: DemoDesktopFeatureProps) {
  const [view, setView] = useState<DemoView>("home");

  useEffect(() => {
    const pages: Record<DemoView, { route: string; pageTitle: string }> = {
      home: { route: "demo", pageTitle: "Desktop Demo" },
      button: { route: "demo/button", pageTitle: "Button Demo" },
      telemetry: { route: "demo/telemetry", pageTitle: "Telemetry Demo" },
      upload: { route: "demo/upload", pageTitle: "File Upload Demo" },
    };
    telemetry.page(pages[view]);
  }, [telemetry, view]);

  return (
    <main className="demo-desktop-page">
      <header className="demo-desktop-topbar">
        <div className="demo-desktop-brand">
          <span className="demo-desktop-brand-mark">FA</span>
          <span>Faber Desktop</span>
        </div>
        <div className="demo-desktop-topbar-actions">
          <Button variant="ghost" onClick={onBack}>
            返回首页
          </Button>
          <Button variant="secondary" onClick={() => void onLogout()} disabled={loggingOut}>
            {loggingOut ? "正在退出…" : "退出登录"}
          </Button>
        </div>
      </header>

      <div className="demo-desktop-content">
        {view === "home" && (
          <DemoHomePage
            onOpenButton={() => setView("button")}
            onOpenTelemetry={() => setView("telemetry")}
            onOpenUpload={() => setView("upload")}
          />
        )}
        {view === "button" && <ButtonDemoPage onBack={() => setView("home")} />}
        {view === "telemetry" && <TelemetryDemoPage telemetry={telemetry} onBack={() => setView("home")} />}
        {view === "upload" && <FileUploadDemoPage telemetry={telemetry} uploadFile={uploadFile} onBack={() => setView("home")} />}
      </div>
    </main>
  );
}
