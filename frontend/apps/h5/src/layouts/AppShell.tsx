import type { ReactNode } from 'react';
import { useH5Registry } from '@/platform/feature';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const registry = useH5Registry();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <span className={styles.brand}>{registry.project.title}</span>
          <p className={styles.subtitle}>
            {registry.project.id} · {registry.featureIds.length} Features
          </p>
        </div>
        <span className={styles.stage}>BETA</span>
      </header>
      <main className={styles.content}>
        {children}
      </main>
      <footer className={styles.footer}>M2 Module Composition</footer>
    </div>
  );
}
