import { type FormEvent, useState } from 'react';
import { Link, type MetaFunction, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../kernel/auth';
import { createPortalMeta } from '../../../kernel/seo';
import { loginPortal } from '../services/auth';
import styles from './auth.module.css';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '登录｜FA Portal',
    description: '登录 FA Portal，继续使用智能体和个人服务。',
    path: '/login',
    noIndex: true,
  });

function safeRedirect(value: string | null): string {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/account';
}

export default function LoginPage() {
  const auth = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = safeRedirect(searchParams.get('redirect'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (auth.status === 'authenticated') return <Navigate replace to={redirect} />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!username.trim() || !password) {
      setError('请输入账号和密码。');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      auth.setSession(await loginPortal(username.trim(), password));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '登录失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.intro}>
          <span>FA PORTAL</span>
          <h1>欢迎回来，继续你的智能工作。</h1>
          <p>一套账号连接 Portal 与 Admin，应用资格和业务权限在后端分层校验。</p>
        </div>
        <div className={styles.formWrap}>
          <h2>账号登录</h2>
          <p>使用用户名或手机号登录</p>
          <form className={styles.form} onSubmit={submit}>
            <div className={styles.field}>
              <label htmlFor="login-username">账号</label>
              <input autoComplete="username" id="login-username" maxLength={64} onChange={(event) => setUsername(event.target.value)} value={username} />
            </div>
            <div className={styles.field}>
              <label htmlFor="login-password">密码</label>
              <input
                autoComplete="current-password"
                id="login-password"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </div>
            {error ? (
              <p aria-live="polite" className={styles.error}>
                {error}
              </p>
            ) : null}
            <button className={styles.submit} disabled={submitting} type="submit">
              {submitting ? '登录中…' : '登录'}
            </button>
          </form>
          <p className={styles.switch}>
            还没有账号？ <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}>立即注册</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
