import { defineH5Feature } from '@/platform/feature';
import { buttonDemoRoute, demoRoute } from './routes';

const demoFeature = defineH5Feature({
  id: 'fa-h5-demo-pages',
  displayName: 'H5 组件 Demo',
  order: 100,
  dependsOn: ['fa-h5-base-pages', 'fa-h5-file-preview-pages'],
  routes: [demoRoute, buttonDemoRoute],
  navItems: [
    {
      id: 'demo-overview',
      routeId: demoRoute.id,
      label: 'Demo',
      icon: 'lab',
      order: 50,
    },
  ],
  homeEntries: [
    {
      id: 'demo-overview-entry',
      routeId: demoRoute.id,
      title: 'Demo',
      description: '查看 H5 组件交互与样式示例。',
      icon: 'lab',
      order: 20,
    },
  ],
  lifecycle: { status: 'active' },
});

export default demoFeature;
