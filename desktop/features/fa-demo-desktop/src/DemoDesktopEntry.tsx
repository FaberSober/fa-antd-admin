import { Button, Card } from "@fa/core-desktop";

export interface DemoDesktopEntryProps {
  onOpen(): void;
}

export function DemoDesktopEntry({ onOpen }: DemoDesktopEntryProps) {
  return (
    <Card className="demo-desktop-entry">
      <div>
        <p className="demo-desktop-entry-kicker">DESKTOP / DEMO</p>
        <h2>Desktop Demo</h2>
        <p>查看桌面端组件和交互示例。</p>
      </div>
      <Button onClick={onOpen}>进入 Demo</Button>
    </Card>
  );
}
