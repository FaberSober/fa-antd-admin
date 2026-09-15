import { BaseDesktopApp, createBaseDesktopApi } from "@fa/base-desktop";
import { httpClient, tokenStore } from "../runtime/client";

const baseDesktopApi = createBaseDesktopApi(httpClient);

function App() {
  return <BaseDesktopApp api={baseDesktopApi} tokenStore={tokenStore} />;
}

export default App;
