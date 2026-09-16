import { Link } from 'react-router-dom';
import styles from './feedback.module.css';

interface PortalErrorPageProps {
  status: number;
  title: string;
  description: string;
  asMain?: boolean;
}

export function PortalErrorPage({ status, title, description, asMain = false }: PortalErrorPageProps) {
  const content = (
    <>
      <p className={styles.errorCode}>{status}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className={styles.primaryAction} to="/">
        返回首页
      </Link>
    </>
  );

  return asMain ? <main className={styles.errorPage}>{content}</main> : <section className={styles.errorPage}>{content}</section>;
}
