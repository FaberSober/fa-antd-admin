import { type ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, matchPath, useLocation } from 'react-router-dom';
import { portalRuntime } from '../../../.portal/runtime-profile';
import { useAuth } from '../auth';
import styles from './PortalLayout.module.css';

export function PortalLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const auth = useAuth();
  const isNavigating = false;
  const isImmersive = Boolean(matchPath('/chat/:accessToken', location.pathname));
  const [menuOpen, setMenuOpen] = useState(false);
  const hasAccount = portalRuntime.featureIds.includes('fa-admin-pages');

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.shell} data-immersive={isImmersive}>
      <a className={styles.skipLink} href="#main-content">
        跳到主要内容
      </a>
      <div aria-hidden="true" className={styles.progress} data-visible={isNavigating} />

      {!isImmersive ? (
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link className={styles.brand} to="/" aria-label={`${portalRuntime.site.name} 首页`}>
              <span className={styles.brandMark}>{portalRuntime.site.shortName}</span>
              <span>{portalRuntime.site.name}</span>
            </Link>

            <button
              aria-controls="portal-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
              className={styles.menuButton}
              onClick={() => setMenuOpen((current) => !current)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>

            <nav className={styles.navigation} data-open={menuOpen} id="portal-navigation" aria-label="主导航">
              {portalRuntime.navigation.map((item) => (
                <NavLink className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)} end={item.end} key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className={styles.actions}>
              <a className={styles.adminLink} href="/">
                Admin
              </a>
              {hasAccount ? (
                <Link className={styles.accountLink} to="/account">
                  {auth.status === 'authenticated' ? auth.user?.name || '账户' : '登录'}
                </Link>
              ) : null}
            </div>
          </div>
        </header>
      ) : null}

      <main className={isImmersive ? styles.immersiveMain : styles.main} id="main-content">
        {children}
      </main>

      {!isImmersive ? (
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <strong>{portalRuntime.site.name}</strong>
              <p>{portalRuntime.site.description}</p>
            </div>
            <div className={styles.footerLinks}>
              {portalRuntime.navigation
                .filter((item) => item.order !== undefined && item.order < 900)
                .map((item) => (
                  <Link key={item.key} to={item.to}>
                    {item.label}
                  </Link>
                ))}
            </div>
            <span className={styles.copyright}>
              © {new Date().getFullYear()} {portalRuntime.site.shortName}
            </span>
          </div>
        </footer>
      ) : null}

      <span className={styles.liveRegion} aria-live="polite">
        {isNavigating ? '页面加载中' : ''}
      </span>
    </div>
  );
}
