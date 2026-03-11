import { Outlet } from 'react-router-dom';
import { PageLoading } from '@fa/ui';
import { Suspense } from 'react';
import DiskLayout from '@features/fa-disk-pages/layout/disk/DiskLayout';

export default function Store() {
  return (
    <DiskLayout>
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </DiskLayout>
  );
}
