import React from "react";
import ReactDOM from "react-dom/client";
import { TelemetryErrorBoundary } from "@fa/core-desktop";
import App from "./app/App";
import { initTelemetry, telemetry } from "./runtime/telemetry";

async function bootstrap(): Promise<void> {
  await initTelemetry();

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <TelemetryErrorBoundary
      client={telemetry}
      fallback={<main className="base-loading-screen">客户端发生异常，请重启后重试。</main>}
    >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </TelemetryErrorBoundary>,
  );
}

void bootstrap().catch((error: unknown) => {
  telemetry.captureException(error, { module: "desktop", action: "bootstrap" });
  const root = document.getElementById("root");
  if (root) root.textContent = "客户端启动失败，请重启后重试。";
});
