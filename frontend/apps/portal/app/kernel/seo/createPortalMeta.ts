import type { MetaDescriptor } from 'react-router-dom';
import { portalEnv } from '../config';

export interface PortalSeoMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown> | readonly Record<string, unknown>[];
}

function createCanonicalUrl(path: string): string | undefined {
  if (!portalEnv.siteUrl) return undefined;

  const relativePath = path.replace(/^\/+/, '');
  return new URL(relativePath, portalEnv.siteUrl).toString();
}

export function createPortalMeta({
  title,
  description,
  path,
  image,
  noIndex = false,
  type = 'website',
  structuredData,
}: PortalSeoMeta): MetaDescriptor[] {
  const canonicalUrl = createCanonicalUrl(path);
  const webPageSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
  };
  const schemas = structuredData ? [webPageSchema, ...(Array.isArray(structuredData) ? structuredData : [structuredData])] : [webPageSchema];
  const descriptors: MetaDescriptor[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { 'script:ld+json': schemas },
  ];

  if (canonicalUrl) {
    descriptors.push({ tagName: 'link', rel: 'canonical', href: canonicalUrl }, { property: 'og:url', content: canonicalUrl });
  }

  if (image) descriptors.push({ property: 'og:image', content: image }, { name: 'twitter:image', content: image });
  if (noIndex) descriptors.push({ name: 'robots', content: 'noindex,nofollow' });

  return descriptors;
}
