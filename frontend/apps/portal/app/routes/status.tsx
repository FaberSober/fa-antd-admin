import { createPortalMeta } from '../kernel/seo';
import type { MetaFunction } from 'react-router-dom';
import styles from '../shared/styles/page.module.css';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '内核状态｜FA Portal',
    description: 'FA Portal Phase 1 轻量内核能力清单。',
    path: '/status',
    noIndex: true,
  });

const capabilities = [
  ['Router', 'Framework Mode、路由级拆包和 /portal basename'],
  ['HTTP', '原生 fetch、超时、取消、Token 与流式响应基础'],
  ['Auth', '统一 Authorization Token、当前用户和受保护路由'],
  ['SEO', '页面 title、description、canonical 与 Open Graph'],
  ['UI', 'Root Layout、Loading、403、404 与 Error Boundary'],
  ['CSS', 'Design Tokens、响应式断点与 reduced-motion'],
];

export default function StatusPage() {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>PHASE 1</p>
      <h1>轻量内核已就位</h1>
      <p className={styles.lead}>这一层只包含所有 Portal 项目都需要的通用能力，不包含具体官网或 AI 业务代码。</p>
      <div className={styles.grid}>
        {capabilities.map(([title, description]) => (
          <article className={styles.card} key={title}>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
