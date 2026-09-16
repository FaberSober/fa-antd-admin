import { mkdirSync, writeFileSync } from 'node:fs';
import { portalComposition } from '../app/portal-profile';
import { assertBuildExists, clientDirectory, portalBaseUrl, portalOutputDirectory, resolveSiteUrl } from './build-utils';

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function toAbsoluteUrl(siteUrl: string, path: string): string {
  return new URL(path.replace(/^\/+/, ''), siteUrl).toString();
}

assertBuildExists();

const siteUrl = resolveSiteUrl();
const sitemapUrl = new URL('sitemap.xml', siteUrl.value).toString();
const sitemapEntries = portalComposition.prerenderPaths
  .map((path) => `  <url>\n    <loc>${escapeXml(toAbsoluteUrl(siteUrl.value, path))}</loc>\n  </url>`)
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
const privatePaths = ['login', 'register', 'account', 'chat/'];
const robots = [
  'User-agent: *',
  `Allow: ${portalBaseUrl}`,
  ...privatePaths.map((path) => `Disallow: ${portalBaseUrl}${path}`),
  `Sitemap: ${sitemapUrl}`,
  '',
].join('\n');

mkdirSync(portalOutputDirectory, { recursive: true });
writeFileSync(`${portalOutputDirectory}/sitemap.xml`, sitemap, 'utf8');
writeFileSync(`${clientDirectory}/robots.txt`, robots, 'utf8');

if (siteUrl.fallback) {
  console.warn(`Portal SEO warning: VITE_PORTAL_SITE_URL 未配置，sitemap 暂时使用 ${siteUrl.value}`);
}
console.log(`Portal public assets generated: ${portalComposition.prerenderPaths.length} sitemap URLs, robots.txt`);
