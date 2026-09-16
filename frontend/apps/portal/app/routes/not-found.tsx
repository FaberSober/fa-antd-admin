import { createPortalMeta } from '../kernel/seo';
import type { MetaFunction } from 'react-router-dom';
import { PortalErrorPage } from '../shared/ui/PortalErrorPage';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '页面不存在｜FA Portal',
    description: '你访问的页面不存在。',
    path: '/404',
    noIndex: true,
  });

export default function NotFoundPage() {
  return <PortalErrorPage status={404} title="页面不存在" description="你访问的页面可能已移动或被删除。" />;
}
