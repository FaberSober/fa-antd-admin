import styles from './feedback.module.css';

interface SessionUnavailableProps {
  error: Error | null;
  onRetry: () => Promise<void>;
}

export function SessionUnavailable({ error, onRetry }: SessionUnavailableProps) {
  return (
    <section className={styles.feedback} role="alert">
      <h1>暂时无法确认登录状态</h1>
      <p>{error?.message || '请检查网络后重试。'}</p>
      <button className={styles.primaryAction} type="button" onClick={() => void onRetry()}>
        重新尝试
      </button>
    </section>
  );
}
