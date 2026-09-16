import styles from './feedback.module.css';

export function PortalLoading({ label = '加载中' }: { label?: string }) {
  return (
    <output className={styles.feedback}>
      <span className={styles.spinner} aria-hidden="true" />
      <p>{label}</p>
    </output>
  );
}
