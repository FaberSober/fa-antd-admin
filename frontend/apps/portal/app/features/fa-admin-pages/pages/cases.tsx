import { Link, type MetaFunction } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import styles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';
import { portalCases } from '../content/articles';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '客户案例｜FA Portal',
    description: '了解 FA AI 在企业知识、数据分析和智能流程中的实践案例。',
    path: '/cases',
  });

export default function CasesPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: '客户案例' }]} />
          <p className={styles.eyebrow}>CUSTOMER STORIES</p>
          <h1>从真实问题到可持续的结果</h1>
          <p className={styles.lead}>每个场景都从业务目标、数据条件和使用者体验开始设计。</p>
        </div>
      </header>
      <section className={styles.section}>
        <div className={styles.contentGrid}>
          {portalCases.map((article) => (
            <article className={styles.contentCard} key={article.slug}>
              <span className={styles.tag}>{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <Link to={`/cases/${article.slug}`}>阅读案例 →</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
