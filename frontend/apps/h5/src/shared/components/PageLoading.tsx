import { DotLoading } from 'antd-mobile';
import styles from './StatePage.module.css';

interface PageLoadingProps {
  label?: string;
}

export function PageLoading({ label = '正在加载' }: PageLoadingProps) {
  return (
    <div className={styles.loading} aria-live="polite" aria-busy="true">
      <DotLoading color="primary" />
      <span>{label}</span>
    </div>
  );
}
