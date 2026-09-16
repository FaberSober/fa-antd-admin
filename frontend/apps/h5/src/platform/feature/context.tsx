import { createContext, type ReactNode, useContext } from 'react';
import type { H5Registry } from './types';

const H5RegistryContext = createContext<H5Registry | null>(null);

interface H5RegistryProviderProps {
  children: ReactNode;
  registry: H5Registry;
}

export function H5RegistryProvider({ children, registry }: H5RegistryProviderProps) {
  return <H5RegistryContext.Provider value={registry}>{children}</H5RegistryContext.Provider>;
}

export function useH5Registry(): H5Registry {
  const registry = useContext(H5RegistryContext);
  if (!registry) {
    throw new Error('useH5Registry 必须在 H5RegistryProvider 内使用');
  }
  return registry;
}
