import { Button, Card } from "@fa/core-desktop";

export interface DemoHomePageProps {
  onOpenButton(): void;
}

export function DemoHomePage({ onOpenButton }: DemoHomePageProps) {
  return (
    <section aria-labelledby="demo-desktop-title">
      <div className="demo-desktop-heading">
        <p className="demo-desktop-kicker">COMPONENT PLAYGROUND</p>
        <h1 id="demo-desktop-title">Desktop Demo</h1>
        <p>按页面查看 Desktop 端基础组件和交互示例。</p>
      </div>

      <Card className="demo-desktop-entry-card">
        <div>
          <h2>按钮样式</h2>
          <p>查看基础变体、禁用状态、加载状态和点击反馈。</p>
        </div>
        <Button onClick={onOpenButton}>查看 Demo</Button>
      </Card>
    </section>
  );
}
