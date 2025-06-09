import configAdmin from '@features/fa-admin-pages/configs';
import configDemo from '@features/fa-admin-demo-pages/configs';
import configApp from '@features/fa-app-pages/configs';
import configDisk from '@features/fa-disk-pages/configs';

import { merge } from 'lodash';

interface SITE_INFO_TYPES {
  [key: string]: any;
  PRIMARY_COLOR: string; // 主题色
  THEME: 'light' | 'dark'; // 主题
  /** show page tabs */
  SHOW_TABS: boolean;
  HOME_LINK: string;
  HELP_DOCS: { name: string; url: string }[];
  ADMIN_DEFAULT_LAYOUT: any[];
}

/** -------------------------------- 网站配置 -------------------------------- */
const SITE_INFO: SITE_INFO_TYPES = {
  WEB_CONTEXT_TITLE: 'FaberAdmin',
  WEB_CONTEXT_TITLE_FULL: 'FaberAdmin',
  WEB_CONTEXT_DESC_EN: 'Faber Admin Web Management',
  DEPT_NAME: '部门', // 部门名称
  AMAP_KEY: 'xxx', // 高德地图key
  QINIU_ZONE: 'cn-east-2', // 七牛云存储空间配置：z0-华东、z1-华北、z2-华南。具体参考：https://developer.qiniu.com/kodo/1671/region-endpoint-fq
  // AMAP_VERSION: '1.4.15', // 高德地图JS版本
  // 样式相关
  PRIMARY_COLOR: '#1890FF',
  THEME: 'light',
  ICON_FONT_SCRIPTS: [
    '//at.alicdn.com/t/font_2473438_1jgmoopagcl.js', // icon-area, icon-china, icon-Quartzguanli, icon-job, icon-usermanagement, icon-role
  ],
  HELP_DOC_SITE: 'http://doc.xxx.dward.cn/docs/xxx-doc-help',
  HOME_LINK: '/admin/home/desktop', // 首页跳转链接
  HELP_DOCS: [
    // {name: '帮助文档', url: '/help/doc1'}
  ],
  SHOW_TABS: true,
  ADMIN_DEFAULT_LAYOUT: [{ h: 3, i: 'HelloBanner', w: 16, x: 0, y: 0, moved: false, static: false }],
};

const fullConfig: any = merge(configAdmin, configDemo, configDisk, configApp);
// console.log('fullConfig', fullConfig)

/** -------------------------------- 网关配置 -------------------------------- */
const GATE_APP = fullConfig.GATE_APP;

export { SITE_INFO, GATE_APP };
