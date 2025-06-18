import { Outlet } from 'react-router-dom';
import { PageLoading } from '@fa/ui';
import { Suspense } from 'react';
import { DiskLayout } from '@/layout';

export default function Store() {
  return (
    <DiskLayout>
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </DiskLayout>
  );
}
