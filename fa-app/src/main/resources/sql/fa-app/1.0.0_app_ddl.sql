-- ------------------------- info -------------------------
-- @@ver: 1_000_000
-- @@info: 初始化fa-app模块
-- ------------------------- info -------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for app_apk
-- ----------------------------

CREATE TABLE IF NOT EXISTS `app_apk` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) NOT NULL COMMENT '应用名称',
  `application_id` varchar(255) NOT NULL COMMENT '应用包名',
  `version_code` int(11) NOT NULL COMMENT '当前版本号',
  `version_name` varchar(255) NOT NULL COMMENT '当前版本名称',
  `icon_id` varchar(32) NOT NULL COMMENT '图标文件ID',
  `file_id` varchar(32) NOT NULL COMMENT 'APK文件ID',
  `size` bigint(20) DEFAULT NULL COMMENT '文件大小',
  `short_code` varchar(4) NOT NULL COMMENT '短链',
  `remark` text COMMENT '最近版本信息',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='APP-APK表';

-- ----------------------------
-- Table structure for app_apk_crash
-- ----------------------------

CREATE TABLE IF NOT EXISTS `app_apk_crash` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `app_id` int(11) NOT NULL COMMENT '应用ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `application_id` varchar(255) NOT NULL COMMENT '应用包名',
  `version_code` int(11) NOT NULL COMMENT '版本号',
  `version_name` varchar(255) NOT NULL COMMENT '版本名称',
  `message` text COMMENT '错误日志',
  `detail` text COMMENT '崩溃日志详情',
  `crash_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '崩溃时间',
  `rom_info` varchar(255) DEFAULT NULL COMMENT 'rom信息',
  `device_manufacturer` varchar(255) DEFAULT NULL COMMENT '设备厂商',
  `device_model` varchar(255) DEFAULT NULL COMMENT '设备型号',
  `android_version` varchar(32) DEFAULT NULL COMMENT 'android版本',
  `android_sdk` int(4) DEFAULT NULL COMMENT 'sdk版本',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='APP-APK崩溃日志表';


-- ----------------------------
-- Table structure for app_apk_version
-- ----------------------------

CREATE TABLE IF NOT EXISTS `app_apk_version` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `app_id` int(11) NOT NULL COMMENT '应用ID',
  `name` varchar(255) NOT NULL COMMENT '应用名称',
  `application_id` varchar(255) NOT NULL COMMENT '应用包名',
  `version_code` int(11) NOT NULL COMMENT '版本号',
  `version_name` varchar(255) NOT NULL COMMENT '版本名称',
  `icon_id` varchar(32) NOT NULL COMMENT '图标文件ID',
  `file_id` varchar(32) NOT NULL COMMENT 'APK文件ID',
  `size` bigint(20) DEFAULT NULL COMMENT '文件大小',
  `remark` text COMMENT '版本信息',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='APP-APK版本表';

-- ----------------------------
-- Records of base_rbac_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (21000000, 0, 'APP管理', 3, 0, 'mobile-retro', 1, 1, '/admin/app', '2023-01-20 14:22:45', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);

INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (21010000, 21000000, 'APP版本管理', 0, 1, 'store', 1, 1, '/admin/app/app/apk', '2023-01-20 14:23:14', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `deleted`) VALUES (21020000, 21000000, 'APP崩溃日志', 1, 1, 'burst', 1, 1, '/admin/app/crash/apkCrash', '2023-01-20 14:23:29', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
