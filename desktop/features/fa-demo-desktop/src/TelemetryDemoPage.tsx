import { Button, Card, TelemetryErrorBoundary, type TelemetryClient } from "@fa/core-desktop";
import { useState } from "react";

export interface TelemetryDemoPageProps {
  telemetry: TelemetryClient;
  onBack(): void;
}

function ReactErrorTrigger() {
  const [shouldThrow, setShouldThrow] = useState(false);
  if (shouldThrow) throw new Error("Desktop Telemetry Demo React render exception");

  return <Button onClick={() => setShouldThrow(true)}>触发 React 渲染异常</Button>;
}

interface ReactErrorBoundaryDemoProps {
  telemetry: TelemetryClient;
  onAction(message: string): void;
}

function ReactErrorBoundaryDemo({ telemetry, onAction }: ReactErrorBoundaryDemoProps) {
  const [boundaryKey, setBoundaryKey] = useState(0);

  return (
    <TelemetryErrorBoundary
      key={boundaryKey}
      client={telemetry}
      fallback={
        <div className="demo-desktop-error-fallback" role="alert">
          <p>局部异常已被 Error Boundary 捕获。</p>
          <Button
            variant="ghost"
            onClick={() => {
              setBoundaryKey((current) => current + 1);
              onAction("已恢复 React 异常测试区域");
            }}
          >
            恢复测试区域
          </Button>
        </div>
      }
    >
      <ReactErrorTrigger />
    </TelemetryErrorBoundary>
  );
}

export function TelemetryDemoPage({ telemetry, onBack }: TelemetryDemoPageProps) {
  const [lastAction, setLastAction] = useState("尚未执行测试");
  const [demoRunId] = useState(() => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

  function sendEvent(): void {
    telemetry.track("demo.telemetry.event", {
      eventType: "ACTION",
      module: "demo",
      properties: { testCase: "event", demoRunId },
    });
    setLastAction("已触发业务事件：demo.telemetry.event");
  }

  function captureError(): void {
    try {
      throw new Error("Desktop Telemetry Demo manual exception");
    } catch (error) {
      telemetry.captureException(error, { module: "demo", testCase: "manual", demoRunId });
      setLastAction("已触发手动异常上报");
    }
  }

  function rejectPromise(): void {
    void Promise.reject(new Error("Desktop Telemetry Demo unhandled rejection"));
    setLastAction("已触发未处理 Promise 异常，请检查异常事件");
  }

  return (
    <section aria-labelledby="telemetry-demo-title">
      <div className="demo-desktop-heading demo-desktop-heading-with-back">
        <div>
          <p className="demo-desktop-kicker">TELEMETRY / TESTS</p>
          <h1 id="telemetry-demo-title">Telemetry</h1>
          <p>验证 Desktop 端事件和异常是否能送达到后端 Telemetry Collector。</p>
        </div>
        <Button variant="ghost" onClick={onBack}>返回 Demo 首页</Button>
      </div>

      <div className="demo-desktop-sections">
        <Card className="demo-desktop-section demo-desktop-telemetry-status">
          <div>
            <h2>SDK 状态</h2>
            <p>未配置 appKey 时，测试按钮仍可操作，但不会发送网络请求。</p>
          </div>
          <strong>{telemetry.isInitialized() ? "已初始化" : "未初始化"}</strong>
        </Card>

        <Card className="demo-desktop-section">
          <h2>业务事件</h2>
          <p className="demo-desktop-test-note">事件编码固定为 demo.telemetry.event，demoRunId 仅用于后台检索本次测试。</p>
          <div className="demo-desktop-button-row">
            <Button onClick={sendEvent}>发送测试事件</Button>
          </div>
        </Card>

        <Card className="demo-desktop-section">
          <h2>异常上报</h2>
          <p className="demo-desktop-test-note">Promise 异常可能同时出现在开发工具控制台，这是浏览器的预期行为。</p>
          <div className="demo-desktop-button-row">
            <Button onClick={captureError}>手动捕获异常</Button>
            <Button variant="secondary" onClick={rejectPromise}>触发未处理 Promise</Button>
          </div>
          <div className="demo-desktop-error-boundary-demo">
            <ReactErrorBoundaryDemo telemetry={telemetry} onAction={setLastAction} />
          </div>
        </Card>

        <Card className="demo-desktop-section">
          <h2>最近操作</h2>
          <p className="demo-desktop-feedback" aria-live="polite">{lastAction}</p>
        </Card>
      </div>
    </section>
  );
}
