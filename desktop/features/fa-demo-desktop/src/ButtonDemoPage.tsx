import { Button, Card, Spinner } from "@fa/core-desktop";
import { useState } from "react";

export interface ButtonDemoPageProps {
  onBack(): void;
}

export function ButtonDemoPage({ onBack }: ButtonDemoPageProps) {
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState("尚未点击按钮");

  function recordAction(label: string): void {
    setLastAction(`最近操作：${label}`);
  }

  return (
    <section aria-labelledby="button-demo-title">
      <div className="demo-desktop-heading demo-desktop-heading-with-back">
        <div>
          <p className="demo-desktop-kicker">BUTTON / STATES</p>
          <h1 id="button-demo-title">按钮样式</h1>
          <p>展示 @fa/core-desktop 当前提供的 Button 变体和基础状态。</p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          返回 Demo 首页
        </Button>
      </div>

      <div className="demo-desktop-sections">
        <Card className="demo-desktop-section">
          <h2>基础变体</h2>
          <div className="demo-desktop-button-row">
            <Button onClick={() => recordAction("Primary")}>Primary</Button>
            <Button variant="secondary" onClick={() => recordAction("Secondary")}>
              Secondary
            </Button>
            <Button variant="ghost" onClick={() => recordAction("Ghost")}>
              Ghost
            </Button>
          </div>
        </Card>

        <Card className="demo-desktop-section">
          <h2>交互状态</h2>
          <div className="demo-desktop-button-row">
            <Button disabled>Disabled</Button>
            <Button disabled={loading} onClick={() => setLoading((current) => !current)}>
              {loading && <Spinner className="demo-desktop-button-spinner" />}
              {loading ? "Loading" : "切换 Loading"}
            </Button>
          </div>
        </Card>

        <Card className="demo-desktop-section">
          <h2>操作反馈</h2>
          <div className="demo-desktop-button-row">
            <Button onClick={() => recordAction("确认操作")}>确认操作</Button>
            <Button variant="secondary" onClick={() => setLastAction("尚未点击按钮")}>
              重置反馈
            </Button>
          </div>
          <p className="demo-desktop-feedback" aria-live="polite">
            {lastAction}
          </p>
        </Card>
      </div>
    </section>
  );
}
