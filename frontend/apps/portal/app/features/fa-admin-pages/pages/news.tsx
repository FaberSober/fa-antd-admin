import { Link, type MetaFunction } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import styles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';
import { portalNews } from '../content/articles';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '新闻与洞察｜FA Portal',
    description: '查看 FA AI 产品更新、工程实践和团队洞察。',
    path: '/news',
  });

export default function NewsPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: '新闻与洞察' }]} />
          <p className={styles.eyebrow}>NEWS & INSIGHTS</p>
          <h1>分享产品进展与工程思考</h1>
          <p className={styles.lead}>记录我们如何把智能能力做得更可靠、更轻量，也更贴近真实用户。</p>
        </div>
      </header>
      <section className={styles.section}>
        <div className={styles.contentGrid}>
          {portalNews.map((article) => (
            <article className={styles.contentCard} key={article.slug}>
              <span className={styles.tag}>{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <Link to={`/news/${article.slug}`}>阅读全文 →</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
