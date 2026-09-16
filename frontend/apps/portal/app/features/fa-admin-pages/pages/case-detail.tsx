import { type MetaFunction, useParams } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import styles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';
import { PortalErrorPage } from '../../../shared/ui/PortalErrorPage';
import { findPortalArticle } from '../content/articles';

export const meta: MetaFunction = ({ params }) => {
  const article = findPortalArticle('case', params.slug);
  return createPortalMeta({
    title: article ? `${article.title}｜客户案例` : '案例不存在｜FA Portal',
    description: article?.summary ?? '未找到对应案例。',
    path: `/cases/${params.slug ?? ''}`,
    noIndex: !article,
    type: 'article',
    structuredData: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.summary,
          datePublished: article.publishedAt,
          articleSection: article.category,
        }
      : undefined,
  });
};

export default function CaseDetailPage() {
  const article = findPortalArticle('case', useParams().slug);
  if (!article) return <PortalErrorPage status={404} title="案例不存在" description="该案例可能已移动或下线。" />;
  return <ArticleDetail article={article} parentLabel="客户案例" parentPath="/cases" />;
}

function ArticleDetail({
  article,
  parentLabel,
  parentPath,
}: {
  article: NonNullable<ReturnType<typeof findPortalArticle>>;
  parentLabel: string;
  parentPath: string;
}) {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: parentLabel, to: parentPath }, { label: article.title }]} />
          <div className={styles.detailHero}>
            <span className={styles.tag}>{article.category}</span>
            <h1>{article.title}</h1>
            <p className={styles.lead}>{article.summary}</p>
            <div className={styles.detailMeta}>
              <span>{article.publishedAt}</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </header>
      <section className={styles.section}>
        <article className={styles.prose}>
          {article.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </article>
      </section>
    </>
  );
}

export { ArticleDetail };
