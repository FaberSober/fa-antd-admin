import { portalComposition } from '../app/portal-profile';

function readArgument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requireValue(value: string | undefined, message: string): string {
  if (!value?.trim()) throw new Error(message);
  return value.trim();
}

function assertCondition(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function routeUrl(siteUrl: URL, routePath: string): URL {
  const portalPath = siteUrl.pathname.replace(/\/$/, '');
  return new URL(`${portalPath}${ensureLeadingSlash(routePath)}`, siteUrl.origin);
}

async function request(url: URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, {
    redirect: 'manual',
    ...init,
  });
  console.log(`${init?.method || 'GET'} ${url.pathname} -> ${response.status}`);
  return response;
}

function assertPortalHeaders(response: Response, label: string): void {
  const csp = response.headers.get('content-security-policy') || '';
  assertCondition(csp.includes("default-src 'self'"), `${label} 缺少 Portal CSP`);
  assertCondition(response.headers.get('x-content-type-options') === 'nosniff', `${label} 缺少 nosniff`);
}

const configuredUrl = requireValue(
  readArgument('--url') || process.env.PORTAL_VERIFY_URL,
  '请通过 --url 或 PORTAL_VERIFY_URL 提供站点地址，例如 http://127.0.0.1:19001/portal/',
);
const siteUrl = new URL(configuredUrl.endsWith('/') ? configuredUrl : `${configuredUrl}/`);
assertCondition(['http:', 'https:'].includes(siteUrl.protocol), '验收地址只允许 http/https');
assertCondition(
  siteUrl.pathname === portalComposition.profile.site.baseUrl,
  `验收地址路径必须为 ${portalComposition.profile.site.baseUrl}`,
);

const spaPath = ensureLeadingSlash(readArgument('--spa-path') || '/account');
const portalWithoutSlash = new URL(siteUrl.pathname.replace(/\/$/, ''), siteUrl.origin);

const redirectResponse = await request(portalWithoutSlash);
assertCondition([301, 302, 307, 308].includes(redirectResponse.status), '/portal 必须重定向到尾斜杠路径');
assertCondition(
  new URL(requireValue(redirectResponse.headers.get('location') || undefined, '/portal 重定向缺少 Location'), siteUrl).pathname
    === siteUrl.pathname,
  '/portal 重定向目标错误',
);

const homeResponse = await request(siteUrl);
assertCondition(homeResponse.status === 200, 'Portal 首页访问失败');
assertPortalHeaders(homeResponse, 'Portal 首页');
assertCondition((homeResponse.headers.get('cache-control') || '').includes('no-cache'), 'Portal HTML 必须使用 no-cache');
const homeHtml = await homeResponse.text();
assertCondition(homeHtml.includes('<div id="root"></div>'), 'Portal 首页不是 Vite SPA 入口');

const spaResponse = await request(routeUrl(siteUrl, spaPath));
assertCondition(spaResponse.status === 200, `SPA 深链 ${spaPath} 访问失败`);
assertCondition((await spaResponse.text()).includes('<div id="root"></div>'), `SPA 深链 ${spaPath} 未命中 SPA fallback`);

const assetMatch = homeHtml.match(/(?:href|src)=["']([^"']*\/portal\/assets\/[^"']+\.js)["']/);
assertCondition(Boolean(assetMatch), 'Portal 首页未找到 hash JavaScript 资源');
const assetResponse = await request(new URL(assetMatch![1], siteUrl), {
  headers: { 'Accept-Encoding': 'br, gzip' },
});
assertCondition(assetResponse.status === 200, 'Portal hash 资源访问失败');
const assetCacheControl = assetResponse.headers.get('cache-control') || '';
assertCondition(
  assetCacheControl.includes('max-age=31536000') && assetCacheControl.includes('immutable'),
  'Portal hash 资源缓存策略不是一年 immutable',
);
assertCondition(
  ['br', 'gzip'].includes(assetResponse.headers.get('content-encoding') || ''),
  'Portal hash 资源未启用 gzip/Brotli',
);

const missingAssetResponse = await request(routeUrl(siteUrl, '/assets/missing-phase5-verification.js'));
assertCondition(missingAssetResponse.status === 404, '缺失静态资源没有返回 404');
assertCondition(
  !(missingAssetResponse.headers.get('content-type') || '').includes('text/html'),
  '缺失静态资源错误返回了 HTML',
);

const robotsResponse = await request(new URL('/robots.txt', siteUrl.origin));
assertCondition(robotsResponse.status === 200, 'robots.txt 访问失败');
assertCondition((robotsResponse.headers.get('cache-control') || '').includes('max-age=300'), 'robots.txt 缓存策略错误');

const sitemapResponse = await request(new URL('sitemap.xml', siteUrl));
assertCondition(sitemapResponse.status === 200, 'sitemap.xml 访问失败');
assertCondition((sitemapResponse.headers.get('cache-control') || '').includes('max-age=300'), 'sitemap.xml 缓存策略错误');
assertCondition(
  (sitemapResponse.headers.get('content-type') || '').includes('xml'),
  'sitemap.xml Content-Type 错误',
);

console.log(
  `Portal production verification passed: profile=${portalComposition.profile.id}, url=${siteUrl}, spa=${spaPath}`,
);
