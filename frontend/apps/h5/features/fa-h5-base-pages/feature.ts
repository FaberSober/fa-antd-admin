import { defineH5Feature } from '@/platform/feature';
import { homeRoute, meRoute } from './routes';

const baseFeature = defineH5Feature({
  id: 'fa-h5-base-pages',
  displayName: 'H5 基础页面',
  order: 10,
  routes: [homeRoute, meRoute],
  navItems: [
    {
      id: 'base-home',
      routeId: homeRoute.id,
      label: '工作台',
      icon: 'home',
      order: 10,
    },
    {
      id: 'base-me',
      routeId: meRoute.id,
      label: '我的',
      icon: 'user',
      order: 100,
    },
  ],
  homeEntries: [
    {
      id: 'base-me-entry',
      routeId: meRoute.id,
      title: '个人中心',
      description: '查看当前移动端会话与项目装配信息。',
      icon: 'user',
      order: 100,
    },
  ],
  lifecycle: { status: 'active' },
});

export default baseFeature;
