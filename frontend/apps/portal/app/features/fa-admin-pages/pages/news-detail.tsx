import { type MetaFunction, useParams } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import { PortalErrorPage } from '../../../shared/ui/PortalErrorPage';
import { findPortalArticle } from '../content/articles';
import { ArticleDetail } from './case-detail';

export const meta: MetaFunction = ({ params }) => {
  const article = findPortalArticle('news', params.slug);
  return createPortalMeta({
    title: article ? `${article.title}｜新闻与洞察` : '内容不存在｜FA Portal',
    description: article?.summary ?? '未找到对应内容。',
    path: `/news/${params.slug ?? ''}`,
    noIndex: !article,
    type: 'article',
    structuredData: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          description: article.summary,
          datePublished: article.publishedAt,
          articleSection: article.category,
        }
      : undefined,
  });
};

export default function NewsDetailPage() {
  const article = findPortalArticle('news', useParams().slug);
  if (!article) return <PortalErrorPage status={404} title="内容不存在" description="该内容可能已移动或下线。" />;
  return <ArticleDetail article={article} parentLabel="新闻与洞察" parentPath="/news" />;
}
