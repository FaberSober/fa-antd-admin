import { definePortalFeature } from '../../kernel/feature';
import { portalAdminRoutes } from './routes';
import { portalCases, portalNews } from './content/articles';
import { portalProducts } from './content/products';

export default definePortalFeature({
  id: 'fa-admin-pages',
  routes: portalAdminRoutes,
  navigation: [
    { key: 'fa-admin-pages.home', label: '首页', to: '/', order: 0, end: true },
    { key: 'fa-admin-pages.company', label: '关于我们', to: '/about', order: 10 },
    { key: 'fa-admin-pages.products', label: '产品', to: '/products', order: 20 },
    { key: 'fa-admin-pages.solutions', label: '解决方案', to: '/solutions', order: 30 },
    { key: 'fa-admin-pages.cases', label: '案例', to: '/cases', order: 40 },
    { key: 'fa-admin-pages.news', label: '洞察', to: '/news', order: 50 },
    { key: 'fa-admin-pages.contact', label: '联系', to: '/contact', order: 70 },
  ],
  prerenderPaths: [
    '/',
    '/about',
    '/products',
    '/solutions',
    '/cases',
    '/news',
    '/contact',
    ...portalProducts.map((product) => `/products/${product.slug}`),
    ...portalCases.map((article) => `/cases/${article.slug}`),
    ...portalNews.map((article) => `/news/${article.slug}`),
  ],
});
