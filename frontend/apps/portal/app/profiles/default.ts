import adminFeature from '../features/fa-admin-pages/feature';
import aiFeature from '../features/fa-ai-pages/feature';
import { definePortalProfile } from '../kernel/feature';

export default definePortalProfile({
  id: 'default',
  site: {
    name: 'FA Portal',
    shortName: 'FA',
    description: '轻量、独立且可组合的 FA Portal。',
    baseUrl: '/portal/',
  },
  features: [adminFeature, aiFeature],
});
