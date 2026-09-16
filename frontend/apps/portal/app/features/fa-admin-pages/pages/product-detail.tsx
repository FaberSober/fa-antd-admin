import { Link, type MetaFunction, useParams } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import styles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';
import { PortalErrorPage } from '../../../shared/ui/PortalErrorPage';
import { findPortalProduct } from '../content/products';

export const meta: MetaFunction = ({ params }) => {
  const product = findPortalProduct(params.slug);
  return createPortalMeta({
    title: product ? `${product.name}｜FA Portal` : '产品不存在｜FA Portal',
    description: product?.summary ?? '未找到对应产品。',
    path: `/products/${params.slug ?? ''}`,
    noIndex: !product,
    structuredData: product
      ? {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: product.name,
          description: product.description,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
        }
      : undefined,
  });
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = findPortalProduct(slug);
  if (!product) return <PortalErrorPage status={404} title="产品不存在" description="该产品可能已下线或地址有误。" />;

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: '产品能力', to: '/products' }, { label: product.name }]} />
          <div className={styles.detailHero}>
            <span className={styles.tag}>{product.label}</span>
            <h1>{product.name}</h1>
            <p className={styles.lead}>{product.description}</p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} to="/contact">
                预约产品交流
              </Link>
              <Link className={styles.secondaryAction} to="/solutions">
                查看解决方案
              </Link>
            </div>
          </div>
        </div>
      </header>
      <section className={styles.section}>
        <div className={styles.split}>
          <div>
            <p className={styles.eyebrow}>CAPABILITIES</p>
            <h2>核心能力</h2>
          </div>
          <div className={styles.prose}>
            <ul>
              {product.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <div className={styles.sectionMuted}>
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>SCENARIOS</p>
              <h2>适用场景</h2>
            </div>
          </div>
          <div className={styles.featureGrid}>
            {product.scenarios.map((scenario, index) => (
              <article className={styles.featureCard} key={scenario}>
                <span className={styles.tag}>0{index + 1}</span>
                <h3>{scenario}</h3>
                <p>围绕目标、数据边界和使用者体验，配置为可持续运营的业务能力。</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
