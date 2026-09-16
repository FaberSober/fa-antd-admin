import type { PortalRouteDefinition } from '../../kernel/feature';

export const portalAiRoutes = [
  { id: 'fa-ai-pages.chat', path: 'chat/:accessToken', file: 'features/fa-ai-pages/pages/chat.tsx' },
] as const satisfies readonly PortalRouteDefinition[];
