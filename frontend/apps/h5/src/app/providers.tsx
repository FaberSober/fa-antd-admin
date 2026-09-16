import { ConfigProvider } from 'antd-mobile';
import type { ReactNode } from 'react';
import { H5RegistryProvider } from '@/platform/feature';
import { h5Registry } from '@/platform/feature/runtime';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ConfigProvider>
      <H5RegistryProvider registry={h5Registry}>{children}</H5RegistryProvider>
    </ConfigProvider>
  );
}
