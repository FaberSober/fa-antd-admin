import { Link } from 'react-router-dom';
import styles from '../styles/page.module.css';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="面包屑" className={styles.breadcrumbs}>
      <Link to="/">首页</Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.to ?? 'current'}`}>
          <span aria-hidden="true">/</span>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
