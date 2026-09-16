import type { ReactNode } from 'react';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>FA H5</span>
        <span className={styles.headerLabel}>移动工作台</span>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
