import adminFeature from '../features/fa-admin-pages/feature';
import { definePortalProfile } from '../kernel/feature';

export default definePortalProfile({
  id: 'minimal',
  site: {
    name: 'FA Portal',
    shortName: 'FA',
    description: 'FA Portal 最小组合示例。',
    baseUrl: '/portal/',
  },
  features: [adminFeature],
});
