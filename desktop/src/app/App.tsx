import { BaseDesktopApp, createBaseDesktopApi, HomePage } from "@fa/base-desktop";
import { DemoDesktopEntry, DemoDesktopFeature, type FileUploadResult } from "@fa/demo-desktop";
import { httpClient, tokenStore } from "../runtime/client";
import { telemetry } from "../runtime/telemetry";
import { useState } from "react";
import { UpdateCard } from "./UpdateCard";
import "./styles.css";

const baseDesktopApi = createBaseDesktopApi(httpClient);

function uploadDemoFile(file: File): Promise<FileUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  return httpClient.post<FileUploadResult>("/base/admin/fileSave/upload", formData);
}

function App() {
  const [view, setView] = useState<"home" | "demo">("home");

  return (
    <BaseDesktopApp
      api={baseDesktopApi}
      tokenStore={tokenStore}
      telemetry={telemetry}
      renderHome={(homeProps) => {
        if (view === "demo") {
          return (
            <DemoDesktopFeature
              loggingOut={homeProps.loggingOut}
              telemetry={telemetry}
              uploadFile={uploadDemoFile}
              onLogout={async () => {
                await homeProps.onLogout();
                setView("home");
              }}
              onBack={() => setView("home")}
            />
          );
        }

        return (
          <HomePage {...homeProps}>
            <UpdateCard />
            <DemoDesktopEntry
              onOpen={() => {
                telemetry.track("demo.open", { eventType: "ACTION", module: "demo" });
                setView("demo");
              }}
            />
          </HomePage>
        );
      }}
    />
  );
}

export default App;
