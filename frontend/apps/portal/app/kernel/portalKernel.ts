import type { PortalNavigationItem, PortalRouteDefinition } from './feature';

export const portalKernelRoutes = [
  { id: 'kernel.status', path: 'status', file: 'routes/status.tsx' },
  { id: 'kernel.forbidden', path: 'forbidden', file: 'routes/forbidden.tsx' },
  { id: 'kernel.not-found', path: '*', file: 'routes/not-found.tsx' },
] as const satisfies readonly PortalRouteDefinition[];

export const portalKernelNavigation = [] as const satisfies readonly PortalNavigationItem[];
