import { ApiError, Spinner, type TokenStore } from "@fa/core-desktop";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { HomePage, type HomePageProps } from "./HomePage";
import { LoginPage, type LoginCredentials } from "./LoginPage";
import type { BaseDesktopApi } from "./api";
import type { BaseUser } from "./types";
import "@fa/core-desktop/styles.css";
import "./styles.css";

export interface BaseDesktopAppProps {
  api: BaseDesktopApi;
  tokenStore: TokenStore;
  renderHome?: (props: HomePageProps) => ReactNode;
}

type Screen = "loading" | "login" | "home";

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return "请求失败，请稍后重试。";
}

function LoadingScreen() {
  return (
    <main className="base-loading-screen" aria-live="polite">
      <Spinner />
      <span>正在验证登录状态…</span>
    </main>
  );
}

export function BaseDesktopApp({ api, tokenStore, renderHome }: BaseDesktopAppProps) {
  const [screen, setScreen] = useState<Screen>(() => (tokenStore.get() ? "loading" : "login"));
  const [user, setUser] = useState<BaseUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadCurrentUser = useCallback(
    async (fallbackMessage: string): Promise<boolean> => {
      setScreen("loading");
      setError(null);

      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
        setScreen("home");
        return true;
      } catch (loadError) {
        tokenStore.clear();
        setUser(null);
        setScreen("login");
        setError(loadError instanceof ApiError ? loadError.message : fallbackMessage);
        return false;
      }
    },
    [api, tokenStore],
  );

  useEffect(() => {
    if (!tokenStore.get()) {
      return;
    }
    void loadCurrentUser("登录状态校验失败，请重新登录。");
  }, [loadCurrentUser, tokenStore]);

  async function handleLogin(credentials: LoginCredentials): Promise<void> {
    setSubmitting(true);
    setError(null);

    try {
      const loginToken = await api.login(credentials.username, credentials.password);
      if (!loginToken.tokenValue || !loginToken.tokenValue.trim()) {
        throw new ApiError("登录响应缺少有效令牌。");
      }

      tokenStore.set(loginToken.tokenValue);
      await loadCurrentUser("登录成功，但获取当前用户信息失败，请稍后重试。");
    } catch (loginError) {
      tokenStore.clear();
      setUser(null);
      setScreen("login");
      setError(getErrorMessage(loginError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout(): Promise<void> {
    setLoggingOut(true);
    try {
      await api.logout();
    } catch {
      // 无论服务端退出是否成功，都清理当前运行时的登录态。
    } finally {
      tokenStore.clear();
      setUser(null);
      setError(null);
      setScreen("login");
      setLoggingOut(false);
    }
  }

  if (screen === "loading") {
    return <LoadingScreen />;
  }

  if (screen === "home" && user) {
    const homeProps: HomePageProps = { user, loggingOut, onLogout: handleLogout };
    return renderHome ? renderHome(homeProps) : <HomePage {...homeProps} />;
  }

  return <LoginPage error={error} loading={submitting} onSubmit={handleLogin} />;
}
