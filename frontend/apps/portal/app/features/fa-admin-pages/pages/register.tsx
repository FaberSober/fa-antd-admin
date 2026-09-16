import { type FormEvent, useState } from 'react';
import { Link, type MetaFunction, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../kernel/auth';
import { createPortalMeta } from '../../../kernel/seo';
import { type RegisterPortalInput, registerPortal } from '../services/auth';
import styles from './auth.module.css';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '注册｜FA Portal',
    description: '注册 FA Portal 统一账号。',
    path: '/register',
    noIndex: true,
  });

const initialForm: RegisterPortalInput = { username: '', name: '', tel: '', password: '', passwordConfirm: '' };

export default function RegisterPage() {
  const auth = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const safeRedirect = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/account';
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (auth.status === 'authenticated') return <Navigate replace to={safeRedirect} />;

  function update(field: keyof RegisterPortalInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!form.username.trim() || !form.name.trim() || !form.tel.trim() || !form.password) {
      setError('请完整填写注册信息。');
      return;
    }
    if (form.password.length < 6) {
      setError('密码至少需要 6 个字符。');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError('两次输入的密码不一致。');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      auth.setSession(await registerPortal({ ...form, username: form.username.trim(), name: form.name.trim(), tel: form.tel.trim() }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '注册失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.intro}>
          <span>ONE ACCOUNT</span>
          <h1>创建一套账号，使用全部 Portal 能力。</h1>
          <p>Portal 注册账号默认不能访问 Admin；后台管理员明确授权后，仍需继续通过 RBAC 权限校验。</p>
        </div>
        <div className={styles.formWrap}>
          <h2>创建账号</h2>
          <p>注册完成后将自动登录</p>
          <form className={styles.form} onSubmit={submit}>
            {[
              ['username', '用户名', 'username'],
              ['name', '姓名', 'name'],
              ['tel', '手机号', 'tel'],
              ['password', '密码', 'new-password'],
              ['passwordConfirm', '确认密码', 'new-password'],
            ].map(([field, label, autoComplete]) => (
              <div className={styles.field} key={field}>
                <label htmlFor={`register-${field}`}>{label}</label>
                <input
                  autoComplete={autoComplete}
                  id={`register-${field}`}
                  maxLength={field === 'password' || field === 'passwordConfirm' ? 64 : 100}
                  onChange={(event) => update(field as keyof RegisterPortalInput, event.target.value)}
                  type={field === 'password' || field === 'passwordConfirm' ? 'password' : 'text'}
                  value={form[field as keyof RegisterPortalInput]}
                />
              </div>
            ))}
            {error ? (
              <p aria-live="polite" className={styles.error}>
                {error}
              </p>
            ) : null}
            <button className={styles.submit} disabled={submitting} type="submit">
              {submitting ? '注册中…' : '注册并登录'}
            </button>
          </form>
          <p className={styles.switch}>
            已有账号？ <Link to={`/login?redirect=${encodeURIComponent(safeRedirect)}`}>返回登录</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
