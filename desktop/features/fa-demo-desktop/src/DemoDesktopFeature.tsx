import { Button } from "@fa/core-desktop";
import { useState } from "react";
import { ButtonDemoPage } from "./ButtonDemoPage";
import { DemoHomePage } from "./DemoHomePage";
import "./styles.css";

export interface DemoDesktopFeatureProps {
  loggingOut: boolean;
  onLogout(): Promise<void>;
  onBack(): void;
}

type DemoView = "home" | "button";

export function DemoDesktopFeature({ loggingOut, onLogout, onBack }: DemoDesktopFeatureProps) {
  const [view, setView] = useState<DemoView>("home");

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
        {view === "home" ? (
          <DemoHomePage onOpenButton={() => setView("button")} />
        ) : (
          <ButtonDemoPage onBack={() => setView("home")} />
        )}
      </div>
    </main>
  );
}
