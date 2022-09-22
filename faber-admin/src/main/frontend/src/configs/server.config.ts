const devMode = process.env.NODE_ENV !== 'production';

/** -------------------------------- 网站配置 -------------------------------- */
export const SITE_INFO = {
	WEB_CONTEXT_TITLE: 'FaberAdmin',
	WEB_CONTEXT_TITLE_FULL: 'FaberAdmin',
	WEB_CONTEXT_DESC_EN: 'Faber Admin Web Management',
	DEPT_NAME: '部门', // 部门名称
	AMAP_KEY: 'xxx', // 高德地图key
	QINIU_ZONE: 'cn-east-2', // 七牛云存储空间配置：z0-华东、z1-华北、z2-华南。具体参考：https://developer.qiniu.com/kodo/1671/region-endpoint-fq
	// AMAP_VERSION: '1.4.15', // 高德地图JS版本
	SOCKET_IO_HOST: devMode ? 'http://127.0.0.1:8081' : 'https://xxx.zzz.cn',
	// 样式相关
	PRIMARY_COLOR: '#1890FF',
	ICON_FONT_SCRIPTS: [
		'//at.alicdn.com/t/font_2473438_1jgmoopagcl.js', // icon-area, icon-china, icon-Quartzguanli, icon-job, icon-usermanagement, icon-role
	],
	HELP_DOC_SITE: 'http://doc.xxx.dward.cn/docs/xxx-doc-help',
	HOME_LINK: '/admin', // 首页跳转链接
};

/** -------------------------------- 网关配置 -------------------------------- */
export const GATE_APP = {
	/** JWT授权服务 */
	auth: '/api/auth',
	/** ADMIN服务 */
	admin: '/api/admin',
	/** article服务 */
	article: '/api/article',
	/** Demo服务 */
	demo: '/api/demo',
	/** rbac服务 */
  rbac: '/api/rbac',
};

/** -------------------------------- WebSocket配置 -------------------------------- */
export const GATE_WS = {
	/** WS接口地址 */
	WS_API: window.location.hostname,
	/** 映射构建任务长链接 */
	WS_API_TASK_BUILD_SERVICE: '/websocket/taskBuildService',
};

/** 服务端返回码 */
export const RES_CODE = {
	OK: 200,
};

/** Token Header字段名 */
export const TOKEN_KEY = 'Authorization';
