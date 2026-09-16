import { Button, Card } from "@fa/core-desktop";

export interface DemoHomePageProps {
  onOpenButton(): void;
  onOpenTelemetry(): void;
  onOpenUpload(): void;
}

export function DemoHomePage({ onOpenButton, onOpenTelemetry, onOpenUpload }: DemoHomePageProps) {
  return (
    <section aria-labelledby="demo-desktop-title">
      <div className="demo-desktop-heading">
        <p className="demo-desktop-kicker">COMPONENT PLAYGROUND</p>
        <h1 id="demo-desktop-title">Desktop Demo</h1>
        <p>按页面查看 Desktop 端基础组件和交互示例。</p>
      </div>

      <div className="demo-desktop-entry-list">
        <Card className="demo-desktop-entry-card">
          <div>
            <h2>按钮样式</h2>
            <p>查看基础变体、禁用状态、加载状态和点击反馈。</p>
          </div>
          <Button onClick={onOpenButton}>查看 Demo</Button>
        </Card>

        <Card className="demo-desktop-entry-card">
          <div>
            <h2>Telemetry</h2>
            <p>测试业务事件、手动异常、Promise 异常和 React 渲染异常上报。</p>
          </div>
          <Button variant="secondary" onClick={onOpenTelemetry}>查看 Demo</Button>
        </Card>

        <Card className="demo-desktop-entry-card">
          <div>
            <h2>文件上传</h2>
            <p>测试文件选择、拖拽上传、大小校验和服务端文件 ID 返回。</p>
          </div>
          <Button variant="secondary" onClick={onOpenUpload}>查看 Demo</Button>
        </Card>
      </div>
    </section>
  );
}
