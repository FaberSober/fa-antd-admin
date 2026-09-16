import { definePortalFeature } from '../../kernel/feature';
import { portalAiRoutes } from './routes';

export default definePortalFeature({
  id: 'fa-ai-pages',
  dependsOn: ['fa-admin-pages'],
  routes: portalAiRoutes,
});
