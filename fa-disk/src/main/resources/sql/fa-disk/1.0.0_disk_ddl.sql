-- ------------------------- info -------------------------
-- @@ver: 1_000_000
-- @@info: 初始化fa-disk模块
-- ------------------------- info -------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for disk_store_bucket
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_bucket` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) NOT NULL COMMENT '库名称',
  `size` bigint(20) DEFAULT NULL COMMENT '总文件大小',
  `dir_count` int(11) DEFAULT NULL COMMENT '目录数量',
  `file_count` int(11) DEFAULT NULL COMMENT '文件数量',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='STORE-库';

-- ----------------------------
-- Table structure for disk_store_bucket_user
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_bucket_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `bucket_id` int(11) NOT NULL COMMENT '库ID',
  `user_id` varchar(32) NOT NULL COMMENT '用户ID',
  `type` tinyint(4) NOT NULL COMMENT '类型1-创建者/2-操作者',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='STORE-库-人员关联';

-- ----------------------------
-- Table structure for disk_store_file
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `bucket_id` int(11) NOT NULL COMMENT '库ID',
  `name` varchar(255) NOT NULL COMMENT '文件夹名称',
  `parent_id` int(11) NOT NULL COMMENT '父级节点',
  `sort` int(11) DEFAULT NULL COMMENT '排序ID',
  `dir` tinyint(1) DEFAULT NULL COMMENT '是否文件夹',
  `size` int(11) unsigned DEFAULT NULL COMMENT '文件大小(目录下文件数量/KB)',
  `type` varchar(255) DEFAULT NULL COMMENT '文件类型',
  `file_id` varchar(64) DEFAULT NULL COMMENT '文件ID',
  `full_path` varchar(1000) DEFAULT NULL COMMENT '完整路径#dir#,#dir#',
  `tags` json DEFAULT NULL COMMENT '标签',
  `info` varchar(255) DEFAULT NULL COMMENT '文件信息',
  `delete_action` tinyint(1) DEFAULT NULL COMMENT '是否有删除动作',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='STORE-文件夹';

-- ----------------------------
-- Table structure for disk_store_file_tag
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_file_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `file_id` int(11) NOT NULL COMMENT '文件ID',
  `tag_id` int(11) NOT NULL COMMENT '标签ID',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='STORE-文件-标签';

-- ----------------------------
-- Table structure for disk_store_tag
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_store_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `bucket_id` int(11) NOT NULL COMMENT '库ID',
  `parent_id` int(11) NOT NULL COMMENT '父ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `sort` int(11) NOT NULL COMMENT '排序ID',
  `color` varchar(10) NOT NULL COMMENT '颜色',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='STORE-标签';

-- ----------------------------
-- Records of base_job
-- ----------------------------
BEGIN;
INSERT INTO `base_job` (`id`, `job_name`, `cron`, `status`, `clazz_path`, `job_desc`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (2, '[网盘][文件库]同步文件库信息', '0 0/1 * * * ?', 1, 'com.faber.api.disk.store.jobs.JobSyncBucketInfo', NULL, '2022-12-30 16:33:47', '1', '超级管理员', '127.0.0.1', '2022-12-30 16:34:10', '1', '超级管理员', '127.0.0.1', 0);
COMMIT;

-- ----------------------------
-- Records of base_rbac_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22000000, 0, '文档管理', 2, 0, 'floppy-disk', 1, 1, '/admin/disk', '2022-12-22 09:48:01', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22010000, 22000000, '文件仓库', 0, 1, 'store', 1, 1, '/admin/disk/buckets', '2022-12-23 10:23:29', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (22020000, 22000000, '文件网盘', 1, 1, 'laptop-file', 1, 1, '/admin/disk/store', '2022-12-22 09:49:00', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
