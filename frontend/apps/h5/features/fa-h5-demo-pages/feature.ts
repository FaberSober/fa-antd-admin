import { defineH5Feature } from '@/platform/feature';
import { demoRoute } from './routes';

const demoFeature = defineH5Feature({
  id: 'fa-h5-demo-pages',
  displayName: 'H5 装配示例',
  order: 100,
  dependsOn: ['fa-h5-base-pages'],
  routes: [demoRoute],
  navItems: [
    {
      id: 'demo-overview',
      routeId: demoRoute.id,
      label: '示例',
      icon: 'lab',
      order: 50,
    },
  ],
  homeEntries: [
    {
      id: 'demo-overview-entry',
      routeId: demoRoute.id,
      title: '装配示例',
      description: '验证 Feature 路由、导航和首页入口的组合结果。',
      icon: 'lab',
      order: 20,
    },
  ],
  lifecycle: { status: 'active' },
});

export default demoFeature;
