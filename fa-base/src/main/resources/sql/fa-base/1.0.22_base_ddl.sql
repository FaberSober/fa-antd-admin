-- ------------------------- info -------------------------
-- @@ver: 1_000_022
-- @@info: 字典base_dict表增加字段：type数值类型：1-关联列表，2-关联树，3-字符串，4-选择列表；value字典值。增加表base_dict_data。
-- ------------------------- info -------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE `base_dict` ADD COLUMN `type` tinyint(4) NULL COMMENT '数值类型：1-关联列表，2-关联树，3-字符串，4-选择列表' AFTER `description`;
UPDATE base_dict SET type = 4 WHERE type IS NULL;

ALTER TABLE `base_dict` ADD COLUMN `value` varchar(255) NULL COMMENT '字典值' AFTER `options`;

CREATE TABLE IF NOT EXISTS `base_dict_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `parent_id` int(11) DEFAULT NULL COMMENT '上级节点',
  `dict_id` int(11) NOT NULL COMMENT '字典分类ID',
  `sort_id` int(11) DEFAULT '0' COMMENT '排序ID',
  `label` varchar(255) DEFAULT NULL COMMENT '字典键',
  `value` varchar(255) DEFAULT NULL COMMENT '字典值',
  `is_default` tinyint(1) DEFAULT NULL COMMENT '是否默认值：0否 1是',
  `valid` tinyint(1) DEFAULT NULL COMMENT '是否生效：0否 1是',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-字典值';

-- 增加字典值演示数据
BEGIN;
INSERT INTO `base_dict` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `type`, `options`, `value`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (56, 'base_dict_test', '测试字典分组', 0, 3, NULL, 4, '[]', NULL, '2025-07-09 15:40:52', '1', '超级管理员', '127.0.0.1', '2025-07-18 11:41:37', NULL, NULL, NULL, 0);
INSERT INTO `base_dict` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `type`, `options`, `value`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (57, 'base_dict_test_options', '测试字典-选择列表', 56, 0, NULL, 4, '[{\"id\": 1, \"label\": \"选项1\", \"value\": \"1\", \"deleted\": false}, {\"id\": 2, \"label\": \"选项2\", \"value\": \"2\", \"deleted\": false}]', NULL, '2025-07-09 15:41:47', '1', '超级管理员', '127.0.0.1', '2025-07-18 11:41:37', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `type`, `options`, `value`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (58, 'base_dict_test_text', '测试字典-字符串', 56, 1, NULL, 3, '[]', '12', '2025-07-09 15:44:16', '1', '超级管理员', '127.0.0.1', '2025-07-18 11:41:37', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `type`, `options`, `value`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (59, 'base_dict_test_link_options', '测试字典-关联列表', 56, 2, NULL, 1, '[]', NULL, '2025-07-10 10:47:00', '1', '超级管理员', '127.0.0.1', '2025-07-18 11:41:37', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `type`, `options`, `value`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (60, 'base_dict_test_link_tree', '测试字典-关联树', 56, 3, NULL, 2, '[]', NULL, '2025-07-10 10:47:20', '1', '超级管理员', '127.0.0.1', '2025-07-18 11:41:37', '1', '超级管理员', '127.0.0.1', 0);
COMMIT;

BEGIN;
INSERT INTO `base_dict_data` (`id`, `parent_id`, `dict_id`, `sort_id`, `label`, `value`, `is_default`, `valid`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (1, 0, 59, 0, '选项1', '1', 0, 1, '12', '2025-07-10 16:46:44', '1', '超级管理员', '127.0.0.1', '2025-07-18 15:31:10', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_dict_data` (`id`, `parent_id`, `dict_id`, `sort_id`, `label`, `value`, `is_default`, `valid`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (2, 0, 59, 1, '选项2', '2', 0, 1, NULL, '2025-07-10 16:46:54', '1', '超级管理员', '127.0.0.1', '2025-07-18 15:32:19', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_dict_data` (`id`, `parent_id`, `dict_id`, `sort_id`, `label`, `value`, `is_default`, `valid`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (3, 0, 60, 2, '选项1', '1', 1, 1, NULL, '2025-07-10 16:54:34', '1', '超级管理员', '127.0.0.1', '2025-07-18 15:24:32', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_dict_data` (`id`, `parent_id`, `dict_id`, `sort_id`, `label`, `value`, `is_default`, `valid`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (4, 0, 59, 3, '3', '3', 1, 1, '3', '2025-07-11 16:24:18', '1', '超级管理员', '127.0.0.1', '2025-07-18 15:24:32', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_dict_data` (`id`, `parent_id`, `dict_id`, `sort_id`, `label`, `value`, `is_default`, `valid`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (5, 0, 59, 3, '选项3', '3', NULL, 1, '3', '2025-07-11 16:32:05', '1', '超级管理员', '127.0.0.1', '2025-07-18 15:24:32', '1', '超级管理员', '127.0.0.1', 1);
INSERT INTO `base_dict_data` (`id`, `parent_id`, `dict_id`, `sort_id`, `label`, `value`, `is_default`, `valid`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (6, 0, 59, 2, '选项3', '3', 0, 1, '3', '2025-07-11 16:33:23', '1', '超级管理员', '127.0.0.1', '2025-07-18 15:32:47', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_dict_data` (`id`, `parent_id`, `dict_id`, `sort_id`, `label`, `value`, `is_default`, `valid`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (7, 3, 60, 0, '选项1-1', '1-1', 0, 1, NULL, '2025-07-11 17:30:03', '1', '超级管理员', '127.0.0.1', '2025-07-18 15:24:32', '1', '超级管理员', '127.0.0.1', 0);
INSERT INTO `base_dict_data` (`id`, `parent_id`, `dict_id`, `sort_id`, `label`, `value`, `is_default`, `valid`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (8, 0, 60, 3, '选项2', '2', 0, 1, NULL, '2025-07-17 17:04:21', '1', '超级管理员', '127.0.0.1', '2025-07-18 15:33:11', '1', '超级管理员', '127.0.0.1', 0);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
