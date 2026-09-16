import { createPortalMeta } from '../kernel/seo';
import type { MetaFunction } from 'react-router-dom';
import { PortalErrorPage } from '../shared/ui/PortalErrorPage';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '无权访问｜FA Portal',
    description: '当前账号没有访问该页面的权限。',
    path: '/forbidden',
    noIndex: true,
  });

export default function ForbiddenPage() {
  return <PortalErrorPage status={403} title="无权访问" description="当前账号没有访问该页面的权限。" />;
}
