import { Link, type MetaFunction } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import styles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';
import { portalProducts } from '../content/products';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '产品能力｜FA Portal',
    description: '探索 FA AI 智能体、企业知识与数据问答产品能力。',
    path: '/products',
  });

export default function ProductsPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: '产品能力' }]} />
          <p className={styles.eyebrow}>PRODUCTS</p>
          <h1>面向真实业务的 AI 产品组合</h1>
          <p className={styles.lead}>从内容与数据底座，到面向用户的智能体，把需要的能力按项目组合起来。</p>
        </div>
      </header>
      <section className={styles.section}>
        <div className={styles.contentGrid}>
          {portalProducts.map((product) => (
            <article className={styles.contentCard} key={product.slug}>
              <span className={styles.tag}>{product.label}</span>
              <h3>{product.name}</h3>
              <p>{product.summary}</p>
              <Link to={`/products/${product.slug}`}>查看产品详情 →</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
