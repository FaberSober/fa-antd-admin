-- ------------------------- info -------------------------
-- @@ver: 1_000_024
-- @@info: 更新base_rbac_menu菜单icon为mdi格式图标
-- ------------------------- info -------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 更新首页模块icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:house-outline' WHERE `link_url` = '/admin/home';

-- 更新系统设置模块icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:cog' WHERE `link_url` = '/admin/system';

-- 更新系统管理菜单icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:cogs' WHERE `link_url` = '/admin/system/base';

-- 更新智能人事菜单icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:users-group' WHERE `link_url` = '/admin/system/hr';

-- 更新用户管理icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:users-tick' WHERE `link_url` = '/admin/system/hr/user';

-- 更新角色权限管理icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:clipboard-user' WHERE `link_url` = '/admin/system/hr/role';

-- 更新菜单管理icon（link_url已在1.0.21版本更新为/admin/system/base/menu）
UPDATE `base_rbac_menu` SET `icon` = 'mdi:hamburger-menu' WHERE `link_url` = '/admin/system/base/menu';

-- 更新字典管理icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:dictionary' WHERE `link_url` = '/admin/system/base/dict';

-- 更新中国地区管理icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:map-outline' WHERE `link_url` = '/admin/system/base/area';

-- 更新定时任务icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:calendar-task' WHERE `link_url` = '/admin/system/base/job';

-- 更新请求日志icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:math-log' WHERE `link_url` = '/admin/system/base/logApi';

-- 更新系统公告icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:notice-board' WHERE `link_url` = '/admin/system/base/notice';

-- 更新登录日志icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:login' WHERE `link_url` = '/admin/system/base/logLogin';

-- 更新系统配置icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:application-cog-outline' WHERE `link_url` = '/admin/system/base/config';

-- 更新附件管理icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:file-cog-outline' WHERE `link_url` = '/admin/system/base/fileSave';

-- 更新版本日志icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:blog' WHERE `link_url` = '/admin/system/base/systemUpdateLog';

-- 更新代码生成icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:code-block-tags' WHERE `link_url` = '/admin/system/base/generator';

-- 更新系统新闻icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:newspaper' WHERE `link_url` = '/admin/system/base/sysNews';

-- 更新告警信息icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:alert-octagon' WHERE `link_url` = '/admin/system/base/alert';

-- 更新个人中心菜单icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:ticket-user' WHERE `link_url` = '/admin/system/account';

-- 更新基本信息icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:user-badge' WHERE `link_url` = '/admin/system/account/base';

-- 更新更新密码icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:password-secure' WHERE `link_url` = '/admin/system/account/security';

-- 更新消息中心icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:message-bulleted' WHERE `link_url` = '/admin/system/account/msg';

-- 更新Token管理icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:api' WHERE `link_url` = '/admin/system/account/token';

-- 更新系统监控菜单icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:monitor-eye' WHERE `link_url` = '/admin/system/monitor';

-- 更新数据监控icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:database-eye' WHERE `link_url` = '/admin/system/monitor/druid';

-- 更新服务监控icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:server' WHERE `link_url` = '/admin/system/monitor/server';

-- 更新Redis管理icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:data-settings' WHERE `link_url` = '/admin/system/monitor/redis';

-- 更新日志监控icon
UPDATE `base_rbac_menu` SET `icon` = 'mdi:math-log' WHERE `link_url` = '/admin/system/monitor/logmonitor';

SET FOREIGN_KEY_CHECKS = 1;
