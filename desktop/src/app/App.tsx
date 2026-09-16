import { BaseDesktopApp, createBaseDesktopApi, HomePage } from "@fa/base-desktop";
import { DemoDesktopEntry, DemoDesktopFeature } from "@fa/demo-desktop";
import { httpClient, tokenStore } from "../runtime/client";
import { useState } from "react";

const baseDesktopApi = createBaseDesktopApi(httpClient);

function App() {
  const [view, setView] = useState<"home" | "demo">("home");

  return (
    <BaseDesktopApp
      api={baseDesktopApi}
      tokenStore={tokenStore}
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
            <DemoDesktopEntry onOpen={() => setView("demo")} />
          </HomePage>
        );
      }}
    />
  );
}

export default App;
