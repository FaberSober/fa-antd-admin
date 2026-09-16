import type { PortalRouteDefinition } from '../../kernel/feature';

export const portalAdminRoutes = [
  { id: 'fa-admin-pages.home', index: true, file: 'features/fa-admin-pages/pages/home.tsx' },
  { id: 'fa-admin-pages.company', path: 'about', file: 'features/fa-admin-pages/pages/about.tsx' },
  { id: 'fa-admin-pages.products', path: 'products', file: 'features/fa-admin-pages/pages/products.tsx' },
  { id: 'fa-admin-pages.product-detail', path: 'products/:slug', file: 'features/fa-admin-pages/pages/product-detail.tsx' },
  { id: 'fa-admin-pages.solutions', path: 'solutions', file: 'features/fa-admin-pages/pages/solutions.tsx' },
  { id: 'fa-admin-pages.cases', path: 'cases', file: 'features/fa-admin-pages/pages/cases.tsx' },
  { id: 'fa-admin-pages.case-detail', path: 'cases/:slug', file: 'features/fa-admin-pages/pages/case-detail.tsx' },
  { id: 'fa-admin-pages.news', path: 'news', file: 'features/fa-admin-pages/pages/news.tsx' },
  { id: 'fa-admin-pages.news-detail', path: 'news/:slug', file: 'features/fa-admin-pages/pages/news-detail.tsx' },
  { id: 'fa-admin-pages.contact', path: 'contact', file: 'features/fa-admin-pages/pages/contact.tsx' },
  { id: 'fa-admin-pages.login', path: 'login', file: 'features/fa-admin-pages/pages/login.tsx' },
  { id: 'fa-admin-pages.register', path: 'register', file: 'features/fa-admin-pages/pages/register.tsx' },
  { id: 'fa-admin-pages.account', path: 'account', file: 'features/fa-admin-pages/pages/account.tsx' },
] as const satisfies readonly PortalRouteDefinition[];
