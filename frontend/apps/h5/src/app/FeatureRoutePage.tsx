import { lazy, Suspense, useMemo } from 'react';
import { h5Registry } from '@/platform/feature/runtime';
import type { H5RouteId } from '@/platform/feature/types';
import { PageLoading } from '@/shared/components/PageLoading';

interface FeatureRoutePageProps {
  routeId: H5RouteId;
}

export function FeatureRoutePage({ routeId }: FeatureRoutePageProps) {
  const route = h5Registry.routeMap.get(routeId);
  if (!route) throw new Error(`路由 \"${routeId}\" 未注册`);

  const Page = useMemo(() => lazy(route.lazy), [route]);
  return (
    <Suspense fallback={<PageLoading />}>
      <Page />
    </Suspense>
  );
}
