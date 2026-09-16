import { useState } from 'react';
import type { MetaFunction } from 'react-router-dom';
import { logoutPortal, ProtectedRoute, useAuth } from '../../../kernel/auth';
import { createPortalMeta } from '../../../kernel/seo';
import pageStyles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';
import styles from './account.module.css';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '个人中心｜FA Portal',
    description: '查看当前 Portal 用户身份和应用访问状态。',
    path: '/account',
    noIndex: true,
  });

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

function AccountContent() {
  const auth = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const user = auth.user;
  if (!user) return null;

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logoutPortal();
    } finally {
      auth.signOut();
      setSigningOut(false);
    }
  }

  return (
    <>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: '个人中心' }]} />
          <p className={pageStyles.eyebrow}>MY ACCOUNT</p>
          <h1>个人中心</h1>
          <p className={pageStyles.lead}>这里展示 Portal 使用所需的最小身份信息，不加载后台菜单和权限上下文。</p>
        </div>
      </header>
      <section className={pageStyles.section}>
        <div className={styles.shell}>
          <aside className={styles.profile}>
            <div className={styles.avatar}>{(user.name || user.username).slice(0, 1).toUpperCase()}</div>
            <h2>{user.name || user.username}</h2>
            <p>@{user.username}</p>
            <span className={styles.status}>{user.status === false ? '账号已停用' : 'Portal 账号正常'}</span>
            <button className={styles.logout} disabled={signingOut} onClick={signOut} type="button">
              {signingOut ? '退出中…' : '退出登录'}
            </button>
          </aside>
          <div className={styles.panel}>
            <h2>身份信息</h2>
            <dl className={styles.details}>
              <div>
                <dt>用户 ID</dt>
                <dd>{user.id}</dd>
              </div>
              <div>
                <dt>用户名</dt>
                <dd>{user.username}</dd>
              </div>
              <div>
                <dt>手机号</dt>
                <dd>{user.tel || '未设置'}</dd>
              </div>
              <div>
                <dt>邮箱</dt>
                <dd>{user.email || '未设置'}</dd>
              </div>
              <div>
                <dt>Portal 访问</dt>
                <dd>允许</dd>
              </div>
              <div>
                <dt>Admin 访问</dt>
                <dd>{user.adminEnabled ? '已开通，仍需 RBAC 授权' : '未开通'}</dd>
              </div>
            </dl>
            <p className={styles.notice}>Portal 与 Admin 使用同一账号。Admin 访问资格由后台管理员开通，具体菜单和接口继续由角色权限控制。</p>
          </div>
        </div>
      </section>
    </>
  );
}
