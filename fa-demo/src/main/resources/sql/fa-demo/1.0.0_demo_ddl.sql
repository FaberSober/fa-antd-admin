-- ------------------------- info -------------------------
-- @@ver: 1_000_000
-- @@info: 初始化fa-demo模块
-- ------------------------- info -------------------------

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `demo_student` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) NOT NULL COMMENT '学生名',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `sex` tinyint(4) DEFAULT NULL COMMENT '性别',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `valid` tinyint(1) DEFAULT '1' COMMENT '账户是否有效',
  `tags` json DEFAULT NULL COMMENT '标签数组',
  `info` json DEFAULT NULL COMMENT '详细信息',
  `info_id` int(11) DEFAULT NULL COMMENT '补充信息ID',
  `corp_id` int(11) NOT NULL COMMENT '企业ID',
  `tenant_id` int(11) NOT NULL COMMENT '租户ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='DEMO-学生表';

CREATE TABLE IF NOT EXISTS `demo_student_info` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `info1` varchar(255) DEFAULT NULL COMMENT '补充信息1',
    `info2` varchar(255) DEFAULT NULL COMMENT '补充信息2',
    `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
    `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
    `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
    `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
    `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
    `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
    `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
    PRIMARY KEY (`id`) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='DEMO-学生表-扩充信息表';

CREATE TABLE IF NOT EXISTS `demo_tree` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `parent_id` int(11) NOT NULL COMMENT '上级节点',
    `name` varchar(255) NOT NULL COMMENT '名称',
    `sort` int(11) DEFAULT '0' COMMENT '排序ID',
    `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',
    `crt_name` varchar(255) NOT NULL COMMENT '创建用户',
    `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
    `upd_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',
    `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
    `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
    `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
    PRIMARY KEY (`id`) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='DEMO-Tree结构数据';

-- ----------------------------
-- Records of base_rbac_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20000000, 0, '组件示例', 1, 0, 'icons', 1, 1, '/admin/demo', '2023-01-03 16:07:53', '1', '超级管理员1', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010000, 20000000, '通用组件', 0, 1, 'fa-solid fa-cubes', 1, 1, '/admin/demo/biz', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20020000, 20000000, '表格查询', 1, 1, 'fa-solid fa-table', 1, 1, '/admin/demo/table', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20030000, 20000000, '进阶功能', 2, 0, 'fa-solid fa-rocket', 1, 1, '/admin/demo/advance', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20040000, 20000000, '图表展示', 3, 1, 'chart-line', 1, 1, '/admin/demo/chart', '2023-02-23 10:48:58', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010100, 20010000, '图标', 0, 1, '', 1, 1, '/admin/demo/biz/icon', '2023-01-03 16:07:53', '1', '超级管理员1', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010200, 20010000, '权限测试', 1, 1, NULL, 1, 1, '/admin/demo/biz/authTest', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010201, 20010200, '权限按钮', 0, 9, NULL, 1, 1, '/admin/demo/biz/authTest@button1', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010300, 20010000, '地址选择器', 2, 1, NULL, 1, 1, '/admin/demo/biz/areaCascader', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010400, 20010000, '富文本编辑器', 3, 1, NULL, 1, 1, '/admin/demo/biz/tinymce', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010500, 20010000, '文件上传', 4, 1, NULL, 1, 1, '/admin/demo/biz/fileUploader', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010600, 20010000, '级联选择', 6, 1, NULL, 1, 1, '/admin/demo/biz/cascader', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010700, 20010000, '字典选择器', 5, 1, NULL, 1, 1, '/admin/demo/biz/dict', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010800, 20010000, '拖动排序', 9, 1, NULL, 1, 1, '/admin/demo/biz/drag', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20010900, 20010000, '远程数据选择', 8, 1, NULL, 1, 1, '/admin/demo/biz/select', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20011000, 20010000, '远程数据Tree', 7, 1, NULL, 1, 1, '/admin/demo/biz/tree', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20012000, 20010000, 'PDF预览', 11, 1, NULL, 1, 1, '/admin/demo/biz/pdfView', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20013000, 20010000, '路由选择', 10, 1, NULL, 1, 1, '/admin/demo/biz/route', '2023-01-04 14:53:10', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20014000, 20010000, 'tailwindcss', 12, 1, NULL, 1, 1, '/admin/demo/biz/tailwindcss', '2023-01-06 14:20:51', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20015000, 20010000, '日期选择', 13, 1, NULL, 1, 1, '/admin/demo/biz/datepicker', '2023-01-06 16:44:21', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20016000, 20010000, '页面标签', 14, 1, NULL, 1, 1, '/admin/demo/biz/openTabs', '2023-02-13 13:58:35', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20017000, 20010000, '右键菜单', 15, 1, NULL, 1, 1, '/admin/demo/biz/contextMenu', '2023-02-13 14:01:04', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20020100, 20020000, '表格查询', 0, 1, NULL, 1, 1, '/admin/demo/table/table', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20020200, 20020000, '组合查询', 1, 1, NULL, 1, 1, '/admin/demo/table/conditionQuery', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20030100, 20030000, 'socket连接', 0, 1, NULL, 1, 1, '/admin/demo/advance/socket', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20030200, 20030000, 'redis缓存', 1, 1, NULL, 1, 1, '/admin/demo/advance/redis', '2023-01-03 16:07:53', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (20040100, 20040000, 'echarts', 0, 1, NULL, 1, 1, '/admin/demo/chart/echartsDemo', '2023-02-23 10:49:05', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
