import { Button, Card } from "@fa/core-desktop";
import type { BaseUser } from "./types";
import type { ReactNode } from "react";

export interface HomePageProps {
  user: BaseUser;
  loggingOut: boolean;
  onLogout(): Promise<void>;
  children?: ReactNode;
}

function displayValue(value: string | number | null | undefined): string {
  return value === null || value === undefined || String(value).trim() === "" ? "未填写" : String(value);
}

function getInitials(user: BaseUser): string {
  const source = (user.name || user.username || "FA").trim();
  return Array.from(source).slice(0, 2).join("").toUpperCase();
}

export function HomePage({ user, loggingOut, onLogout, children }: HomePageProps) {
  const displayName = displayValue(user.name) === "未填写" ? user.username : displayValue(user.name);
  const fields = [
    ["账号", user.username],
    ["姓名", user.name],
    ["部门", user.departmentName],
    ["职位", user.postName],
    ["角色", user.roleNames],
    ["手机号", user.tel],
    ["邮箱", user.email],
  ] as const;

  return (
    <main className="base-home-page">
      <header className="home-topbar">
        <div className="home-brand">
          <span className="home-brand-mark">FA</span>
          <span>Faber Desktop</span>
        </div>
        <div className="home-topbar-actions">
          <span className="home-session-state">
            <span className="signal-dot" /> 已连接
          </span>
          <Button variant="ghost" onClick={() => void onLogout()} disabled={loggingOut}>
            {loggingOut ? "正在退出…" : "退出登录"}
          </Button>
        </div>
      </header>

      <div className="home-content">
        <section className="home-intro" aria-labelledby="home-title">
          <p className="home-kicker">BASE / OVERVIEW</p>
          <h1 id="home-title">你好，{displayName}</h1>
          <p>这是 Desktop 的第一个业务首页。更多终端功能将在后续 Feature 中逐步接入。</p>
        </section>

        <Card className="user-info-card">
          <div className="user-info-heading">
            <div className="user-avatar" aria-hidden="true">
              {getInitials(user)}
            </div>
            <div>
              <p className="user-info-kicker">CURRENT USER</p>
              <h2>{displayName}</h2>
              <p>身份信息已从 fa-base 服务加载</p>
            </div>
          </div>

          <dl className="user-info-grid">
            {fields.map(([label, value]) => (
              <div key={label} className="user-info-item">
                <dt>{label}</dt>
                <dd>{displayValue(value)}</dd>
              </div>
            ))}
          </dl>
        </Card>
        {children}
      </div>
    </main>
  );
}
