import { BaseDesktopApp, createBaseDesktopApi, HomePage } from "@fa/base-desktop";
import { DemoDesktopEntry, DemoDesktopFeature } from "@fa/demo-desktop";
import { httpClient, tokenStore } from "../runtime/client";
import { telemetry } from "../runtime/telemetry";
import { useEffect, useState } from "react";

const baseDesktopApi = createBaseDesktopApi(httpClient);

function App() {
  const [view, setView] = useState<"home" | "demo">("home");

  useEffect(() => {
    if (view === "demo") {
      telemetry.page({ route: "demo", pageTitle: "Desktop Demo" });
    }
  }, [view]);

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
