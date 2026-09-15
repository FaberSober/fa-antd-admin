import { Alert, Button, Input, Label, Spinner } from "@fa/core-desktop";
import { useState, type FormEvent } from "react";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginPageProps {
  error: string | null;
  loading: boolean;
  onSubmit(credentials: LoginCredentials): Promise<void>;
}

export function LoginPage({ error, loading, onSubmit }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedUsername = username.trim();
    if (!normalizedUsername) {
      setValidationError("请输入账号。");
      return;
    }
    if (!password) {
      setValidationError("请输入密码。");
      return;
    }

    setValidationError(null);
    await onSubmit({ username: normalizedUsername, password });
    setPassword("");
  }

  const displayError = validationError ?? error;

  return (
    <main className="base-login-page">
      <div className="login-grid" aria-hidden="true" />

      <section className="login-signal" aria-label="应用信息">
        <div>
          <div className="login-brand-mark">FA</div>
          <p className="login-overline">FABER / DESKTOP</p>
          <h1>把工作台，带到终端。</h1>
          <p className="login-description">
            独立的桌面入口，连接 Faber 基础服务。当前版本先验证账号登录和用户身份链路。
          </p>
        </div>

        <div className="login-signal-footer">
          <span className="signal-dot" />
          <span>LOCAL SESSION · V0</span>
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-card">
          <div className="login-card-heading">
            <p className="login-card-kicker">BASE CHANNEL / AUTH</p>
            <h2 id="login-title">欢迎回来</h2>
            <p>使用后台账号进入 Desktop 工作台。</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {displayError && <Alert>{displayError}</Alert>}

            <div className="login-field">
              <Label htmlFor="desktop-username">账号</Label>
              <Input
                id="desktop-username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
                placeholder="请输入账号"
                autoComplete="username"
                autoFocus
                disabled={loading}
                aria-invalid={Boolean(validationError && !username.trim())}
              />
            </div>

            <div className="login-field">
              <div className="login-field-label-row">
                <Label htmlFor="desktop-password">密码</Label>
                <span>不会保存密码</span>
              </div>
              <Input
                id="desktop-password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
                disabled={loading}
                aria-invalid={Boolean(validationError && !password)}
              />
            </div>

            <Button className="login-submit" type="submit" disabled={loading}>
              {loading && <Spinner />}
              <span>{loading ? "正在验证…" : "进入工作台"}</span>
            </Button>
          </form>

          <p className="login-footnote">本版本仅在当前程序运行期间保留登录态，关闭程序后需要重新登录。</p>
        </div>
      </section>
    </main>
  );
}
