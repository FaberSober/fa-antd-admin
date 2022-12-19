import { Outlet } from 'react-router-dom';
import ApiEffectLayout from '@/layout/ApiEffectLayout';
import UserLayout from '@/layout/UserLayout';
import MenuLayout from '@/layout/menu/MenuLayout';
import LangLayout from '@/layout/LangLayout';
import { PageLoading } from '@fa/ui';
import { Suspense } from 'react';

export default function Admin() {
  return (
    <LangLayout>
      <ApiEffectLayout>
        <UserLayout>
          <MenuLayout>
            <Suspense fallback={<PageLoading />}>
              <Outlet />
            </Suspense>
          </MenuLayout>
        </UserLayout>
      </ApiEffectLayout>
    </LangLayout>
  );
}
