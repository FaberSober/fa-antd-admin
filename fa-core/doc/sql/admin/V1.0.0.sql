/*
 Navicat Premium Data Transfer

 Source Server         : faber-admin-dev-47.105.146.245
 Source Server Type    : MySQL
 Source Server Version : 50727
 Source Host           : 47.105.146.245:3306
 Source Schema         : faber_admin

 Target Server Type    : MySQL
 Target Server Version : 50727
 File Encoding         : 65001

 Date: 27/09/2022 16:39:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_book
-- ----------------------------

CREATE TABLE IF NOT EXISTS `article_book` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `no` varchar(50) DEFAULT NULL COMMENT '编号',
  `name` varchar(50) NOT NULL COMMENT '书名',
  `biz_type` varchar(255) DEFAULT NULL COMMENT '业务类型',
  `biz_id` varchar(255) DEFAULT NULL COMMENT '业务ID',
  `cover` varchar(255) DEFAULT NULL COMMENT '封面图',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `pub` tinyint(1) DEFAULT NULL COMMENT '是否发布',
  `pub_time` datetime DEFAULT NULL COMMENT '发布时间',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='文章-书本';

-- ----------------------------
-- Records of article_book
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for article_detail
-- ----------------------------

CREATE TABLE IF NOT EXISTS `article_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `outline_id` int(11) DEFAULT NULL COMMENT '大纲ID',
  `detail` longtext COMMENT 'html文本',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='文章-详情';

-- ----------------------------
-- Records of article_detail
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for article_outline
-- ----------------------------

CREATE TABLE IF NOT EXISTS `article_outline` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `book_id` int(11) NOT NULL COMMENT '书本ID',
  `detail_id` int(11) DEFAULT NULL COMMENT '详情ID',
  `parent_id` int(11) NOT NULL COMMENT '父级节点',
  `no` varchar(50) DEFAULT NULL COMMENT '章节号',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='文章-大纲';

-- ----------------------------
-- Records of article_outline
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_area
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_area` (
  `id` mediumint(7) unsigned NOT NULL AUTO_INCREMENT,
  `level` tinyint(1) unsigned NOT NULL COMMENT '层级',
  `parent_code` bigint(14) unsigned NOT NULL DEFAULT '0' COMMENT '父级行政代码',
  `area_code` bigint(14) unsigned NOT NULL DEFAULT '0' COMMENT '行政代码',
  `zip_code` mediumint(6) unsigned zerofill NOT NULL DEFAULT '000000' COMMENT '邮政编码',
  `city_code` char(6) NOT NULL DEFAULT '' COMMENT '区号',
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '名称',
  `short_name` varchar(50) NOT NULL DEFAULT '' COMMENT '简称',
  `merger_name` varchar(50) NOT NULL DEFAULT '' COMMENT '组合名',
  `pinyin` varchar(30) NOT NULL DEFAULT '' COMMENT '拼音',
  `lng` decimal(10,6) NOT NULL DEFAULT '0.000000' COMMENT '经度',
  `lat` decimal(10,6) NOT NULL DEFAULT '0.000000' COMMENT '纬度',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idx` (`area_code`) USING BTREE,
  KEY `pidx` (`parent_code`) USING BTREE,
  KEY `level` (`level`) USING BTREE,
  KEY `name` (`name`) USING BTREE,
  KEY `level_name` (`level`,`name`) USING BTREE,
  KEY `short_name` (`short_name`) USING BTREE,
  KEY `level_short_name` (`level`,`short_name`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='BASE-中国行政地区表';

-- ----------------------------
-- Records of base_area
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_biz_file
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_biz_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL COMMENT '附件URL',
  `biz_id` varchar(255) DEFAULT NULL COMMENT '业务ID',
  `biz_type` varchar(255) DEFAULT NULL COMMENT '业务类型',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-通用-业务附件';

-- ----------------------------
-- Records of base_biz_file
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_config
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `buzz_modal` varchar(255) DEFAULT NULL COMMENT '业务模块',
  `type` varchar(255) DEFAULT NULL COMMENT '配置类型',
  `name` varchar(255) DEFAULT NULL COMMENT '配置名称',
  `data` text COMMENT '配置JSON',
  `system` tinyint(1) DEFAULT '0' COMMENT '是否系统',
  `default_scene` tinyint(1) DEFAULT '0' COMMENT '是否默认',
  `hide` tinyint(1) DEFAULT '0' COMMENT '是否隐藏',
  `sort` int(11) DEFAULT NULL COMMENT '排序ID',
  `belong_user_id` varchar(36) DEFAULT NULL COMMENT '所属用户ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统-配置表';

-- ----------------------------
-- Records of base_config
-- ----------------------------
BEGIN;
INSERT INTO `base_config` (`id`, `buzz_modal`, `type`, `name`, `data`, `system`, `default_scene`, `hide`, `sort`, `belong_user_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (3, 'base_log_api', 'TABLE_COLUMNS', '表格字段展示配置', '{\"columns\":[{\"dataIndex\":\"id\",\"tcRequired\":false,\"tcChecked\":true,\"width\":70,\"sort\":0},{\"dataIndex\":\"url\",\"tcChecked\":true,\"sort\":1},{\"dataIndex\":\"method\",\"tcChecked\":true,\"width\":100,\"sort\":2},{\"dataIndex\":\"agent\",\"tcChecked\":false,\"width\":100,\"sort\":3},{\"dataIndex\":\"reqSize\",\"tcChecked\":true,\"width\":100,\"sort\":4},{\"dataIndex\":\"retSize\",\"tcChecked\":true,\"width\":100,\"sort\":5},{\"dataIndex\":\"duration\",\"tcChecked\":true,\"width\":100,\"sort\":6},{\"dataIndex\":\"pro\",\"tcChecked\":true,\"width\":100,\"sort\":7},{\"dataIndex\":\"city\",\"tcChecked\":true,\"width\":100,\"sort\":8},{\"dataIndex\":\"addr\",\"tcChecked\":true,\"width\":150,\"sort\":9},{\"dataIndex\":\"retStatus\",\"tcChecked\":true,\"width\":100,\"sort\":10},{\"dataIndex\":\"crtTime\",\"tcChecked\":true,\"width\":170,\"sort\":11},{\"dataIndex\":\"crtUser\",\"width\":120,\"sort\":12},{\"dataIndex\":\"crtName\",\"tcChecked\":false,\"width\":100,\"sort\":13},{\"dataIndex\":\"crtHost\",\"tcChecked\":true,\"width\":150,\"sort\":14},{\"dataIndex\":\"opr\",\"tcRequired\":true,\"width\":120,\"sort\":15}]}', 0, 0, 0, 0, '1', '2022-09-27 16:37:27', '1', '超级管理员', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for base_department
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_department` (
  `id` varchar(50) NOT NULL COMMENT 'ID',
  `name` varchar(255) NOT NULL COMMENT '部门名称',
  `description` varchar(255) DEFAULT NULL COMMENT '备注',
  `parent_id` varchar(50) NOT NULL COMMENT '父部门ID',
  `sort` int(11) DEFAULT '1' COMMENT '排序',
  `type` varchar(255) DEFAULT NULL COMMENT '类型',
  `manager_id` varchar(50) DEFAULT NULL COMMENT '负责人ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-部门';

-- ----------------------------
-- Records of base_department
-- ----------------------------
BEGIN;
INSERT INTO `base_department` (`id`, `name`, `description`, `parent_id`, `sort`, `type`, `manager_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES ('1', '办公室', NULL, '0', 1, NULL, '1', '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', '2020-06-26 16:07:35', '1', 'admin', '123.116.43.116', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_dict
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_dict` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `type` int(11) DEFAULT NULL COMMENT '字典分组',
  `category` tinyint(1) DEFAULT '0' COMMENT '字典类型：0-文本/1-文件',
  `text` varchar(255) DEFAULT NULL COMMENT '字典文本',
  `value` varchar(255) DEFAULT NULL COMMENT '字典值',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `color` varchar(50) DEFAULT NULL COMMENT '颜色',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建主机',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '最后更新主机',
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-字典值';

-- ----------------------------
-- Records of base_dict
-- ----------------------------
BEGIN;
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (3, 1, 0, 'server_invoke_path_url', 'http://localhost/druid/index.html', 1, 'druid monitor', NULL, '2019-07-03 22:56:47', '1', 'admin', '192.168.199.122', '2019-08-14 15:50:52', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (9, 6, 0, '男', '1', 1, '', NULL, '2019-08-15 21:57:40', '1', 'admin', '127.0.0.1', '2019-10-30 16:41:57', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (10, 6, 0, '女', '2', 2, '', NULL, '2019-08-15 21:57:49', '1', 'admin', '127.0.0.1', '2019-10-30 16:42:01', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (11, 7, 0, '小学', '1', 1, '', NULL, '2019-08-15 21:59:01', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:01', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (12, 7, 0, '中学', '2', 2, '', NULL, '2019-08-15 21:59:22', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:22', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (13, 7, 0, '高中', '3', 3, '', NULL, '2019-08-15 21:59:30', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:30', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (14, 7, 0, '大学', '4', 4, '', NULL, '2019-08-15 21:59:36', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:36', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (15, 7, 0, '研究生', '5', 5, '', NULL, '2019-08-15 21:59:49', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:49', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (16, 7, 0, '博士', '6', 6, '', NULL, '2019-08-15 21:59:56', '1', 'admin', '127.0.0.1', '2019-08-15 21:59:56', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (18, 8, 0, '群众', '1', 1, '', NULL, '2019-08-15 22:02:03', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:03', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (19, 8, 0, '团员', '2', 2, '', NULL, '2019-08-15 22:02:16', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:16', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (20, 8, 0, '党员', '3', 3, '', NULL, '2019-08-15 22:02:22', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:22', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (21, 9, 0, '领导', 'leader', 1, '', NULL, '2019-08-17 09:44:10', '1', 'admin', '127.0.0.1', '2019-08-17 09:44:10', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (22, 9, 0, '员工', 'member', 2, '', NULL, '2019-08-17 09:44:19', '1', 'admin', '127.0.0.1', '2019-08-17 09:44:19', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (23, 11, 0, '省', '0', 1, '省/直辖市，省/特区', NULL, '2019-08-21 10:14:07', '1', 'admin', '127.0.0.1', '2019-08-21 10:14:07', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (24, 11, 0, '市', '1', 2, '市/州，港澳辖区', NULL, '2019-08-21 10:14:43', '1', 'admin', '127.0.0.1', '2019-08-21 10:14:43', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (25, 11, 0, '县', '2', 3, '县/区，台湾市/县', NULL, '2019-08-21 10:15:14', '1', 'admin', '127.0.0.1', '2019-08-21 10:15:14', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (26, 11, 0, '乡', '3', 4, '乡/镇，台湾区/镇', NULL, '2019-08-21 10:15:43', '1', 'admin', '127.0.0.1', '2019-08-21 10:15:43', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (27, 11, 0, '村', '4', 5, '村/社区，台湾街道/村', NULL, '2019-08-21 10:16:08', '1', 'admin', '127.0.0.1', '2019-08-21 10:16:08', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (28, 1, 0, 'camunda_platform', 'http://localhost:8080/camunda-welcome/', 2, 'Camunda Platform', NULL, '2019-09-09 06:06:44', '1', 'admin', '127.0.0.1', '2019-09-09 06:06:44', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (29, 13, 0, '有效', '1', 1, '', NULL, '2019-10-30 14:08:45', '1', 'admin', '127.0.0.1', '2019-10-30 14:08:53', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (30, 13, 0, '冻结', '2', 2, '', NULL, '2019-10-30 14:09:01', '1', 'admin', '127.0.0.1', '2019-10-30 14:09:01', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (31, 6, 0, '保密', '0', 0, '', NULL, '2019-10-30 15:44:11', '1', 'admin', '127.0.0.1', '2019-10-30 15:44:11', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (147, 49, 0, '是', '1', 1, NULL, NULL, '2020-11-05 15:21:51', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:51', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (148, 49, 0, '否', '0', 2, NULL, NULL, '2020-11-05 15:22:02', '1', 'admin', '120.243.220.191', '2020-11-05 15:22:02', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (155, 54, 0, 'system:title', '后台管理系统', 1, NULL, NULL, '2022-08-10 13:59:17', '1', 'admin', '127.0.0.1', '2022-08-10 13:59:17', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (156, 54, 1, 'system:logo', 'http://kgcesi.dward.cn/dict/file/dict/202208/logo_20220810152923.png', 2, NULL, NULL, '2022-08-10 15:30:13', '1', 'admin', '127.0.0.1', '2022-08-10 15:30:13', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (157, 54, 1, 'system:portal:logoWithText', 'http://kgcesi.dward.cn/dict/file/dict/202208/logo_20220810153050.png', 3, NULL, NULL, '2022-08-10 15:30:52', '1', 'admin', '127.0.0.1', '2022-08-10 15:30:52', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict` (`id`, `type`, `category`, `text`, `value`, `sort`, `description`, `color`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (158, 54, 0, 'system:portal:link', 'http://xxx.xxx.com', 4, NULL, NULL, '2022-08-10 15:31:11', '1', 'admin', '127.0.0.1', '2022-08-10 15:31:11', '1', 'admin', '127.0.0.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_dict_type
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_dict_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `code` varchar(255) DEFAULT NULL COMMENT '编码',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `parent_id` int(11) NOT NULL COMMENT '上级节点',
  `sort_id` int(11) DEFAULT '0' COMMENT '排序ID',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建主机',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '最后更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '最后更新人ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '最后更新人',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '最后更新主机',
  `del_state` tinyint(1) DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-字典分类';

-- ----------------------------
-- Records of base_dict_type
-- ----------------------------
BEGIN;
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (1, 'sys_monitor_module', '系统监控模块', 0, 99, '系统监控模块，如druid、health', '2019-07-03 22:50:49', NULL, NULL, '192.168.199.122', '2019-10-31 16:05:06', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (2, 'test', '常用字典', 0, 1, NULL, '2019-08-15 21:03:17', '1', 'admin', '127.0.0.1', '2019-08-15 22:02:42', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (6, 'common_sex', '性别', 12, 1, NULL, '2019-08-15 21:56:54', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:36', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (7, 'common_education', '学历', 12, 2, NULL, '2019-08-15 21:58:47', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:45', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (8, 'common_politics', '政治面貌', 12, 3, NULL, '2019-08-15 22:01:51', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:52', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (9, 'group_user_type', '分组用户类型', 12, 4, NULL, '2019-08-17 09:43:54', '1', 'admin', '127.0.0.1', '2020-06-19 09:50:59', '1', 'admin', '114.242.249.111', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (10, 'common_area', '地区', 2, 1, NULL, '2019-08-21 10:13:03', '1', 'admin', '127.0.0.1', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (11, 'common_area_level', '层级', 10, 1, NULL, '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', '2019-08-21 10:13:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (12, 'common_user', '账户字典', 2, 0, NULL, '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', '2019-10-30 14:07:45', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (13, 'common_user_status', '账户状态', 12, 1, NULL, '2019-10-30 14:08:08', '1', 'admin', '127.0.0.1', '2019-10-30 15:09:06', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (20, 'sys_file_download', '系统文件下载', 2, 3, '系统文件下载：包括文件模板、常用文件', '2019-11-20 10:38:01', '1', 'admin', '127.0.0.1', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (48, 'base_dict', '基础字典', 2, 2, NULL, '2020-11-05 15:21:23', '1', 'admin', '120.243.220.191', '2020-11-05 15:21:38', '1', 'admin', '120.243.220.191', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (49, 'base_dict_bool', '是否', 48, 0, NULL, '2020-11-05 15:21:36', '1', 'admin', '120.243.220.191', '2021-03-25 11:40:35', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `base_dict_type` (`id`, `code`, `name`, `parent_id`, `sort_id`, `description`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (54, 'system', '系统设置', 0, 100, NULL, '2022-08-10 13:58:21', '1', 'admin', '127.0.0.1', '2022-08-10 13:58:21', '1', 'admin', '127.0.0.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_file_save
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_file_save` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) DEFAULT NULL COMMENT '文件名',
  `url` varchar(255) DEFAULT NULL COMMENT 'url',
  `size` int(11) DEFAULT NULL COMMENT '附件大小',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_name` varchar(255) DEFAULT NULL,
  `crt_host` varchar(255) DEFAULT NULL,
  `upd_time` timestamp NULL DEFAULT NULL,
  `upd_user` varchar(255) DEFAULT NULL,
  `upd_name` varchar(255) DEFAULT NULL,
  `upd_host` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户文件表';

-- ----------------------------
-- Records of base_file_save
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_job
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_job` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `job_name` varchar(255) DEFAULT NULL COMMENT '任务名称',
  `cron` varchar(255) DEFAULT NULL COMMENT 'cron表达式',
  `status` tinyint(1) DEFAULT NULL COMMENT '状态:0未启动false/1启动true',
  `clazz_path` varchar(255) DEFAULT NULL COMMENT '任务执行方法',
  `job_desc` varchar(255) DEFAULT NULL COMMENT '任务描述',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户名称',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建用户IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户名称',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新用户IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统定时任务';

-- ----------------------------
-- Records of base_job
-- ----------------------------
BEGIN;
INSERT INTO `base_job` (`id`, `job_name`, `cron`, `status`, `clazz_path`, `job_desc`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (1, '测试任务1', '0 * * * * ?', 0, 'com.faber.config.quartz.customer.JobDemo1', '测试任务111111', '2019-08-21 15:20:22', '1', 'admin', '127.0.0.1', '2022-09-07 17:22:54', '1', 'admin', '127.0.0.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_job_log
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_job_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `job_id` int(11) NOT NULL COMMENT '任务ID',
  `begin_time` datetime NOT NULL COMMENT '创建时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `status` char(1) NOT NULL COMMENT '执行结果：1-执行中/2-成功/9-失败',
  `duration` int(11) unsigned DEFAULT NULL COMMENT '执行花费时间',
  `err_msg` text COMMENT '错误日志',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表';

-- ----------------------------
-- Records of base_job_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_log_api
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_log_api` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `url` text NOT NULL COMMENT '请求URL',
  `method` varchar(10) NOT NULL COMMENT '请求类型',
  `agent` text COMMENT '访问客户端',
  `duration` int(11) NOT NULL COMMENT '请求花费时间',
  `pro` varchar(10) DEFAULT NULL COMMENT '省',
  `city` varchar(10) DEFAULT NULL COMMENT '市',
  `addr` varchar(255) DEFAULT NULL COMMENT '地址',
  `request` longtext COMMENT '请求内容',
  `req_size` int(11) DEFAULT NULL COMMENT '请求体大小',
  `response` longtext COMMENT '返回内容',
  `ret_size` int(11) DEFAULT NULL COMMENT '返回内容大小',
  `ret_status` int(11) NOT NULL COMMENT '返回码',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '操作人ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '操作人',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '操作主机',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-URL请求日志';

-- ----------------------------
-- Records of base_log_api
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_msg
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `from_user_name` varchar(255) NOT NULL COMMENT '来源用户',
  `from_user_id` varchar(50) NOT NULL COMMENT '来源用户ID',
  `to_user_name` varchar(255) NOT NULL COMMENT '接收用户',
  `to_user_id` varchar(50) NOT NULL COMMENT '接收用户ID',
  `content` longtext COMMENT '消息内容',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已读',
  `read_time` datetime DEFAULT NULL COMMENT '已读时间',
  `buzz_type` int(11) DEFAULT NULL COMMENT '业务类型',
  `buzz_id` varchar(255) DEFAULT NULL COMMENT '业务ID',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-消息';

-- ----------------------------
-- Records of base_msg
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_notice
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(50) DEFAULT NULL COMMENT '标题',
  `content` varchar(255) DEFAULT NULL COMMENT '内容',
  `status` tinyint(1) DEFAULT '1' COMMENT '是否有效',
  `strong_notice` tinyint(1) DEFAULT '0' COMMENT '是否强提醒',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-通知与公告';

-- ----------------------------
-- Records of base_notice
-- ----------------------------
BEGIN;
INSERT INTO `base_notice` (`id`, `title`, `content`, `status`, `strong_notice`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (1, 'test', 'testtesttesttesttest', 1, 1, '2022-09-25 10:24:32', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for base_rbac_menu
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_rbac_menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `parent_id` int(11) NOT NULL COMMENT '父级ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `sort` int(11) NOT NULL COMMENT '排序',
  `level` tinyint(4) NOT NULL COMMENT '菜单等级：0-模块/1-一级菜单/2-二级菜单/3-三级菜单/9-按钮',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标标识',
  `status` tinyint(1) NOT NULL COMMENT '是否启用0-禁用/1-启用',
  `link_type` tinyint(4) NOT NULL COMMENT '链接类型【1-内部链接(默认)2-外部链接】',
  `link_url` varchar(255) NOT NULL COMMENT '链接地址【pathinfo#method】',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-权限表';

-- ----------------------------
-- Records of base_rbac_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (1, 0, '首页', 0, 0, 'fa-solid fa-house', 1, 1, '/admin/home', '2022-09-19 14:35:35', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (2, 1, '首页', 0, 2, 'fa-solid fa-house', 1, 1, '/admin/home/home', '2022-09-19 14:59:33', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (3, 0, '系统管理', 1, 0, 'fa-solid fa-gear', 1, 1, '/admin/system', '2022-09-19 16:56:23', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (4, 3, '智能人事', 0, 1, 'fa-solid fa-users', 1, 1, '/admin/system/hr', '2022-09-19 16:58:28', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (5, 3, '系统管理', 1, 1, 'fa-solid fa-gears', 1, 1, '/admin/system/base', '2022-09-19 16:58:56', '1', '超级管理员1', '192.168.1.107', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (6, 3, '个人中心', 2, 1, 'fa-solid fa-user', 1, 1, '/admin/system/account', '2022-09-19 16:59:40', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (7, 4, '用户管理', 0, 2, '', 1, 1, '/admin/system/hr/user', '2022-09-19 17:02:08', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (8, 4, '部门管理', 1, 2, '', 1, 1, '/admin/system/hr/department', '2022-09-19 17:02:30', '1', '超级管理员1', '127.0.0.1', '2022-09-25 09:49:26', '1', '超级管理员1', '192.168.58.1', 1);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (9, 4, '角色权限管理', 2, 2, '', 1, 1, '/admin/system/hr/role', '2022-09-19 17:12:26', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:43', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (10, 5, '菜单管理', 0, 2, NULL, 1, 1, '/admin/system/base/menu', '2022-09-19 17:14:17', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (11, 5, '字典管理', 1, 2, NULL, 1, 1, '/admin/system/base/dict', '2022-09-19 17:14:44', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (12, 5, '中国地区管理', 2, 2, NULL, 1, 1, '/admin/system/base/area', '2022-09-19 17:15:00', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (13, 5, '定时任务', 3, 2, NULL, 1, 1, '/admin/system/base/job', '2022-09-19 17:15:14', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (14, 5, '请求日志', 4, 2, NULL, 1, 1, '/admin/system/base/logApi', '2022-09-19 17:15:33', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (15, 5, '系统公告', 5, 2, NULL, 1, 1, '/admin/system/base/notice', '2022-09-19 17:16:13', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (16, 5, '登录日志', 6, 2, NULL, 1, 1, '/admin/system/base/logLogin', '2022-09-19 17:16:36', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (17, 6, '基本信息', 0, 2, NULL, 1, 1, '/admin/system/account/base', '2022-09-19 17:17:05', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (18, 6, '更新密码', 1, 2, NULL, 1, 1, '/admin/system/account/security', '2022-09-19 17:17:52', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (19, 6, '消息中心', 2, 2, NULL, 1, 1, '/admin/system/account/msg', '2022-09-19 17:18:06', '1', '超级管理员1', '127.0.0.1', '2022-09-19 20:48:33', '1', '超级管理员1', '192.168.58.1', 0);
INSERT INTO `base_rbac_menu` (`id`, `parent_id`, `name`, `sort`, `level`, `icon`, `status`, `link_type`, `link_url`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (20, 2, '图标', 0, 2, '', 1, 1, '/admin/home/home/icon', '2022-09-24 20:53:41', '1', '超级管理员1', '192.168.58.1', '2022-09-24 21:56:00', '1', '超级管理员1', '192.168.58.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_rbac_role
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_rbac_role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) NOT NULL COMMENT '角色名称',
  `remarks` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `status` tinyint(1) NOT NULL COMMENT '是否启用',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-角色表';

-- ----------------------------
-- Records of base_rbac_role
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_role` (`id`, `name`, `remarks`, `status`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (1, '超级管理员', '超级管理员', 1, '2022-09-19 17:34:00', '1', '超级管理员1', '127.0.0.1', '2022-09-19 17:34:14', '1', '超级管理员1', '127.0.0.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_rbac_role_menu
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_rbac_role_menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `menu_id` int(11) NOT NULL COMMENT '权限ID',
  `half_checked` tinyint(1) NOT NULL COMMENT '是否半勾选0-否/1-是',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-角色权限对应表';

-- ----------------------------
-- Records of base_rbac_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (123, 1, 5, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (124, 1, 10, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (125, 1, 11, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (126, 1, 12, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (127, 1, 13, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (128, 1, 14, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (129, 1, 15, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (130, 1, 16, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (131, 1, 7, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (132, 1, 9, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (133, 1, 17, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (134, 1, 19, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (135, 1, 18, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (136, 1, 6, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (137, 1, 1, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (138, 1, 2, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (139, 1, 20, 0, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (140, 1, 4, 1, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
INSERT INTO `base_rbac_role_menu` (`id`, `role_id`, `menu_id`, `half_checked`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (141, 1, 3, 1, '2022-09-25 09:49:08', '1', '超级管理员1', '192.168.58.1', NULL, NULL, NULL, NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for base_rbac_user_role
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_rbac_user_role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` varchar(64) NOT NULL COMMENT '用户ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户角色关联表';

-- ----------------------------
-- Records of base_rbac_user_role
-- ----------------------------
BEGIN;
INSERT INTO `base_rbac_user_role` (`id`, `user_id`, `role_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (1, '1', 1, NULL, NULL, NULL, NULL, '2022-09-20 21:53:08', '1', '超级管理员1', '192.168.58.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for base_sms_code
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_sms_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `phone` varchar(15) NOT NULL COMMENT '手机号',
  `code` varchar(6) NOT NULL COMMENT '短信验证码',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-短信验证码';

-- ----------------------------
-- Records of base_sms_code
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for base_system_update_log
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_system_update_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `ver` int(11) NOT NULL COMMENT '版本号',
  `ver_no` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '版本编码',
  `remark` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '备注信息',
  `crt_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '升级日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='BASE-系统版本更新日志表';

-- ----------------------------
-- Records of base_system_update_log
-- ----------------------------
BEGIN;
INSERT INTO `base_system_update_log` (`id`, `ver`, `ver_no`, `remark`, `crt_time`) VALUES (1, 1, 'V1.0.0', '初始化V1.0.0版本', '2022-08-23 10:37:30');
COMMIT;

-- ----------------------------
-- Table structure for base_user
-- ----------------------------

CREATE TABLE IF NOT EXISTS `base_user` (
  `id` varchar(50) NOT NULL COMMENT 'ID',
  `department_id` varchar(50) NOT NULL COMMENT '部门ID',
  `username` varchar(255) NOT NULL COMMENT '账户',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `name` varchar(255) NOT NULL COMMENT '姓名',
  `tel` varchar(20) DEFAULT NULL COMMENT '手机号',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `sex` tinyint(4) DEFAULT NULL COMMENT '性别0-女1-男2-未知',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `status` tinyint(1) NOT NULL COMMENT '状态：1-有效/0-锁定',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `img` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `api_token` varchar(255) DEFAULT NULL COMMENT 'api token',
  `crt_time` datetime DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` datetime DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='BASE-用户';

-- ----------------------------
-- Records of base_user
-- ----------------------------
BEGIN;
INSERT INTO `base_user` (`id`, `department_id`, `username`, `password`, `name`, `tel`, `birthday`, `sex`, `address`, `email`, `status`, `description`, `img`, `api_token`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES ('1', '1', 'admin', '$2a$12$7NC7F4kdFrmqRPnocvDGpuJ392qGz/K4d7GdNbB2CSnn/CDkOAiBC', '超级管理员', '13811112222', '2000-01-01', 2, '南京市、江宁区、将军大道', 'faberxu@gmail.com', 1, '个人简介', 'http://ztfp-test-file.dward.cn/static/upload/user/img/9362eee0-fd56-11e9-8980-39c97916451b/头像.jpg', 'd1d6e6d1ebcb4437bd082c3046671582', '2022-09-22 21:55:23', '1', 'admin', '127.0.0.1', '2022-08-12 10:49:58', '1', 'admin', '127.0.0.1', 0);
COMMIT;

-- ----------------------------
-- Table structure for demo_student
-- ----------------------------

CREATE TABLE IF NOT EXISTS `demo_student` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) DEFAULT NULL COMMENT '学生名',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `sex` varchar(255) DEFAULT NULL COMMENT '性别',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `valid` tinyint(1) DEFAULT '1' COMMENT '账户是否有效',
  `info_id` int(11) DEFAULT NULL COMMENT '补充信息ID',
  `tenant_id` int(11) DEFAULT NULL COMMENT '租户ID',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表';

-- ----------------------------
-- Records of demo_student
-- ----------------------------
BEGIN;
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (1, 'aa', 2, 'male', 'xxx@qq.com', NULL, 1, 1, 1, '2022-09-15 16:33:14', NULL, NULL, NULL, '2022-09-16 15:06:22', '1', 'admin', '127.0.0.1', 1);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (2, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 0, NULL, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (3, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, NULL, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:26:02', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (4, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 3, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (5, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 4, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (6, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 5, 1, NULL, NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (7, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 6, 1, '2022-09-16 10:52:51', NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (8, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 7, 1, '2022-09-16 10:57:49', NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (9, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 8, 1, '2022-09-16 11:16:33', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (10, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 9, 1, '2022-09-16 11:18:06', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (11, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 10, 1, '2022-09-16 11:18:38', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (12, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 11, 1, '2022-09-16 11:19:57', NULL, NULL, NULL, '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (13, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, 12, 1, '2022-09-16 13:36:18', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (14, 'custom_name', 19, 'female', 'xxx@mail.com', NULL, 1, NULL, 1, '2022-09-16 15:36:55', '1', 'admin', '127.0.0.1', '2022-09-18 19:21:38', '1', 'admin', '127.0.0.1', 0);
INSERT INTO `demo_student` (`id`, `name`, `age`, `sex`, `email`, `birthday`, `valid`, `info_id`, `tenant_id`, `crt_time`, `crt_user`, `crt_name`, `crt_host`, `upd_time`, `upd_user`, `upd_name`, `upd_host`, `del_state`) VALUES (15, '张三', 19, 'female', NULL, NULL, 1, NULL, 1, '2022-09-18 20:29:24', '1', 'admin', '127.0.0.1', NULL, NULL, NULL, NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for demo_student_info
-- ----------------------------

CREATE TABLE IF NOT EXISTS `demo_student_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `info1` varchar(255) DEFAULT NULL COMMENT '补充信息1',
  `info2` varchar(255) DEFAULT NULL COMMENT '补充信息2',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='Demo-学生表-扩充信息表';

-- ----------------------------
-- Records of demo_student_info
-- ----------------------------
BEGIN;
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (1, '字段1', '字段2');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (2, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (3, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (4, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (5, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (6, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (7, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (8, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (9, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (10, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (11, 'info111', 'info222');
INSERT INTO `demo_student_info` (`id`, `info1`, `info2`) VALUES (12, 'info111', 'info222');
COMMIT;

-- ----------------------------
-- Table structure for disk_dir
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_dir` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) DEFAULT NULL COMMENT '文件夹名称',
  `parent_id` int(11) NOT NULL COMMENT '父级节点',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` enum('0','1') DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='云盘/文件夹';

-- ----------------------------
-- Records of disk_dir
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for disk_file
-- ----------------------------

CREATE TABLE IF NOT EXISTS `disk_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `dir_id` int(11) NOT NULL COMMENT '文件夹ID',
  `name` varchar(255) DEFAULT NULL COMMENT '文件名称',
  `type` varchar(255) DEFAULT NULL COMMENT '文件类型',
  `url` varchar(255) DEFAULT NULL COMMENT '文件URL',
  `size` int(11) DEFAULT NULL COMMENT '文件大小(B)',
  `crt_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `crt_user` varchar(255) DEFAULT NULL COMMENT '创建用户ID',
  `crt_name` varchar(255) DEFAULT NULL COMMENT '创建用户',
  `crt_host` varchar(255) DEFAULT NULL COMMENT '创建IP',
  `upd_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `upd_user` varchar(255) DEFAULT NULL COMMENT '更新用户ID',
  `upd_name` varchar(255) DEFAULT NULL COMMENT '更新用户',
  `upd_host` varchar(255) DEFAULT NULL COMMENT '更新IP',
  `del_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0-正常/1-删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='云盘/文件';

-- ----------------------------
-- Records of disk_file
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
