import styles from '../styles/DownloadPages.module.css';

interface DownloadStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function DownloadState({ title, description, onRetry }: DownloadStateProps) {
  return (
    <main className={styles.page}>
      <section className={styles.statePanel} role="alert">
        <span className={styles.eyebrow}>APP DOWNLOAD</span>
        <h1 className={styles.stateTitle}>{title}</h1>
        <p className={styles.stateDescription}>{description}</p>
        {onRetry ? (
          <button className={styles.secondaryButton} type="button" onClick={onRetry}>
            重试
          </button>
        ) : null}
      </section>
    </main>
  );
}
