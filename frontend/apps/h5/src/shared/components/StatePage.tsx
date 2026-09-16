import type { ReactNode } from 'react';
import styles from './StatePage.module.css';

interface StatePageProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function StatePage({ eyebrow, title, description, children }: StatePageProps) {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children ? <div className={styles.actions}>{children}</div> : null}
      </section>
    </main>
  );
}
